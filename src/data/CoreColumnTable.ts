/// <reference path="CoreTableInterface.ts" />

interface TableDefinition {
	fields: Array<string>,
	types?: Array<string>,
	columns?: Array<Array<any>>
}

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
	
	constructor(def: TableDefinition);
	constructor(table: CoreColumnTable);
	
	constructor(def: TableDefinition | CoreColumnTable) {
		if (def instanceof CoreColumnTable) {
			this._initializeByTable(<CoreColumnTable> def);
		} else if (typeof def === 'object') {
			this._initializeByTableDefinition(<TableDefinition> def);
		} else {
			// console.error("Couldn't initialize Table with the given parameters!", arguments);
			throw "Couldn't initialize Table with the given parameters!";
		}
	}
	
	
	protected _initializeByTableDefinition(def: TableDefinition) {
		if (def.fields.length == 0) throw "Number of fields can't be zero!";
		
		this._fields = def.fields;
		
		// Initialize the types
		// If types are undefined, we set them to 'any' by default
		if (def.types) {
			if (def.fields.length != def.types.length)
				throw "Number of fields and number of types do not match!";
				
			this._types = def.types;
		} else {
			this._types = [];
			for (var c = 0; c < def.fields.length; ++c) {
				this._types.push('any');
			}
		}
		
		// Initialize the attribute Vectors
		this._attributeVectors = [];
		if (def.columns) {
			if (def.fields.length != def.columns.length)
				throw "Number of fields and number of supplied columns do not match!";
			
			var numRows = def.columns[0].length;
			for (var c = 0; c < def.fields.length; ++c) {
				if (def.columns[c].length != numRows) {
					throw "Number of rows in TableDefiniton is not uniform!";
				}
				
				this._attributeVectors.push(def.columns[c].slice());
			}
			
		} else {
			for (var c = 0; c < def.fields.length; ++c) {
				this._attributeVectors.push([]);
			}	
		}
	}
	
	protected _initializeByTable(table: CoreColumnTable) {
		this._initializeByTableDefinition({
			fields: table.fields(),
			types: table.types(),
			columns: table.columns()
		});
	}
	
	
	fields(): Array<string> { return this._fields; }
	
	numFields(): number { return this._fields.length; }
	
	hasField(name: string): boolean { return this._fields.indexOf(name) >= 0; }
	
	types(): Array<string> { return this._types; }
	
	empty(): boolean { return this.size() == 0; }
	
	size(): number {
		return this._attributeVectors[0].length;
	}
	
	rows(): Array<Row> {
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
		return this.column(column)[row];
	}
	
	setValue(row: number, column: number|string, value: any) {
		this.column(column)[row] = value
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
	
	column(field: number|string) {
		if (typeof field === 'string') field = this.getFieldNameIndex(<string>field);
		return this._attributeVectors[<number>field];
	}
	
	columns() {
		return this._attributeVectors;
	}
}





// modules.export
export = CoreColumnTable;