/// <reference path='../typedefs/ITable.ts' />

import _ = require('underscore');
import HashMap = require('../data/HashMap');
import Set = require('../data/Set');
import types = require('../data/types');
import vec = require('../data/VectorOperations');

/**
 * @class CoreColumnTable
 *
 * This table is implemented as a column store.
 * TODO: enforce types
 * TODO: remove row
 * TODO: allow to define constraints/validators
 */
class CoreColumnTable implements ITable {
	protected _attributeVectors: HashMap<string, any[]>;
	protected _fields: Set;
	protected _types: string[];

	constructor(def: ITableDefinition);
	constructor(table: CoreColumnTable);
	constructor(def: ITableDefinition | CoreColumnTable) {
		if (def instanceof CoreColumnTable) {
			this._initializeByTable(<CoreColumnTable> def);
		} else if (typeof def === 'object') {
			this._initializeByTableDefinition(<ITableDefinition> def);
		} else {
			throw 'Couldn\'t initialize Table with the given parameters!';
		}
	}


	protected _initializeByTableDefinition(def: ITableDefinition): void {
		if (def.fields.length === 0) throw 'Number of fields can\'t be zero!';

		// initialize the fields
		this._fields = new Set(def.fields);
		if (def.fields.length !== this._fields.size()) throw 'No duplicate field names allowed!';

		// initialize the types
		// if types are undefined, we set them to 'any' by default
		if (def.types) {
			if (def.fields.length !== def.types.length) {
				throw 'Number of fields and number of types do not match!';
			}
			this._types = def.types;
		} else {
			this._types = [];
			for (let c: number = 0; c < def.fields.length; ++c) {
				this._types.push(types.kAny);
			}
		}

		// initialize the attribute vectors
		// todo: Allow initialization with rows
		this._attributeVectors = new HashMap<string, any[]>();
		if (def.columns) {
			if (def.fields.length !== def.columns.length)
				throw 'Number of fields and number of supplied columns do not match!';

			let numRows: number = def.columns[0].length;
			for (let c: number = 0; c < def.fields.length; ++c) {
				if (def.columns[c].length !== numRows) {
					throw 'Number of rows in TableDefiniton is not uniform!';
				}

				this._attributeVectors.set(def.fields[c], def.columns[c].slice());
			}

		} else {
			for (let c: number = 0; c < def.fields.length; ++c) {
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


	addField(name: string, type?: string, values?: any[]): void {
		this._fields.add(name);

		// push null-values for existing rows
		let vector: any[] = [];
		for (let r: number = 0; r < this.size(); ++r) {
			vector.push(null);
		}
		this._attributeVectors.set(name, vector);

		if (typeof type === 'undefined') this._types.push(types.kAny);
		else this._types.push(type);
	}

	addRow(row: Row): void {
		if (row.length > this.numFields()) throw 'Error when inserting! Row has too many fields!';

		// typechecks
		for (let c: number = 0; c < row.length; ++c) {
			if (row[c] === undefined) throw 'Error when inserting! Can not insert undefined!';

			// check for null
			// if the inserted value is empty string and the datatype is not string
			// insert null
			if (row[c] === null ||
				(row[c] === '' && this.types()[c] !== 'string')) {
				row[c] = null;
				// todo: allow definition of 'not null'-constraint

			} else {
				// try to convert
				let v: any = types.convert(row[c], this.types()[c]);
				if (typeof v === 'undefined') throw 'Error when inserting! Types don\'t match!';
				row[c] = v;
			}
		}

		// insert the values
		for (let c: number = 0; c < row.length; ++c) {
			this.column(this._fields.get(c)).push(row[c]);
		}

		// push null-values for non-existant fields
		for (let c: number = row.length; c < this.numFields(); ++c) {
			this.column(this._fields.get(c)).push(null);
		}
	}

	addRows(rows: Row[]): void {
		for (let r: number = 0; r < rows.length; ++r) this.addRow(rows[r]);
	}

	fields(): string[] {
		return this._fields.get();
	}

	numFields(): number {
		return this._fields.size();
	}

	hasField(name: string): boolean {
		return this._fields.contains(name);
	}

	types(): string[] {
		return this._types;
	}

	type(name: string): string {
		if (this._fields.contains(name)) {
			return this._types[this.getFieldNameIndex(name)];
		} else {
			// check for special reserved system names
			if (name === '$rownr') return types.kNumber;

			throw 'Couldn\'t find column: "' + name + '"!';
		}
	}

	empty(): boolean {
		return this.size() === 0;
	}

	size(): number {
		return this.column(this._fields.get(0)).length;
	}

	rows(): Row[] {
		let rows: Row[] = [];
		for (let r: number = 0; r < this.size(); ++r) {
			rows.push(this.row(r));
		}
		return rows;
	}

	row(r: number): Row {
		// build the row from the attribute vectors
		let record: Row = [];
		for (let c: number = 0; c < this.numFields(); ++c) {
			record.push(this.value(r, this._fields.get(c)));
		}

		return record;
	}

	getFieldNameIndex(field: string): number {
		let index: number = this._fields.indexOf(field);
		if (index === -1) throw 'Field "' + field + '" doesn\'t exist!';
		return index;
	}

	value(row: number, column: string): any {
		return this.column(column)[row];
	}

	setValue(row: number, column: string, value: any): void {
		this.column(column)[row] = value;
	}

	/**
	 * adds empty rows to the table, until the table has at least
	 * as many rows as specified
	 */
	reserve(numRows: number): void {
		if (this.numFields() === 0) throw('Can\'t reserve rows on a table without fields!');
		while (this.size() < numRows) {
			this.addRow([]);
		}
	}

	column(name: string): any[] {
		if (this._fields.contains(name)) {
			return this._attributeVectors.get(name);
		} else {
			// check for special reserved system names
			if (name === '$rownr') {
				return this._createRowNrColumn();
			}

			throw 'Couldn\'t find column: "' + name + '"!';
		}
	}

	columns(): any[][] {
		let columns: any[][] = [];
		for (let i: number = 0; i < this._fields.size(); ++i) {
			columns.push(this.column(this._fields.get(i)).slice());
		}
		return columns;
	}

	detectTypes(setTypes: boolean): string[] {
		let types: string[] = _.map(this._fields.get(), (name: string, c: number): string => {
			return vec.detectDataType(this._attributeVectors.get(name));
		});
		if (setTypes) {
			for (let i: number = 0; i < types.length; ++i) {
				this.setType(this._fields.get(i), types[i]);
			}
		}
		return types;
	}

	setType(field: string, type: string): void {
		let i: number = this.getFieldNameIndex(field);
		if (type !== this._types[i]) {
			this._types[i] = type;

			// convert types
			let oldVector: any[] = this._attributeVectors.get(field);
			this._attributeVectors.set(field, vec.convertToType(oldVector, type));
		}
	}

	private _createRowNrColumn(): number[] {
		let vector: number[] = [];
		for (let r: number = 0; r < this.size(); ++r) {
			vector.push(r);
		}
		return vector;
	}
}





// modules.export
export = CoreColumnTable;