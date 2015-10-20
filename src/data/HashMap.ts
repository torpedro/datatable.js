/// <reference path="../typings/underscore/underscore.d.ts" />
import _ = require("underscore");
import util = require("./util");

/**
 * @class HashMap
 *
 *
 */
class HashMap<K, V> {
	private _data = {};

	// flag to indicate whether to use equality or identity
	private _useIdentity: boolean;

	constructor(useIdentity?: boolean) {
		if (useIdentity) this._useIdentity = true;
		else this._useIdentity = false;
	}

	set(key: K, val: V): void {
		var bucket = this._getBucket(key);
		var i = this._findKeyInBucket(key, bucket);

		if (i >= 0) bucket[i][1] = val;
		else bucket.push([key, val]);
	}


	get(key: K): V {
		var bucket = this._getBucket(key);
		var i = this._findKeyInBucket(key, bucket);

		if (i >= 0) return bucket[i][1];
		else return null;
	}

	contains(key: K): boolean {
		var bucket = this._getBucket(key);
		return this._findKeyInBucket(key, bucket) >= 0;
	}

	keys(): Array<K> {
		var keys = [];
		for (var hash in this._data) {
			var bucket = this._data[hash];
			for (var i = 0; i < bucket.length; ++i) {
				keys.push(bucket[i][0]);
			}
		}
		return keys;
	}

	private _getBucket(key: K): Array<Array<any>> {
		// hash the key
		var hash = util.hashCode(key);
		// create bucket if it doesn't exist
		if (!(hash in this._data)) this._data[hash] = [];
		// return the bucket
		return this._data[hash];
	}

	/**
	 * returns index of key within bucket
	 * returns -1 if key not found
	 */
	private _findKeyInBucket(key: K, bucket: Array<Array<any>>): number {
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