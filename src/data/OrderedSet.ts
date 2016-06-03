import Set = require("./Set");
/**
 * @class OrderedSet
 *
 * Keeps values in order
 */
class OrderedSet extends Set {

	add(val: any): void {
		let search: number[] = this.binarySearch(val, 0, this.array.length);
		if (search[0] === -1) {
			this.array.splice(search[1], 0, val);
		}
	}

	difference(other: ISet): OrderedSet {
		let set: OrderedSet = new OrderedSet(this);
		for (let i: number = 0; i < other.size(); ++i) {
			set.remove(other.get(i));
		}
		return set;
	}

	indexOf(val: any): number {
		return this.binarySearch(val, 0, this.array.length)[0];
	}

	intersection(other: ISet): OrderedSet {
		let set: OrderedSet = new OrderedSet();
		for (let i: number = 0; i < this.size(); ++i) {
			if (other.contains(this.array[i])) {
				set.add(this.array[i]);
			}
		}
		return set;
	}

	union(other: ISet): OrderedSet {
		let set: OrderedSet = new OrderedSet(this);
		for (let i: number = 0; i < other.size(); ++i) {
			set.add(other.get(i));
		}
		return set;
	}

	/**
	 * returns the index, if the element was found
	 * and the index where it should be inserted, if not found
	 */
	private binarySearch(val: any, low: number, high: number): number[] {
		if (low > high) return [-1, low];
		let mid: number = Math.floor((low + high) / 2);

		if (this.array[mid] === val) return [mid, mid];
		else if (this.array[mid] < val) return this.binarySearch(val, mid + 1, high);
		else return this.binarySearch(val, low, mid - 1);
	}
}

// modules.export
export = OrderedSet;