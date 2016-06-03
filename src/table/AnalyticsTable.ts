// @file AnalyticsTable.ts
/// <reference path="../typings/underscore/underscore.d.ts" />

///////////////////////////
// <imports>
import CoreColumnTable = require('./CoreColumnTable');
import FieldDescriptor = require('./FieldDescriptor');
import OrderedSet = require('../data/OrderedSet');
import HashMap = require('../data/HashMap');
import vec = require('../data/VectorOperations');
import aggs = require('./operators/agg');
// </imports>
///////////////////////////


/**
 * @class AnalyticsTable
 */
class AnalyticsTable extends CoreColumnTable {
	public agg = aggs; // alias to the aggregation module


	/**
	 * Returns a table grouped by the specified fields
	 * Can handle function selectors
	 *
	 * @method groupBy
	 */
	groupBy(column: string|FieldDescriptor, aggregations?: aggs.Aggregation[]): AnalyticsTable;
	groupBy(columns: Array<string|FieldDescriptor>, aggregations?: aggs.Aggregation[]): AnalyticsTable;
	groupBy(_groupFields: any, aggregations?: aggs.Aggregation[]): AnalyticsTable {
		// if the function was called with a single group by column
		// call it again with an array
		// format the data input
		if (!aggregations) aggregations = [];
		if (!(_groupFields instanceof Array)) return this.groupBy([_groupFields], aggregations);
		let fields: Array<FieldDescriptor> = convertListOfFieldDescriptors(_groupFields);

		// create Result Field List
		let outputFields = [];
		for (let i = 0; i < fields.length; ++i) {
			outputFields.push(fields[i].outputName);
		}

		for (let k = 0; k < aggregations.length; ++k) {
			if (aggregations[k].aggName) outputFields.push(aggregations[k].aggName);
			else if (aggregations[k].name) outputFields.push(aggregations[k].name);
			else outputFields.push('Aggregation ' + k);
		}

		// create hash map
		let map = new HashMap<any, Array<any>>(false); // map by equality

		for (let r = 0; r < this.size(); ++r) {
			let key = [];
			for (let c = 0; c < fields.length; ++c) {
				key.push(fields[c].getValue(this, r));
			}

			if (map.contains(key)) {
				map.get(key).push(this.row(r));
			} else {
				map.set(key, [this.row(r)]);
			}
		}

		// create the result table
		let result = new AnalyticsTable({
			fields: outputFields
		});
		let keys = map.keys();
		for (let k = 0; k < keys.length; ++k) {
			let row = [];

			// add the grouped columns
			for (let c = 0; c < keys[k].length; ++c) {
				row.push(keys[k][c]);
			}

			// add the aggregated columns
			for (let a = 0; a < aggregations.length; ++a) {
				row.push(aggregations[a](map.get(keys[k]), this));
			}

			result.addRow(row);
		}

		return result;
	}



	/**
	 * Returns a table with only rows where the predicate evaluated to true
	 *
	 * @method filter
	 */
	filter(predicate: Function): AnalyticsTable {
		// todo: figure out how to be able to address columns in predicate by name
		let result = new AnalyticsTable({
			fields: this._fields.get(),
			types: this._types.slice()
		});
		for (let r = 0; r < this.size(); ++r) {
			let row = this.row(r);
			if (predicate(row)) {
				result.addRow(row);
			}
		}
		return result;
	}



	/**
	 * Returns all distinct values of the specified field
	 *
	 * TODO: FieldDescriptor
	 * TODO: mutltiple fields
	 *
	 * @method distinctValues
	 */
	distinctValues(field: string): OrderedSet {
		return new OrderedSet(this.column(field));
	}



	/**
	 * Returns a Table with only the specified fields (Similar to SQLs SELECT clause)
	 * Can handle FieldDescriptors functions
	 *
	 * @method select
	 */
	select(field: string): AnalyticsTable;
	select(field: FieldDescriptor): AnalyticsTable;
	select(fields: Array<string|FieldDescriptor>): AnalyticsTable;
	select(_fields: any): AnalyticsTable {
		// format the data input
		if (!(_fields instanceof Array)) return this.select([_fields]);
		let inFields: Array<FieldDescriptor> = convertListOfFieldDescriptors(_fields);

		let columns = [];
		let resFields = [];
		let types = [];

		for (let i = 0; i < inFields.length; ++i) {
			let field = inFields[i];

			if (field.isStatic) {
				// a simple field was selected
				columns.push(this.column(field.name).slice());
				types.push(this.type(field.name));
				resFields.push(field.outputName);

			} else {
				resFields.push(field.outputName);

				// function selector
				// build a new column vector
				let vector = [];
				for (let i = 0; i < this.size(); ++i) {
					let value = field.getValue(this, i);
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


	/**
	 * Returns a Table where the column was split into multiple columns
	 *
	 * TODO: FieldDescriptor
	 *
	 * @method splitColumn
	 */
	splitColumn(field: string, groupField: string): AnalyticsTable {
		// find all result field names
		let categories = this.distinctValues(field).get();
		let fields = [groupField];
		let types = [this.type(groupField)];
		let valueFields = [];

		for (let c = 0; c < this.numFields(); ++c) {
			if (this._fields.get(c) !== field && this._fields.get(c) !== groupField) {
				valueFields.push(this._fields.get(c));
			}
		}

		for (let cat = 0; cat < categories.length; ++cat) {
			for (let f = 0; f < valueFields.length; ++f) {
				let newField = valueFields[f] + ' (' + categories[cat] + ')';
				fields.push(newField);
				types.push(this.type(valueFields[f]));
			}
		}

		// build Hash-Map
		// map( group -> map( category -> Array(valueFields) ) )
		let map = new HashMap(false);

		for (let r = 0; r < this.size(); ++r) {
			let key = this.value(r, groupField);
			if (!map.contains(key)) {
				map.set(key, {});
			}

			let category = this.value(r, field);
			let obj = map.get(key);
			obj[category] = [];
			for (let f = 0; f < valueFields.length; ++f) {
				obj[category].push(this.value(r, valueFields[f]));
			}
		}


		let result = new AnalyticsTable({
			fields: fields,
			types: types
		});

		// build rows
		let keys = map.keys();
		for (let k = 0; k < keys.length; ++k) {
			let obj = map.get(keys[k]);
			let row = [keys[k]];

			// loop over categories and valueFields
			for (let c = 0; c < categories.length; ++c) {
				if (!(categories[c] in obj)) {
					for (let f = 0; f < valueFields.length; ++f) {
						row.push(null);
					}
				} else {
					let values = obj[categories[c]];
					for (let f = 0; f < valueFields.length; ++f) {
						row.push(values[f]);
					}
				}
			}

			result.addRow(row);
		}


		return result;
	}



	/**
	 * Return a table sorted by the given field
	 * Default Order: Descending
	 * TODO: Currently only supports simple < comparison
	 * TODO: Allow for customt comparator
	 *
	 * Implemented as MergeSort
	 * http://www.nczonline.net/blog/2012/10/02/computer-science-and-javascript-merge-sort/
	 *
	 * @method sort
	 */
	sort(_field: string|FieldDescriptor, asc?: boolean): AnalyticsTable {
		if (!asc) asc = false;
		let field: FieldDescriptor = convertToFieldDescriptors(_field);

		let table = new AnalyticsTable({
			fields: this.fields(),
			types: this.types()
		});

		// materialize the rows
		let rows = this.rows();

		// sort the rows
		let sortedRows = this._mergeSort(rows, field, asc);

		// add to output table
		table.addRows(sortedRows);

		return table;
	}


	private _mergeSort(rows: Array<any>, field: FieldDescriptor, asc: boolean) {
		// terminal case: 0 or 1 item arrays don't need sorting
		if (rows.length < 2) {
			return rows;
		}

		let middle = Math.floor(rows.length / 2),
			left   = rows.slice(0, middle),
			right  = rows.slice(middle);

		return this._merge(this._mergeSort(left, field, asc), this._mergeSort(right, field, asc), field, asc);
	}

	private _merge(left: Array<any>, right: Array<any>, field: FieldDescriptor, asc: boolean) {
		let result  = [],
			il      = 0,
			ir      = 0;

		while (il < left.length && ir < right.length) {
			let leftValue = field.getValueFromRow(this, left[il]);
			let rightValue = field.getValueFromRow(this, right[ir]);

			let comp = false;
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




// utility functions
function convertListOfFieldDescriptors(vals: Array<string|FieldDescriptor>): Array<FieldDescriptor> {
	let desc = [];
	for (let i = 0; i < vals.length; ++i) desc.push(convertToFieldDescriptors(vals[i]));
	return desc;
}

function convertToFieldDescriptors(val: string|FieldDescriptor): FieldDescriptor {
	if (typeof val === 'string') {
		return new FieldDescriptor(val);
	}
	// else return the field descriptor that was put in
	return <FieldDescriptor>val;
}




export = AnalyticsTable;