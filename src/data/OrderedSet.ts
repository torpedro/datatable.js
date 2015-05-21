/// <reference path="interfaces/SetInterface.ts" />
/**
 * @class OrderedSet
 * 
 * Keeps values in order
 */
class OrderedSet implements SetInterface {
	_isSet_ = true;
	
	private _data: Array<any>;
	
	constructor();
	constructor(set: SetInterface);
	constructor(data: Array<any>);
	constructor(data?: Array<any>|SetInterface) {
		// Initialize empty
		this._data = [];
		
		if (data instanceof Array) {
			for (var i = 0; i < data.length; ++i) {
				this.add(data[i]);
			}
		} else if (data && (<any>data)._isSet_) {
			// This is a set
			var set = <SetInterface>data;
			for (var i = 0; i < set.size(); ++i) {
				this.add(set.get(i));
			}
		}
	}
	
	
	add(val: any) {
		var search = this._binarySearch(val, 0, this._data.length);
		if (search[0] == -1) {
			this._data.splice(search[1], 0, val);
		}
	}
	
	
	clear() {
		this._data = [];
	}
	
	
	contains(val: any) {
		return this.indexOf(val) >= 0;
	}
	
	
	difference(other: SetInterface): SetInterface {
		var set = new OrderedSet(this);
		for (var i = 0; i < other.size(); ++i) {
			set.remove(other.get(i));
		}
		return set;
	}
	
	
	get(index?: number) {
		if (typeof index === 'undefined') {
			return this._data;
		} else {
			return this._data[index];
		}
	}
	
	
	indexOf(val: any): number {
		return this._binarySearch(val, 0, this._data.length)[0];	
	}
	
	
	intersection(other: SetInterface): SetInterface {
		var set = new OrderedSet();
		for (var i = 0; i < this.size(); ++i) {
			if (other.contains(this._data[i])) {
				set.add(this._data[i]);
			}
		}
		return set;
	}
	
	
	isDisjoint(other: SetInterface): boolean {
		for (var i = 0; i < this.size(); ++i) {
			if (other.contains(this._data[i])) {
				return false;
			}
		}
		return true;
	}
	
	
	isEqual(other: SetInterface): boolean {
		return this.isSubset(other) && this.isSuperset(other);
	}
	
	
	isSubset(other: SetInterface): boolean {
		for (var i = 0; i < this.size(); ++i) {
			if (!other.contains(this._data[i])) {
				return false;
			}
		}
		return true;
	}
	
	
	isSuperset(other: SetInterface): boolean {
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
	
	
	union(other: SetInterface): SetInterface {
		var set = new OrderedSet(this);
		for (var i = 0; i < other.size(); ++i) {
			set.add(other.get(i));
		}
		return set;
	}
	
	
	/**
	 * returns the index, if the element was found
	 * and the index where it should be inserted, if not found
	 */
	private _binarySearch(val: any, low: number, high: number): Array<number> {
		if (low > high) return [-1, low];
		var mid: number = Math.floor((low + high) / 2);
		
		if (this._data[mid] == val) return [mid, mid];
		else if (this._data[mid] < val) return this._binarySearch(val, mid+1, high);
		else return this._binarySearch(val, low, mid-1);
	}
}



// modules.export
export = OrderedSet;