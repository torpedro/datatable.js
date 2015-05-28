// @file AnalyticsTable.ts
/// <reference path="../typings/underscore/underscore.d.ts" />

import _ = require('underscore')
import CoreColumnTable = require('./CoreColumnTable')
import OrderedSet = require('./OrderedSet')
import HashMap = require('./HashMap');
import agg = require('./agg');

/**
 * @class AnalyticsTable
 */
class AnalyticsTable extends CoreColumnTable {
	// Alias to the aggregation module
	public agg = agg;
	
	groupBy(columns: Array<string>|string, aggregations?: Array<Function>): AnalyticsTable {
		// Format arguments
		var groupColumns: Array<string>;
		if (typeof columns === 'string') groupColumns = [columns];
		else groupColumns = columns;
		
		
		// Create Result Field List
		var outputFields = groupColumns.slice();
		for (var k = 0; k < aggregations.length; ++k) {
			if (aggregations[k]['aggName']) outputFields.push(aggregations[k]['aggName']);
			else if (aggregations[k]['name']) outputFields.push(aggregations[k]['name']);
			else outputFields.push('Aggregation ' + k);
		}
		
		// Create hash map
		var map = new HashMap(false); // Map by equality
		
		for (var r = 0; r < this.size(); ++r) {
			var key = [];
			for (var c = 0; c < groupColumns.length; ++c) {
				key.push(this.getValue(r, groupColumns[c]));
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
	
	filter(predicate: Function): AnalyticsTable {
		// TODO: Figer out how to be able to address columns in predicate by name
		var result = new AnalyticsTable({
			fields: this._fields
		});
		for (var r = 0; r < this.size(); ++r) {
			var row = this.row(r);
			if (predicate(row)) {
				result.addRow(row);
			}
		}
		return result;
	}
	
	distinctValues(field: string): OrderedSet {
		return new OrderedSet(this.column(field));
	}
	
	select(...fields: Array<string>): AnalyticsTable {
		var columns = [];
		for (var i = 0; i < fields.length; ++i) {
			columns.push(this.column(fields[i]).slice());
		}
		return new AnalyticsTable({
			fields: fields,
			columns: columns
		})
	}
	
	explodeColumn(field: string, groupField: string): AnalyticsTable {
		
		// Find all result field names
		var categories = this.distinctValues(field).get();
		var fields = [groupField];
		var valueFields = [];
		
		for (var c = 0; c < this.numFields(); ++c) {
			if (this._fields[c] !== field && this._fields[c] !== groupField) {
				valueFields.push(this._fields[c]);
			}
		}
		
		for (var cat = 0; cat < categories.length; ++cat) {
			for (var f = 0; f < valueFields.length; ++f) {
				var newField = valueFields[f] + ' (' + categories[cat] + ')';
				fields.push(newField);
			}
		}
		
		// Build Hash-Map
		//map( group -> map( category -> Array(valueFields) ) )
		var map = new HashMap(false);
		
		for (var r = 0; r < this.size(); ++r) {
			var key = this.getValue(r, groupField);
			if (!map.contains(key)) {
				map.set(key, {});
			}
			
			var category = this.getValue(r, field);
			var obj = map.get(key);
			obj[category] = [];
			for (var f = 0; f < valueFields.length; ++f) {
				obj[category].push(this.getValue(r, valueFields[f]));
			}
		}
		
		
		var result = new AnalyticsTable({
			fields: fields
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
}


export = AnalyticsTable;