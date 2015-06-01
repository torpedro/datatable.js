import CoreColumnTable = require('./CoreColumnTable');

/**
 * @class FieldDescriptor
 */
class FieldDescriptor {
	isStatic: boolean;
	name: string;
	outputName: string;
	fn: Function;
	
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
			var row = table.row(rowNr);
			
			(<any>row).get = function(name: string) {
				return table.value(rowNr, name);	
			}
			
			var value = this.fn(row);
			return value;
		}
	}
	
	getValueFromRow(table: CoreColumnTable, row: Array<any>) {
		if (this.isStatic) {
			var id = table.getFieldNameIndex(this.name);
			return row[id];
				
		} else {
			(<any>row).get = function(name: string) {
				var id = table.getFieldNameIndex(name);
				return row[id];	
			}
			
			var value = this.fn(row);
			return value;
		}
		
	}
}

export = FieldDescriptor;