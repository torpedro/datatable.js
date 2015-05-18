import CoreColumnTable = require('./CoreColumnTable')
import HashMap = require('./HashMap');
import agg = require('./agg');

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
		var result = new AnalyticsTable(outputFields);
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
		var result = new AnalyticsTable(this._fields);
		for (var r = 0; r < this.size(); ++r) {
			var row = this.row(r);
			if (predicate(row)) {
				result.addRow(row);
			}
		}
		return result;
	}
}


export = AnalyticsTable;