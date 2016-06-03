/// <reference path="../typings/papaparse/papaparse.d.ts" />
import CoreColumnTable = require('../table/CoreColumnTable');
import vec = require('../data/VectorOperations');
import Papa = require('papaparse');

class CSVParser {
	private options: PapaParse.ParseConfig;

	constructor(options?: PapaParse.ParseConfig) {
		if (!options) options = {};
		if (typeof options.header === 'undefined') options.header = true;
		if (typeof options.skipEmptyLines === 'undefined') options.skipEmptyLines = true;
		this.options = options;
	}

	parseString(csvString: string): CoreColumnTable {
		var result = Papa.parse(csvString, this.options);

		var numRows = result.data.length;
		var fields: Array<string> = [];
		var types: Array<string> = [];
		var attrVectors: Array<Array<any>> = [];

		if (result.meta.fields) {
			fields = result.meta.fields;

			// Create attribute vectors
			for (var c = 0; c < fields.length; ++c) {
				var vector = [];
				for (var r = 0; r < numRows; ++r) {
					vector.push(result.data[r][fields[c]]);
				}
				attrVectors.push(vector);
			}
		} else {
			// Find the number of columns needed for all rows
			var numColumns = 0;
			for (var r = 0; r < numRows; ++r) {
				numColumns = Math.max(numColumns, result.data[r].length);
			}

			// Initialize fields
			for (var c = 0; c < numColumns; ++c) {
				fields.push('Column ' + (c + 1));
			}

			// Fill Attribute Vectors
			for (var c = 0; c < numColumns; ++c) {
				var vector = [];
				for (var r = 0; r < numRows; ++r) {
					vector.push(result.data[r][c]);
				}
				attrVectors.push(vector);
			}
		}

		// Create the table
		var table = new CoreColumnTable({
			fields: fields,
			columns: attrVectors
		});
		table.detectTypes(true);

		return table;
	}


	dumpString(table: CoreColumnTable): string {
		var csv = "";

		csv += table.fields().join(this.options.delimiter)
		csv += "\n";
		for (var i = 0; i < table.size() - 1; ++i) {
			var row = table.row(i);
			csv += row.join(this.options.delimiter);
			csv += "\n";
		}
		csv += table.row(table.size() - 1).join(this.options.delimiter);

		return csv;
	}
}



// module.export
export = CSVParser;