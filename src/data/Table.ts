
type Row = Array<any>;

class Table {
	private _rows : Array<Row>;
	private _header : Array<string>;
	
	constructor(rows : Array<Row>, header : Array<string>) {
		if (rows && !(rows instanceof Array)) throw "Unexpected type for rows!"
		if (!rows) rows = [];
		if (!header) header = undefined;
		
		this._rows = rows;
		this._header = header;
	}
	
	
	size() : number {
		return this._rows.length;
	}
	
	empty() : boolean {
		return this.size() == 0;
	}
}

export = Table;