/// <reference path="TableInterface.ts" />


/**
 * @class Table
 * 
 * This table is implemented as a column store.
 */
class Table implements TableInterface {
	private _attributeVectors : Array<Array<any>>;
	private _fields : Array<string>;
	
	
	constructor(fields: Array<string>) {
		if (!(fields instanceof Array)) throw "Unexpected type for rows!";
		this._fields = fields;
		this._attributeVectors = [];
		
		for (var c = 0; c < fields.length; ++c) {
			this._attributeVectors.push([]);
		}
	}
	
	fields(): Array<string> { return this._fields; }
	
	numFields() : number { return this._attributeVectors.length; }
	
	empty() : boolean { return this.size() == 0; }
	
	size() : number {
		if (this._attributeVectors.length == 0) return 0;
		return this._attributeVectors[0].length;
	}
	
	rows() : Array<Row> {
		var rows : Array<Row> = [];
		for (var r = 0; r < this.size(); ++r) {
			rows.push(this.row(r));
		}
		return rows;
	}
	
	row(r: number) : Row {
		// Build the Row from the attribute vectors
		var record : Row = [];
		for (var c = 0; c < this.numFields(); ++c) {
			record.push(this.getValue(r, c));
		}
		return record;
	}
	
	getValue(row: number, column: number) {
		return this._attributeVectors[column][row];
	}
	
	addRow(row: Row) {
		for (var c = 0; c < row.length; ++c) {
			this._attributeVectors[c].push(row[c]);
		}
		for (var c = row.length; c < this.numFields(); ++c) {
			this._attributeVectors[c].push(null);
		}
	}
	
	addField(name: string) {
		this._fields.push(name);
		
		// Push null-values for existing rows
		var vector = [];
		for (var r = 0; r < this.size(); ++r) {
			vector.push(null);
		}	
		this._attributeVectors.push(vector);
	}
}





// modules.export
export = Table;