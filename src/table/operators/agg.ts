import AnalyticsTable = require('../AnalyticsTable');

/**
 * @module agg
 *
 * Used in group-by operations
 */
module agg {
	export function sum(targetField: string, outputName?: string) {
		var aggf = function(rows: Array<any>, table: AnalyticsTable) {
			// TODO: type-switch

			// number
			var sum = 0;
			var c = table.getFieldNameIndex(targetField);
			for (var r = 0; r < rows.length; ++r) {
				sum += rows[r][c];
			}
			return sum;
		};

		// Set output name
		if (outputName) aggf['aggName'] = outputName;
		else aggf['aggName'] = 'SUM(' + targetField + ')';
		return aggf;
	}

	export function avg(targetField: string, outputName: string) {
		var aggf = function(rows: Array<any>, table: AnalyticsTable) {
			// TODO: type-switch
			// number
			var sum = 0;
			var c = table.getFieldNameIndex(targetField);
			for (var r = 0; r < rows.length; ++r) {
				sum += rows[r][c];
			}
			return (sum / rows.length);
		};

		// Set output name
		if (outputName) aggf['aggName'] = outputName;
		else aggf['aggName'] = 'AVG(' + targetField + ')';
		return aggf;
	}

	export function first(targetField: string, outputName: string) {
		var aggf = function(rows: Array<any>, table: AnalyticsTable) {
			var c = table.getFieldNameIndex(targetField);
			return rows[0][c];
		};

		// Set output name
		if (outputName) aggf['aggName'] = outputName;
		else aggf['aggName'] = 'AVG(' + targetField + ')';
		return aggf;

	}

}

// modules.export
export = agg;