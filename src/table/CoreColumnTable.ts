
import _ = require('underscore');
import { HashMap } from '../data/HashMap';
import { Vector } from '../../src/data/Vector';
import { Set } from '../data/Set';
import { vec } from '../data/VectorOperations';

import { ITypeConversionResult, TypeEnvironment } from '../types/TypeEnvironment';
import { StandardTypeEnv as TypeEnv } from '../types/StandardTypeEnv';

/**
 * Information stored in the table for each field
 */
export interface IFieldData {
	index: number;
	name: string;
	type: string;
	vector: Vector;
}

export interface ITableDefinition {
	fields: string[];
	types?: string[];
	columns?: Column[];
}

export type Value = (string|number|boolean|Function|Object);
export type Row = Value[];
export type Column = Value[];
export type FieldID = (string|number);

/**
 * @class CoreColumnTable
 *
 * This table is implemented as a column store.
 * TODO: enforce types
 * TODO: remove row
 * TODO: allow to define constraints/validators
 */
export class CoreColumnTable {
	protected fieldset: Set;
	protected fielddata: HashMap<string, IFieldData>;
	protected typeEnv: TypeEnvironment;

	/**
	 * Creates a new CoreColumnTable
	 */
	constructor(def: (ITableDefinition | CoreColumnTable)) {
		this.typeEnv = TypeEnv.getInstance();

		if (def instanceof CoreColumnTable) {
			this.initWithTable(<CoreColumnTable> def);
		} else if (typeof def === 'object') {
			this.initWithTableDef(<ITableDefinition> def);
		} else {
			throw `Couldn't initialize CoreColumnTable with the given parameters!`;
		}
	}

	/**
	 * inserts an array of rows into the table
	 */
	insert(rows: Row[]): void {
		for (let r: number = 0; r < rows.length; ++r) {
			this.addRow(rows[r]);
		}
	}

	/**
	 * returns the number of rows in the table
	 */
	count(): number {
		if (this.fieldset.size() > 0) {
			return this.column(this.fieldset.get(0)).length;
		} else {
			return 0;
		}
	}

	/**
	 * adds a new field to the table of the given type
	 * fills the column with null-values
	 */
	addField(name: string, type?: string): void {
		type = (typeof type === 'undefined') ? TypeEnv.kAny : type;

		if (!this.fieldset.contains(name)) {
			// fill column with null-values
			let data: Column = [];
			for (let r: number = 0; r < this.count(); ++r) {
				data.push(null);
			}
			let vector: Vector = new Vector(type, data, this.typeEnv);

			this.fieldset.add(name);
			this.fielddata.set(name, {
				index: this.fieldset.size() - 1,
				name: name,
				type: type,
				vector: vector
			});
		}
	}

	fields(): string[] {
		return this.fieldset.toArray();
	}

	numFields(): number {
		return this.fieldset.size();
	}

	hasField(field: FieldID): boolean {
		let data: IFieldData = this.getFieldData(field);
		return !!data;
	}

	types(): string[] {
		return _.map(this.fields(), (name: string): string => {
			return this.fielddata.get(name).type;
		});
	}

	type(field: FieldID): string {
		let data: IFieldData = this.getFieldData(field);
		if (data) {
			return data.type;

		} else {
			// check for special reserved system names
			if (field === '$rownr') return TypeEnv.kNumber;

			throw `Could not find column with id "${field}"!`;
		}
	}

	isEmpty(): boolean {
		return this.count() === 0;
	}

	rows(): Row[] {
		let rows: Row[] = [];
		for (let r: number = 0; r < this.count(); ++r) {
			rows.push(this.row(r));
		}
		return rows;
	}

	row(r: number): Row {
		// build the row from the attribute vectors
		let record: Row = [];
		for (let fieldName of this.fieldset.toArray()) {
			record.push(this.value(r, fieldName));
		}
		return record;
	}

	getFieldIndex(field: FieldID): number {
		return this.getFieldData(field).index;
	}

	value(row: number, field: FieldID): any {
		return this.column(field)[row];
	}

	setValue(row: number, field: FieldID, value: any): void {
		this.column(field)[row] = value;
	}

	/**
	 * adds empty rows to the table, until the table has at least
	 * as many rows as specified
	 */
	reserve(numRows: number): void {
		if (this.numFields() === 0) throw `Can't reserve rows on a table without fields!`;
		while (this.count() < numRows) {
			this.addRow([]);
		}
	}

	column(field: FieldID): any[] {
		let data: IFieldData = this.getFieldData(field);
		if (data) {
			return data.vector.toArray();
		} else {
			// check for special reserved system names
			if (field === '$rownr') {
				return this.createRowNrColumn();
			}

			throw `Could not find column with id "${field}"!`;
		}
	}

	columns(): any[][] {
		let columns: any[][] = [];
		for (let i: number = 0; i < this.fieldset.size(); ++i) {
			columns.push(this.column(this.fieldset.get(i)).slice());
		}
		return columns;
	}

	detectTypes(setTypes: boolean): string[] {
		let types: string[] = _.map(this.fieldset.toArray(), (name: string, c: number): string => {
			return vec.detectDataType(this.fielddata.get(name).vector.toArray());
		});
		if (setTypes) {
			for (let i: number = 0; i < types.length; ++i) {
				this.setType(this.fieldset.get(i), types[i]);
			}
		}
		return types;
	}

	setType(field: FieldID, type: string): void {
		let data: IFieldData = this.getFieldData(field);
		if (type !== data.type) {
			data.type = type;

			// convert types
			let old: Vector = data.vector;
			let newData: any[] = vec.convertToType(old.toArray(), type);
			let vector: Vector = new Vector(type, newData, this.typeEnv);
			data.vector = vector;
		}
	}

	/**
	 * get the field data object for the specified field
	 */
	protected getFieldData(field: FieldID): IFieldData {
		let name: string;
		if (typeof field === 'number') {
			name = this.fieldset.get(<number>field);
		} else if (typeof field === 'string') {
			name = <string>field;
		}
		return this.fielddata.get(name);
	}

	protected getVector(field: FieldID): Vector {
		return this.getFieldData(field).vector;
	}

	protected createRowNrColumn(): number[] {
		let vector: number[] = [];
		for (let r: number = 0; r < this.count(); ++r) {
			vector.push(r);
		}
		return vector;
	}

	protected initWithTableDef(def: ITableDefinition): void {
		// initialize the fields
		// throw error if field names are not unique
		this.fieldset = new Set(def.fields);
		if (def.fields.length !== this.fieldset.size()) {
			throw `No duplicate field names allowed!`;
		}

		// do some sanity checks on the input parameters
		if (def.types) {
			if (def.fields.length !== def.types.length) {
				throw `Number of fields and number of types do not match!`;
			}
		}

		if (def.columns) {
			if (def.fields.length !== def.columns.length) {
				throw `Number of fields and number of supplied columns do not match!`;
			}
		}

		this.fielddata = new HashMap<string, IFieldData>();
		for (let i: number = 0; i < def.fields.length; ++i) {
			let name: string = def.fields[i];
			let type: string = (def.types) ? def.types[i] : TypeEnv.kAny;
			let data: Column = (def.columns) ? def.columns[i] : [];
			let vector: Vector = new Vector(type, data, this.typeEnv);

			this.fielddata.set(name, {
				index: i,
				name: name,
				type: type,
				vector: vector
			});
		}
	}

	protected initWithTable(table: CoreColumnTable): void {
		this.initWithTableDef({
			fields: table.fields(),
			types: table.types(),
			columns: table.columns()
		});
	}

	/**
	 * adds a new row to the table
	 */
	protected addRow(row: any[]): void {
		if (row.length > this.numFields()) throw `Error when inserting! Row has too many fields!`;

		// typechecks
		for (let c: number = 0; c < row.length; ++c) {
			if (row[c] === undefined) throw `Error when inserting! Can not insert undefined!`;
			let colType: string = this.types()[c];

			// check for null
			// if the inserted value is empty string and the datatype is not string
			// insert null
			if (row[c] === null ||
				(row[c] === '' && colType !== 'string')) {
				row[c] = null;
				// todo: allow definition of 'not null'-constraint

			} else {

				if (colType === 'any') {
					// no typecheck necessary, all values welcome

				} else {
					// try to convert
					let res: ITypeConversionResult = this.typeEnv.convert(row[c], colType);
					if (res.success) {
						row[c] = res.result;
					} else {
						throw `Error when inserting! Types don't match!`;
					}
				}
			}
		}

		// insert the values
		for (let c: number = 0; c < row.length; ++c) {
			this.column(this.fieldset.get(c)).push(row[c]);
		}

		// push null-values for non-existant fields
		for (let c: number = row.length; c < this.numFields(); ++c) {
			this.column(this.fieldset.get(c)).push(null);
		}
	}
}
