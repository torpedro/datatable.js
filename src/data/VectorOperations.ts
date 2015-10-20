/// <reference path="../typings/underscore/underscore.d.ts" />
import _ = require('underscore');

import types = require('./types');

/**
 * @module vec
 */
module vec {
	export function range(vector: Array<any>, dataType?: string): Array<any> {
		var size: number = vector.length;
		if (size == 0) return null;

		var range = [vector[0], vector[0]];
		for (var n = 1; n < size; ++n) {
			var value = vector[n];

			// TODO: Handle different datatypes
			if (value < range[0]) range[0] = value;
			if (value > range[1]) range[1] = value;
		}

		return range;
	}

	export function min(vector: Array<any>): any { return range(vector)[0]; }
	export function max(vector: Array<any>): any { return range(vector)[1]; }

	export function detectDataType(vector: Array<any>, parseStrings?: boolean, convertTypes?: boolean): string  {
		if (typeof parseStrings === 'undefined') parseStrings = true;
		if (typeof convertTypes === 'undefined') convertTypes = false;

		var typeset = [];
		for (var i = 0; i < vector.length; ++i) {
			var value = vector[i];

			var res = types.detectDataType(value, parseStrings);

			// Ignore nulls, they have no type
			if (res.type == types.kNull) continue;

			// Add to the typeset
			if (typeset.indexOf(res.type) == -1) typeset.push(res.type);
			if (convertTypes) vector[i] = res.value
		}


		if (typeset.length == 0) return types.kNull;
		if (typeset.length == 1) return typeset[0];
		else return 'any'; // Return an any type
		// TODO: roll-up the types
	}

	export function convertToType(vector: any[], targetType: string): any[] {
		var newVec = _.map(vector, function(value, i) {
			return types.convert(value, targetType);
		});
		return newVec;
	}

	/**
	 * @name groupByPositions
	 *
	 * not type safe
	 */
	export function groupByPositions(vector: Array<any>): Object {
		var map = {};
		for (var i = 0; i < vector.length; ++i) {
			var value = vector[i];
			if (value in map) {
				map[value].push(i);
			} else {
				map[value] = [i];
			}
		}
		return map;
	}

	/**
	 * list all distinct values within the array
	 */
	export function distinctValues(vector: Array<any>): Array<any> {
		var values = [];
		for (var i = 0; i < vector.length; ++i) {
			if (values.indexOf(vector[i]) == -1) {
				values.push(vector[i]);
			}
		}
		return values;
	}
}


// export.modules
export = vec;