
type Row = Array<any>;

/**
 * @class Table
 * 
 * This is implemented as a row store
 * This is only for research purposes
 * Generally the normal Table should be used.
 */
class RowTable {
	private _rows : Array<Row>;
	private _header : Array<string>;
	
	constructor(rows? : Array<Row>, header? : Array<string>) {
		if (rows && !(rows instanceof Array)) throw "Unexpected type for rows!"
		if (!rows) rows = [];
		
		this._rows = rows;
		
		if (!header) {
			this._header = [];
			
			if (rows.length > 0) {
				for (var i = 0; i < rows[0].length; ++i) {
					this.addField("Column " + i);
				}
			}
		} else {
			this._header = header;
		}
	}
	
	// Fields
	header() : Array<string> { return this._header; }
	
	numFields() : number { return this._header.length; }
	
	addField(name : string) {
		this._header.push(name);
		for (var i = 0; i < this.size(); ++i) {
			this._rows[i].push(null);
		}
	}
	
	// Rows
	rows() : Array<Row> { return this._rows; }
	
	size() : number { return this._rows.length; }
	
	empty() : boolean { return this.size() == 0; }
	
	
	addRow(row : Row) {
		if (row.length > this.numFields()) throw "Too many fields in row!";
		
		// Insert null values for non existing fields in row!
		for (var i = row.length; i < this.numFields(); ++i) {
			row.push(null);	
		}
		
		this._rows.push(row);
	}
}

export = RowTable;