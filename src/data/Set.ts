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
	IS_SET = true;
	protected array: Array<any>;

	constructor();
	constructor(set: ISet);
	constructor(data: Array<any>);
	constructor(data?: any) {
		// initialize empty
		var i;
		this.array = [];

		if (data instanceof Array) {
			for (i = 0; i < data.length; ++i) {
				this.add(data[i]);
			}
		} else if (data && data.IS_SET) {
			// This is a set
			var set = <ISet> data;
			for (i = 0; i < set.size(); ++i) {
				this.add(set.get(i));
			}
		}
	}

	add(val: any) {
		if (this.array.indexOf(val) === -1) {
			this.array.push(val);
		}
	}

	clear() {
		this.array = [];
	}

	contains(val: any) {
		return this.array.indexOf(val) >= 0;
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
			return this.array;
		} else {
			return this.array[index];
		}
	}

	indexOf(val: any): number {
		return this.array.indexOf(val);
	}

	intersection(other: ISet): Set {
		var set = new Set();
		for (var i = 0; i < this.size(); ++i) {
			if (other.contains(this.array[i])) {
				set.add(this.array[i]);
			}
		}
		return set;
	}

	isDisjoint(other: ISet): boolean {
		for (var i = 0; i < this.size(); ++i) {
			if (other.contains(this.array[i])) {
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
			if (!other.contains(this.array[i])) {
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
			var elem = this.array[0];
			this.remove(elem);
			return elem;
		}
	}

	remove(val: any) {
		var index = this.indexOf(val);
		if (index >= 0) {
			this.array.splice(index, 1);
		}
	}

	size() {
		return this.array.length;
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