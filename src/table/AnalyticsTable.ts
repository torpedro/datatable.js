import {
  CoreColumnTable,
  Row
} from './CoreColumnTable';
import { FieldDescriptor } from './FieldDescriptor';
import { OrderedSet } from '../data/OrderedSet';
import { HashMap } from '../data/HashMap';
import { vec } from '../data/VectorOperations';
import { agg as aggs } from './operators/agg';

export class AnalyticsTable extends CoreColumnTable {
  // Alias to the aggregation module
  public agg: any = aggs;

  // Returns a table grouped by the specified fields
  // Can handle function selectors
  groupBy(column: string|FieldDescriptor, aggregations?: aggs.Aggregation[]): AnalyticsTable;
  groupBy(columns: (string|FieldDescriptor)[], aggregations?: aggs.Aggregation[]): AnalyticsTable;
  groupBy(_groupFields: any, aggregations?: aggs.Aggregation[]): AnalyticsTable {
    // If the function was called with a single group by column
    // call it again with an array.
    if (!aggregations) aggregations = [];
    if (!(_groupFields instanceof Array)) return this.groupBy([_groupFields], aggregations);
    let fields: FieldDescriptor[] = convertListOfFieldDescriptors(_groupFields);

    // Create result field list
    let outputFields: string[] = [];
    for (let i: number = 0; i < fields.length; ++i) {
      outputFields.push(fields[i].outputName);
    }

    for (let k: number = 0; k < aggregations.length; ++k) {
      if (aggregations[k].aggName) outputFields.push(aggregations[k].aggName);
      else if (aggregations[k].name) outputFields.push(aggregations[k].name);
      else outputFields.push('Aggregation ' + k);
    }

    // Create hash map (mapping by equality).
    let map: HashMap<string[], any[]> = new HashMap<any, any[]>(false);

    for (let r: number = 0; r < this.count(); ++r) {
      let key: string[] = [];
      for (let c: number = 0; c < fields.length; ++c) {
        key.push(fields[c].getValue(this, r));
      }

      if (map.contains(key)) {
        map.get(key).push(this.row(r));
      } else {
        map.set(key, [this.row(r)]);
      }
    }

    // Create the result table
    let result: AnalyticsTable = new AnalyticsTable({
      fields: outputFields
    });

    let keys: string[][] = map.keys();
    for (let k: number = 0; k < keys.length; ++k) {
      let row: Row = [];

      // Add the grouped columns
      for (let c: number = 0; c < keys[k].length; ++c) {
        row.push(keys[k][c]);
      }

      // Add the aggregated columns
      for (let a: number = 0; a < aggregations.length; ++a) {
        row.push(aggregations[a](map.get(keys[k]), this));
      }

      result.insert([row]);
    }

    return result;
  }




  // Returns a table with only rows where the predicate evaluated to true.
  filter(predicate: Function): AnalyticsTable {
    // TODO: figure out how to be able to address columns in predicate by name
    let result: AnalyticsTable = new AnalyticsTable({
      fields: this.fieldset.toArray(),
      types: this.types()
    });
    for (let r: number = 0; r < this.count(); ++r) {
      let row: any[] = this.row(r);
      if (predicate(row)) {
        result.addRow(row);
      }
    }
    return result;
  }

  // Returns all distinct values of the specified field
  // TODO: FieldDescriptor
  // TODO: mutltiple fields
  distinctValues(field: string): OrderedSet {
    return new OrderedSet(this.column(field));
  }

  // Returns a Table with only the specified fields (Similar to SQLs SELECT clause)
  // Can handle FieldDescriptors functions
  select(field: string): AnalyticsTable;
  select(field: FieldDescriptor): AnalyticsTable;
  select(fields: (string|FieldDescriptor)[]): AnalyticsTable;
  select(_fields: any): AnalyticsTable {
    // Format the data input
    if (!(_fields instanceof Array)) return this.select([_fields]);
    let inFields: FieldDescriptor[] = convertListOfFieldDescriptors(_fields);

    let columns: any[][] = [];
    let resFields: string[] = [];
    let types: string[] = [];

    for (let i: number = 0; i < inFields.length; ++i) {
      let field: FieldDescriptor = inFields[i];

      if (field.isStatic) {
        // A simple field was selected
        columns.push(this.column(field.name).slice());
        types.push(this.type(field.name));
        resFields.push(field.outputName);

      } else {
        resFields.push(field.outputName);

        // Function selector
        // Build a new column vector
        let vector: any[] = [];
        for (let j: number = 0; j < this.count(); ++j) {
          let value: any = field.getValue(this, j);
          vector.push(value);
        }

        types.push(vec.detectDataType(vector));
        columns.push(vector);
      }
    }

    return new AnalyticsTable({
      fields: resFields,
      types: types,
      columns: columns
    });
  }


  // Returns a Table where the column was split into multiple columns
  // TODO: FieldDescriptor
  splitColumn(field: string, groupField: string): AnalyticsTable {
    // Find all result field names
    let categories: any[] = this.distinctValues(field).toArray();
    let fields: string[] = [groupField];
    let types: string[] = [this.type(groupField)];
    let valueFields: any = [];

    for (let c: number = 0; c < this.numFields(); ++c) {
      if (this.fieldset.get(c) !== field && this.fieldset.get(c) !== groupField) {
        valueFields.push(this.fieldset.get(c));
      }
    }

    for (let cat: number = 0; cat < categories.length; ++cat) {
      for (let f: number = 0; f < valueFields.length; ++f) {
        let newField: string = valueFields[f] + ' (' + categories[cat] + ')';
        fields.push(newField);
        types.push(this.type(valueFields[f]));
      }
    }

    // Build HashMap
    // Map( group -> map( category -> Array(valueFields) ) )
    let map: HashMap<any, {}> = new HashMap<any, {}>(false);

    for (let r: number = 0; r < this.count(); ++r) {
      let key: any = this.value(r, groupField);
      if (!map.contains(key)) {
        map.set(key, {});
      }

      let category: any = this.value(r, field);
      let obj: {} = map.get(key);
      obj[category] = [];
      for (let f: number = 0; f < valueFields.length; ++f) {
        obj[category].push(this.value(r, valueFields[f]));
      }
    }


    let result: AnalyticsTable = new AnalyticsTable({
      fields: fields,
      types: types
    });

    // Build rows
    let keys: any[] = map.keys();
    for (let k: number = 0; k < keys.length; ++k) {
      let obj: {} = map.get(keys[k]);
      let row: any[] = [keys[k]];

      // Loop over categories and valueFields
      for (let c: number = 0; c < categories.length; ++c) {
        if (!(categories[c] in obj)) {
          for (let f: number = 0; f < valueFields.length; ++f) {
            row.push(null);
          }
        } else {
          let values: any = obj[categories[c]];
          for (let f: number = 0; f < valueFields.length; ++f) {
            row.push(values[f]);
          }
        }
      }
      result.addRow(row);
    }

    return result;
  }

  // Return a table sorted by the given field
  // Default Order: Descending
  // TODO: Currently only supports simple < comparison
  // TODO: Allow for customt comparator
  // Implemented as MergeSort
  // Source: http://www.nczonline.net/blog/2012/10/02/computer-science-and-javascript-merge-sort/
  sort(_field: string|FieldDescriptor, asc: boolean = false): AnalyticsTable {
    let field: FieldDescriptor = convertToFieldDescriptors(_field);

    let table: AnalyticsTable = new AnalyticsTable({
      fields: this.fields(),
      types: this.types()
    });

    // Materialize the rows, sort and insert into output table.
    let rows: Row[] = this.rows();
    let sortedRows: Row[] = this.mergeSort(rows, field, asc);
    table.insert(sortedRows);
    return table;
  }

  private mergeSort(rows: any[], field: FieldDescriptor, asc: boolean): any[] {
    // Terminal case: 0 or 1 item arrays don't need sorting
    if (rows.length < 2) {
      return rows;
    }

    let middle: number = Math.floor(rows.length / 2),
      left: any[]    = rows.slice(0, middle),
      right: any[]   = rows.slice(middle);

    return this.merge(this.mergeSort(left, field, asc), this.mergeSort(right, field, asc), field, asc);
  }

  private merge(left: any[], right: any[], field: FieldDescriptor, asc: boolean): any[] {
    let result: any[] = [],
      il: number    = 0,
      ir: number    = 0;

    while (il < left.length && ir < right.length) {
      let leftValue: any = field.getValueFromRow(this, left[il]);
      let rightValue: any = field.getValueFromRow(this, right[ir]);

      let comp: boolean = false;
      if (asc) comp = leftValue < rightValue;
      else comp = leftValue > rightValue;

      if (comp) {
        result.push(left[il++]);
      } else {
        result.push(right[ir++]);
      }
    }

    return result.concat(left.slice(il)).concat(right.slice(ir));
  }
}

// Utility functions
function convertListOfFieldDescriptors(vals: (string|FieldDescriptor)[]): FieldDescriptor[] {
  let desc: FieldDescriptor[] = [];
  for (let i: number = 0; i < vals.length; ++i) desc.push(convertToFieldDescriptors(vals[i]));
  return desc;
}

function convertToFieldDescriptors(val: string|FieldDescriptor): FieldDescriptor {
  if (typeof val === 'string') {
    return new FieldDescriptor(val);
  }
  // Else: return the field descriptor that was put in
  return <FieldDescriptor>val;
}
