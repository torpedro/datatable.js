/// <reference path="interfaces/CoreTableInterface.ts" />
import HashMap = require('./HashMap');
import Set = require('./Set');

interface TableDefinition {
	fields: Array<string>;
	types?: Array<string>;
	columns?: Array<Array<any>>;
}

/**
 * @class CoreColumnTable
 * 
 * This table is implemented as a column store.
 * TODO: enforce types
 */
class CoreColumnTable implements CoreTableInterface {
	protected _attributeVectors: HashMap<string, Array<any>>;
	protected _fields: Set<string>;
	protected _types: Array<string>;
	
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
	
	
	protected _initializeByTableDefinition(def: TableDefinition): void {
		if (def.fields.length == 0) throw "Number of fields can't be zero!";
	
		
		// Initialize the fields
		this._fields = new Set<string>(def.fields);
		if (def.fields.length != this._fields.size()) throw "No duplicate field names allowed!";
		
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
		
		// Initialize the attribute vectors
		// TODO: Allow initialization with rows
		this._attributeVectors = new HashMap<string, Array<any>>();
		if (def.columns) {
			if (def.fields.length != def.columns.length)
				throw "Number of fields and number of supplied columns do not match!";
			
			var numRows = def.columns[0].length;
			for (var c = 0; c < def.fields.length; ++c) {
				if (def.columns[c].length != numRows) {
					throw "Number of rows in TableDefiniton is not uniform!";
				}
				
				this._attributeVectors.set(def.fields[c], def.columns[c].slice());
			}
			
		} else {
			for (var c = 0; c < def.fields.length; ++c) {
				this._attributeVectors.set(def.fields[c], []);
			}	
		}
	}
	
	protected _initializeByTable(table: CoreColumnTable): void {
		this._initializeByTableDefinition({
			fields: table.fields(),
			types: table.types(),
			columns: table.columns()
		});
	}
	
	
	fields(): Array<string> { return this._fields.get(); }
	
	numFields(): number { return this._fields.size(); }
	
	hasField(name: string): boolean { return this._fields.contains(name); }
	
	types(): Array<string> {
		return this._types;
	}
	
	type(name: string): string {
		if (this._fields.contains(name)) {
			return this._types[this.getFieldNameIndex(name)];	
		} else {
			// Check for special reserved system names
			if (name === '$rownr') return 'number';
			
			throw "Couldn't find column: '" + name + " '!"
		}
	}
	
	empty(): boolean { return this.size() == 0; }
	
	size(): number {
		return this.column(this._fields.get(0)).length;
	}
	
	rows(): Array<Row> {
		var rows: Array<Row> = [];
		for (var r = 0; r < this.size(); ++r) {
			rows.push(this.row(r));
		}
		return rows;
	}
	
	row(r: number): Row {
		// Build the Row from the attribute vectors
		var record: Row = [];
		for (var c = 0; c < this.numFields(); ++c) {
			record.push(this.getValue(r, this._fields.get(c)));
		}
		
		return record;
	}
	
	getFieldNameIndex(field: string): number {
		var index = this._fields.indexOf(field);
		if (index == -1) throw "Field '" + field + "' doesn't exist!";
		return index;
	}
	
	getValue(row: number, column: string): any {
		return this.column(column)[row];
	}
	
	setValue(row: number, column: string, value: any): void {
		this.column(column)[row] = value
	}
	
	addRow(row: Row): void {
		if (row.length > this.numFields()) throw "Row has too many fields!";
		
		for (var c = 0; c < row.length; ++c) {
			this.column(this._fields.get(c)).push(row[c]);
		}
		
		// Push null-values for non-existant fields
		for (var c = row.length; c < this.numFields(); ++c) {
			this.column(this._fields.get(c)).push(null);
		}
	}
	
	addRows(rows: Array<Row>): void {
		for (var r = 0; r < rows.length; ++r) this.addRow(rows[r]);
	}
	
	addField(name: string, type?: string, values?: Array<any>): void {
		this._fields.add(name);
		
		// Push null-values for existing rows
		var vector = [];
		for (var r = 0; r < this.size(); ++r) {
			vector.push(null);
		}
		this._attributeVectors.set(name, vector);
		this._types.push(type);
	}
	
	/**
	 * Adds empty rows to the table, until the table has at least
	 * as many rows as specified
	 */
	reserve(numRows: number): void {
		if (this.numFields() == 0) throw("Can't reserve rows on a table without fields!");
		while (this.size() < numRows) {
			this.addRow([]);
		}
	}
	
	column(name: string): Array<any> {
		if (this._fields.contains(name)) {
			return this._attributeVectors.get(name);	
		} else {
			// Check for special reserved system names
			if (name === '$rownr') {
				return this._createRowNrColumn();
			}
			
			throw "Couldn't find column: '" + name + " '!"
		}
	}
	
	columns(): Array<Array<any>> {
		var columns = [];
		for (var i = 0; i < this._fields.size(); ++i) {
			columns.push(this.column(this._fields.get(i)).slice());
		}
		return columns;
	}
	
	
	private _createRowNrColumn(): Array<number> {
		var vector = [];
		for (var r = 0; r < this.size(); ++r) {
			vector.push(r);
		}
		return vector;
	}
}





// modules.export
export = CoreColumnTable;