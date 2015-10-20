// @file AnalyticsTable.ts
/// <reference path="../typings/underscore/underscore.d.ts" />

///////////////////////////
// <imports>
import _ = require('underscore');
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
	public agg = aggs; // Alias to the aggregation module
	
	
	/**
	 * Returns a table grouped by the specified fields
	 * Can handle function selectors
	 * 
	 * @method groupBy
	 */
	groupBy(column: string|FieldDescriptor, aggregations?: Array<Function>): AnalyticsTable;
	groupBy(columns: Array<string|FieldDescriptor>, aggregations?: Array<Function>): AnalyticsTable;
	groupBy(_groupFields: any, aggregations?: Array<Function>): AnalyticsTable {
		// If the function was called with a single group by column
		// Call it again with an array
		// Format the data input
		if (!aggregations) aggregations = [];
		if (!(_groupFields instanceof Array)) return this.groupBy([_groupFields], aggregations);
		var fields: Array<FieldDescriptor> = convertListOfFieldDescriptors(_groupFields);
		
		// Create Result Field List
		var outputFields = [];
		for (var i = 0; i < fields.length; ++i) {
			outputFields.push(fields[i].outputName);
		}
		
		for (var k = 0; k < aggregations.length; ++k) {
			if (aggregations[k]['aggName']) outputFields.push(aggregations[k]['aggName']);
			else if (aggregations[k]['name']) outputFields.push(aggregations[k]['name']);
			else outputFields.push('Aggregation ' + k);
		}
		
		// Create hash map
		var map = new HashMap<any, Array<any>>(false); // Map by equality
		
		for (var r = 0; r < this.size(); ++r) {
			var key = [];
			for (var c = 0; c < fields.length; ++c) {
				key.push(fields[c].getValue(this, r));
			}
			
			if (map.contains(key)) {
				map.get(key).push(this.row(r));
			} else {
				map.set(key, [this.row(r)]);		
			}
		}
		
		// Create the result table
		var result = new AnalyticsTable({
			fields: outputFields
		});
		var keys = map.keys();
		for (var k = 0; k < keys.length; ++k) {
			var row = [];
			
			// Add the grouped columns
			for (var c = 0; c < keys[k].length; ++c) {
				row.push(keys[k][c])
			}
			
			// Add the aggregated columns
			for (var a = 0; a < aggregations.length; ++a) {
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
		// TODO: Figer out how to be able to address columns in predicate by name
		var result = new AnalyticsTable({
			fields: this._fields.get(),
			types: this._types.slice()
		});
		for (var r = 0; r < this.size(); ++r) {
			var row = this.row(r);
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
		// Format the data input
		if (!(_fields instanceof Array)) return this.select([_fields]);
		var inFields: Array<FieldDescriptor> = convertListOfFieldDescriptors(_fields);
		
		var columns = [];
		var resFields = [];
		var types = [];
		
		for (var i = 0; i < inFields.length; ++i) {
			var field = inFields[i];
			
			if (field.isStatic) {
				// A simple field was selected
				columns.push(this.column(field.name).slice());
				types.push(this.type(field.name));
				resFields.push(field.outputName);
					
			} else {
				resFields.push(field.outputName);
				
				// Function selector
				// Build a new column vector
				var vector = [];
				for (var i = 0; i < this.size(); ++i) {
					var value = field.getValue(this, i);
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
		// Find all result field names
		var categories = this.distinctValues(field).get();
		var fields = [groupField];
		var types = [this.type(groupField)];
		var valueFields = [];
		
		for (var c = 0; c < this.numFields(); ++c) {
			if (this._fields.get(c) !== field && this._fields.get(c) !== groupField) {
				valueFields.push(this._fields.get(c));
			}
		}
		
		for (var cat = 0; cat < categories.length; ++cat) {
			for (var f = 0; f < valueFields.length; ++f) {
				var newField = valueFields[f] + ' (' + categories[cat] + ')';
				fields.push(newField);
				types.push(this.type(valueFields[f]));
			}
		}
		
		// Build Hash-Map
		// map( group -> map( category -> Array(valueFields) ) )
		var map = new HashMap(false);
		
		for (var r = 0; r < this.size(); ++r) {
			var key = this.value(r, groupField);
			if (!map.contains(key)) {
				map.set(key, {});
			}
			
			var category = this.value(r, field);
			var obj = map.get(key);
			obj[category] = [];
			for (var f = 0; f < valueFields.length; ++f) {
				obj[category].push(this.value(r, valueFields[f]));
			}
		}
		
		
		var result = new AnalyticsTable({
			fields: fields,
			types: types
		});
		
		// Build Rows
		var keys = map.keys();
		for (var k = 0; k < keys.length; ++k) {
			var obj = map.get(keys[k]);
			var row = [keys[k]];
			
			// Loop over categories and valueFields
			for (var c = 0; c < categories.length; ++c) {
				if (!(categories[c] in obj)) {
					for (var f = 0; f < valueFields.length; ++f) {
						row.push(null);
					}
				} else {
					var values = obj[categories[c]];
					for (var f = 0; f < valueFields.length; ++f) {
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
		var field: FieldDescriptor = convertToFieldDescriptors(_field);
		
		var table = new AnalyticsTable({
			fields: this.fields(),
			types: this.types()
		});
		
		// Materialize the rows
		var rows = this.rows();
		
		// Sort the rows
		var sortedRows = this._mergeSort(rows, field, asc);
		
		// Add to output table
		table.addRows(sortedRows);
		
		return table;
	}
	
	
	private _mergeSort(rows: Array<any>, field: FieldDescriptor, asc: boolean) {
		// Terminal case: 0 or 1 item arrays don't need sorting
		if (rows.length < 2) {
			return rows;
		}
	
		var middle = Math.floor(rows.length / 2),
			left   = rows.slice(0, middle),
			right  = rows.slice(middle);
	
		return this._merge(this._mergeSort(left, field, asc), this._mergeSort(right, field, asc), field, asc);
	}
	
	private _merge(left: Array<any>, right: Array<any>, field: FieldDescriptor, asc: boolean) {
		var result  = [],
			il      = 0,
			ir      = 0;
	
		while (il < left.length && ir < right.length) {
			var leftValue = field.getValueFromRow(this, left[il]);
			var rightValue = field.getValueFromRow(this, right[ir]);
			
			var comp = false;
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




// Utility Functions
function convertListOfFieldDescriptors(vals: Array<string|FieldDescriptor>): Array<FieldDescriptor> {
	var desc = [];
	for (var i = 0; i < vals.length; ++i) desc.push(convertToFieldDescriptors(vals[i]));
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