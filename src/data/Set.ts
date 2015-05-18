/**
 * @class Set
 * 
 * Keeps values in the order they are inserted
 * TODO: Allow option to set deep-equal
 */
class Set {
	private _data: Array<any>;
	
	constructor(data?: Array<any>) {
		this._data = [];
		if (data instanceof Array) {
			for (var i = 0; i < data.length; ++i) {
				this.add(data[i]);
			}
		}
	}
	
	size() { return this._data.length; }
	
	add(val: any) {
		if (this._data.indexOf(val) == -1) {
			this._data.push(val);
		}
	}
	
	remove(val: any) {
		var index = this._data.indexOf(val);
		if (index >= 0) {
			this._data.splice(index, 1);
		}
	}
	
	contains(val: any) {
		return this._data.indexOf(val) >= 0;
	}
	
	get(index?: number) {
		if (typeof index === 'undefined') {
			return this._data;
		} else {
			return this._data[index];
		}
	}
}



// modules.export
export = Set;