import Set = require("./Set");
/**
 * @class OrderedSet
 * 
 * Keeps values in order
 */
class OrderedSet extends Set {

	add(val: any) {
		var search = this._binarySearch(val, 0, this._data.length);
		if (search[0] === -1) {
			this._data.splice(search[1], 0, val);
		}
	}

	difference(other: ISet): OrderedSet {
		var set = new OrderedSet(this);
		for (var i = 0; i < other.size(); ++i) {
			set.remove(other.get(i));
		}
		return set;
	}

	indexOf(val: any): number {
		return this._binarySearch(val, 0, this._data.length)[0];
	}

	intersection(other: ISet): OrderedSet {
		var set = new OrderedSet();
		for (var i = 0; i < this.size(); ++i) {
			if (other.contains(this._data[i])) {
				set.add(this._data[i]);
			}
		}
		return set;
	}

	union(other: ISet): OrderedSet {
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
	private _binarySearch(val: any, low: number, high: number): number[] {
		if (low > high) return [-1, low];
		var mid: number = Math.floor((low + high) / 2);

		if (this._data[mid] === val) return [mid, mid];
		else if (this._data[mid] < val) return this._binarySearch(val, mid + 1, high);
		else return this._binarySearch(val, low, mid - 1);
	}
}

// modules.export
export = OrderedSet;