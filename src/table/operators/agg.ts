import AnalyticsTable = require('../AnalyticsTable');

/**
 * @module agg
 *
 * Used in group-by operations
 */
module agg {
	export type Aggregation = (
		((rows: any[], table: AnalyticsTable) => any) & { aggName?: string, name?: string }
	);

	export function sum(targetField: string, outputName?: string): Aggregation {
		let aggf: Aggregation = function(rows: any[], table: AnalyticsTable): number {
			// todo: type-switch
			let sum: number = 0;
			let c: number = table.getFieldNameIndex(targetField);
			for (let r: number = 0; r < rows.length; ++r) {
				sum += rows[r][c];
			}
			return sum;
		};

		// set output name
		if (outputName) aggf.aggName = outputName;
		else aggf.aggName = 'SUM(' + targetField + ')';
		return aggf;
	}

	export function avg(targetField: string, outputName: string): Aggregation {
		let aggf: Aggregation = function(rows: any[], table: AnalyticsTable): number {
			// todo: type-switch
			let sum: number = 0;
			let c: number = table.getFieldNameIndex(targetField);
			for (let r: number = 0; r < rows.length; ++r) {
				sum += rows[r][c];
			}
			return (sum / rows.length);
		};

		// set output name
		if (outputName) aggf.aggName = outputName;
		else aggf.aggName = 'AVG(' + targetField + ')';
		return aggf;
	}

	export function first(targetField: string, outputName: string): Aggregation {
		let aggf: Aggregation = function(rows: any[], table: AnalyticsTable): any {
			let c: number = table.getFieldNameIndex(targetField);
			return rows[0][c];
		};

		// set output name
		if (outputName) aggf.aggName = outputName;
		else aggf.aggName = 'AVG(' + targetField + ')';
		return aggf;

	}

}

// modules.export
export = agg;
