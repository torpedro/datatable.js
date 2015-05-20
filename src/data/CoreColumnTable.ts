/// <reference path="CoreTableInterface.ts" />


/**
 * @class CoreColumnTable
 * 
 * This table is implemented as a column store.
 * TODO: enforce types
 */
class CoreColumnTable implements CoreTableInterface {
	protected _attributeVectors : Array<Array<any>>;
	protected _fields : Array<string>;
	protected _types : Array<string>;
	
	
	constructor(fields: Array<string>, types?: Array<string>) {
		if (!(fields instanceof Array)) throw "Unexpected type for fields!";
		this._fields = fields;
		this._types = types || [];
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
	
	getFieldNameIndex(field: string) {
		var index = this._fields.indexOf(field);
		if (index == -1) throw "Field '" + field + "' doesn't exist!";
		return index;
	}
	
	getValue(row: number, column: number|string) {
		if (typeof column === 'string') column = this.getFieldNameIndex(<string>column);
		
		return this._attributeVectors[<number>column][row];
	}
	
	setValue(row: number, column: number|string, value: any) {
		if (typeof column === 'string') column = this.getFieldNameIndex(<string>column);
		return this._attributeVectors[<number>column][row] = value;
	}
	
	addRow(row: Row) {
		if (row.length > this.numFields()) throw "Row has too many fields!";
		
		for (var c = 0; c < row.length; ++c) {
			this._attributeVectors[c].push(row[c]);
		}
		
		// Push null-values for non-existant fields
		for (var c = row.length; c < this.numFields(); ++c) {
			this._attributeVectors[c].push(null);
		}
	}
	
	addRows(rows: Array<Row>) {
		for (var r = 0; r < rows.length; ++r) this.addRow(rows[r]);
	}
	
	addField(name: string, type?: string, values?: Array<any>) {
		this._fields.push(name);
		
		// Push null-values for existing rows
		var vector = [];
		for (var r = 0; r < this.size(); ++r) {
			vector.push(null);
		}
		this._attributeVectors.push(vector);
		this._types.push(type);
	}
	
	/**
	 * Adds empty rows to the table, until the table has at least
	 * as many rows as specified
	 */
	reserve(numRows: number) {
		if (this.numFields() == 0) throw("Can't reserve rows on a table without fields!");
		while (this.size() < numRows) {
			this.addRow([]);
		}
	}
	
	column(c: number) {
		return this._attributeVectors[c];
	}
	
	columns() {
		return this._attributeVectors;
	}
}





// modules.export
export = CoreColumnTable;