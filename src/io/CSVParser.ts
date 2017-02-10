/// <reference path='../../typings/index.d.ts' />
import { CoreColumnTable } from '../table/CoreColumnTable';
import Papa = require('papaparse');

export class CSVParser {
	private options: PapaParse.ParseConfig;

	constructor(options?: PapaParse.ParseConfig) {
		if (!options) options = {};
		if (typeof options.header === 'undefined') options.header = true;
		if (typeof options.skipEmptyLines === 'undefined') options.skipEmptyLines = true;
		this.options = options;
	}

	parseString(csvString: string): CoreColumnTable {
		let result: PapaParse.ParseResult = Papa.parse(csvString, this.options);

		let numRows: number = result.data.length;
		let fields: string[] = [];
		let attrVectors: any[][] = [];

		if (result.meta.fields) {
			fields = result.meta.fields;

			// create attribute vectors
			for (let c: number = 0; c < fields.length; ++c) {
				let vector: any[] = [];
				for (let r: number = 0; r < numRows; ++r) {
					vector.push(result.data[r][fields[c]]);
				}
				attrVectors.push(vector);
			}
		} else {
			// find the number of columns needed for all rows
			let numColumns: number = 0;
			for (let r: number = 0; r < numRows; ++r) {
				numColumns = Math.max(numColumns, result.data[r].length);
			}

			// initialize fields
			for (let c: number = 0; c < numColumns; ++c) {
				fields.push('Column ' + (c + 1));
			}

			// fill attribute vectors
			for (let c: number = 0; c < numColumns; ++c) {
				let vector: any[] = [];
				for (let r: number = 0; r < numRows; ++r) {
					vector.push(result.data[r][c]);
				}
				attrVectors.push(vector);
			}
		}

		// create the table
		let table: CoreColumnTable = new CoreColumnTable({
			fields: fields,
			columns: attrVectors
		});
		table.detectTypes(true);

		return table;
	}


	dumpString(table: CoreColumnTable): string {
		let csv: string = '';

		csv += table.fields().join(this.options.delimiter);
		csv += '\n';
		for (let i: number = 0; i < table.count() - 1; ++i) {
			let row: any[] = table.row(i);
			csv += row.join(this.options.delimiter);
			csv += '\n';
		}
		csv += table.row(table.count() - 1).join(this.options.delimiter);

		return csv;
	}
}
