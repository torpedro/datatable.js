/// <reference path="interfaces/SetInterface.ts" />
/**
 * @class Set
 * 
 * Keeps values in the order they are inserted
 * TODO: Allow option to set deep-equal
 */
class Set<T> {
	private _data: Array<T>;
	
	constructor(data?: Array<T>) {
		this._data = [];
		if (data instanceof Array) {
			for (var i = 0; i < data.length; ++i) {
				this.add(data[i]);
			}
		}
	}
	
	size(): number {
		return this._data.length;
	}
	
	add(val: T) {
		if (this._data.indexOf(val) == -1) {
			this._data.push(val);
		}
	}
	
	remove(val: T) {
		var index = this._data.indexOf(val);
		if (index >= 0) {
			this._data.splice(index, 1);
		}
	}
	
	contains(val: T) {
		return this._data.indexOf(val) >= 0;
	}
	
	get() : Array<T>;
	get(index: number): T;
	get(index?: number): any {
		if (typeof index === 'undefined') {
			return this._data;
		} else {
			return this._data[index];
		}
	}
	
	indexOf(val: T): number {
		return this._data.indexOf(val);	
	}
	
}



// modules.export
export = Set;