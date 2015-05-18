/// <reference path="../typings/underscore/underscore.d.ts" />
import _ = require('underscore');
import util = require('./util');

/**
 * @class HashMap
 * 
 * 
 */
class HashMap {
	private _data = {};
	
	// Flag to indicate whether to use equality or identity
	private _useIdentity: boolean;
	
	constructor(useIdentity?: boolean) {
		if (useIdentity) this._useIdentity = true;
		else this._useIdentity = false;
	}
	
	public set(key: any, val: any): void {
		var bucket = this._getBucket(key);
		var i = this._findKeyInBucket(key, bucket);
		
		if (i >= 0) bucket[i][1] = val;
		else bucket.push([key, val]);
	}	
	
	
	public get(key: any): any {
		var bucket = this._getBucket(key);
		var i = this._findKeyInBucket(key, bucket);
		
		if (i >= 0) return bucket[i][1];
		else return null;
	}
	
	public contains(key: any): any {
		var bucket = this._getBucket(key);
		return this._findKeyInBucket(key, bucket) >= 0;
	}
	
	private _getBucket(key: any): Array<any> {
		// Hash the key
		var hash = util.hashCode(key);
		// Create bucket if it doesn't exist
		if (!(hash in this._data)) this._data[hash] = [];
		// Return the bucket
		return this._data[hash];	
	}
	
	/**
	 * returns index of key within bucket
	 * returns -1 if key not found
	 */
	private _findKeyInBucket(key: any, bucket: Array<any>): number {
		for (var i = 0; i < bucket.length; ++i) {
			if (this._areEqual(key, bucket[i][0])) {
				return i;
			}
		}
		return -1;
	}
	
	private _areEqual(a: any, b: any) {
		if (this._useIdentity) return a === b;
		else return _.isEqual(a, b);
	}
	
}

// modules.export
export = HashMap;