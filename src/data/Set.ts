/// <reference path="../typedefs/ISet.ts" />
/**
 * @class Set
 *
 * Keeps values in the order they are inserted (Important!)
 * ES6 has a native Set object. Probably replace this Set with that.
 *
 * TODO: Allow option to set deep-equal
 */
class Set implements ISet {
	_isSet_ = true;
	protected _data: Array<any>;

	constructor();
	constructor(set: ISet);
	constructor(data: Array<any>);
	constructor(data?: any) {
		// initialize empty
		var i;
		this._data = [];

		if (data instanceof Array) {
			for (i = 0; i < data.length; ++i) {
				this.add(data[i]);
			}
		} else if (data && data._isSet_) {
			// This is a set
			var set = <ISet> data;
			for (i = 0; i < set.size(); ++i) {
				this.add(set.get(i));
			}
		}
	}

	add(val: any) {
		if (this._data.indexOf(val) === -1) {
			this._data.push(val);
		}
	}

	clear() {
		this._data = [];
	}

	contains(val: any) {
		return this._data.indexOf(val) >= 0;
	}

	difference(other: ISet): Set {
		var set = new Set(this);
		for (var i = 0; i < other.size(); ++i) {
			set.remove(other.get(i));
		}
		return set;
	}

	get() : any[];
	get(index: number): any;
	get(index?: number): any {
		if (typeof index === "undefined") {
			return this._data;
		} else {
			return this._data[index];
		}
	}

	indexOf(val: any): number {
		return this._data.indexOf(val);
	}

	intersection(other: ISet): Set {
		var set = new Set();
		for (var i = 0; i < this.size(); ++i) {
			if (other.contains(this._data[i])) {
				set.add(this._data[i]);
			}
		}
		return set;
	}

	isDisjoint(other: ISet): boolean {
		for (var i = 0; i < this.size(); ++i) {
			if (other.contains(this._data[i])) {
				return false;
			}
		}
		return true;
	}

	isEqual(other: ISet): boolean {
		return this.isSubset(other) && this.isSuperset(other);
	}

	isSubset(other: ISet): boolean {
		for (var i = 0; i < this.size(); ++i) {
			if (!other.contains(this._data[i])) {
				return false;
			}
		}
		return true;
	}

	isSuperset(other: ISet): boolean {
		return other.isSubset(this);
	}

	pop(): any {
		if (this.size() > 0) {
			var elem = this._data[0];
			this.remove(elem);
			return elem;
		}
	}

	remove(val: any) {
		var index = this.indexOf(val);
		if (index >= 0) {
			this._data.splice(index, 1);
		}
	}

	size() {
		return this._data.length;
	}

	union(other: ISet): Set {
		var set = new Set(this);
		for (var i = 0; i < other.size(); ++i) {
			set.add(other.get(i));
		}
		return set;
	}
}



// modules.export
export = Set;