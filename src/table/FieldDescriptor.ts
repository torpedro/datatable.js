import CoreColumnTable = require('./CoreColumnTable');

/**
 * @class FieldDescriptor
 */
class FieldDescriptor {
	isStatic: boolean;
	name: string;
	outputName: string;
	fn: ((row: any[]) => any);

	constructor(field: string);
	constructor(field: string, as: string);
	constructor(fn: Function, as: string);
	constructor(what: any, as?: string) {
		if (typeof what === 'string') {
			// what is a static field selector
			this.isStatic = true;
			this.name = what;

			if (as) this.outputName = as;
			else this.outputName = what;
		} else {
			// what is a function selector
			this.isStatic = false;
			this.fn = what;
			this.outputName = as;
		}
	}

	getValue(table: CoreColumnTable, rowNr: number): any {
		if (this.isStatic) return table.value(rowNr, this.name);
		else {
			let row: any[] = table.row(rowNr);

			(<any>row).get = function(name: string): any {
				return table.value(rowNr, name);
			};

			let value: any = this.fn(row);
			return value;
		}
	}

	getValueFromRow(table: CoreColumnTable, row: Array<any>): any {
		if (this.isStatic) {
			let id: number = table.getFieldNameIndex(this.name);
			return row[id];

		} else {
			(<any>row).get = function(name: string): any {
				let id: number = table.getFieldNameIndex(name);
				return row[id];
			};

			let value: any = this.fn(row);
			return value;
		}
	}
}

export = FieldDescriptor;