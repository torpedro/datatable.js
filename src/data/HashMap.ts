import util = require('util');
/**
 * @class HashMap
 * 
 * 
 */
class HashMap {
	private _data = {};
	
	constructor() {
		
	}
	
	set(key: any, val: any): void {
		var hash = util.hashCode(key);
		
		if (!(hash in this._data)) this._data[hash] = [];
		
		// Get the bucket
		var bucket = this._data[hash];
		
		// Check if key exists
		for (var i = 0; i < bucket.length; ++i) {
			// TODO
		}
	}
	
}