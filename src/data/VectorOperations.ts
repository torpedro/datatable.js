/// <reference path='../typings/underscore/underscore.d.ts' />
import _ = require('underscore');

import { types } from './types';

/**
 * @module vec
 */
export module vec {
	export function range(vector: any[], dataType?: string): [any, any] {
		let size: number = vector.length;
		if (size === 0) return null;

		let range: [any, any] = [vector[0], vector[0]];
		for (let n: number = 1; n < size; ++n) {
			let value: any = vector[n];

			// todo: Handle different datatypes
			if (value < range[0]) range[0] = value;
			if (value > range[1]) range[1] = value;
		}

		return range;
	}

	export function min(vector: any[]): any { return range(vector)[0]; }
	export function max(vector: any[]): any { return range(vector)[1]; }

	export function detectDataType(vector: any[], parseStrings: boolean = true, convertTypes: boolean = false): string  {
		let typeset: string[] = [];
		for (let i: number = 0; i < vector.length; ++i) {
			let value: any = vector[i];

			let res: types.ITypeDetection = types.detectDataType(value, parseStrings);

			// ignore nulls, they have no type
			if (res.type === types.kNull) continue;

			// add to the typeset
			if (typeset.indexOf(res.type) === -1) typeset.push(res.type);
			if (convertTypes) vector[i] = res.value;
		}


		if (typeset.length === 0) return types.kNull;
		if (typeset.length === 1) return typeset[0];
		else return 'any'; // return an any type
		// todo: roll-up the types
	}

	export function convertToType(vector: any[], targetType: string): any[] {
		let newVec: any[] = _.map(vector, function(value: any, i: number): any {
			return types.convert(value, targetType);
		});
		return newVec;
	}

	/**
	 * @name groupByPositions
	 *
	 * not type safe
	 */
	export function groupByPositions(vector: any[]): {} {
		let map: {} = {};
		for (let i: number = 0; i < vector.length; ++i) {
			let value: any = vector[i];
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
	export function distinctValues(vector: any[]): any[] {
		let values: any[] = [];
		for (let i: number = 0; i < vector.length; ++i) {
			if (values.indexOf(vector[i]) === -1) {
				values.push(vector[i]);
			}
		}
		return values;
	}
}
