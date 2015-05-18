/**
 * @class OrderedSet
 * 
 * Keeps values in order
 */
class OrderedSet {
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
	
	contains(val: any) { return this.indexOf(val) >= 0; }
	
	add(val: any) {
		var search = this._binarySearch(val, 0, this._data.length);
		if (search[0] == -1) {
			this._data.splice(search[1], 0, val);
		}
	}
	
	remove(val: any) {
		var index = this.indexOf(val);
		if (index >= 0) {
			this._data.splice(index, 1);
		}
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