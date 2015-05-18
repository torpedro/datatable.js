/// <reference path="Types" />
import Types = require('./Types');

/**
 * @class VectorOperations
 */
class VectorOperations {
	static range(vector: Array<any>, dataType?: string): Array<any> {
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
	
	static min(vector: Array<any>): any { return VectorOperations.range(vector)[0]; }
	static max(vector: Array<any>): any { return VectorOperations.range(vector)[1]; }
	
	static detectDataType(vector: Array<any>, parseStrings?: boolean): string  {
		if (typeof parseStrings === 'undefined') parseStrings = true;
		
		var typeset = [];
		for (var i = 0; i < vector.length; ++i) {
			var value = vector[i];
			
			var res = Types.detectDataType(value, parseStrings);
			
			// Ignore nulls, they have no type
			if (res.type == Types.kNull) continue;
			
			// Add to the typeset
			if (typeset.indexOf(res.type) == -1) typeset.push(res.type);
		}
		
		if (typeset.length == 0) return Types.kNull;
		if (typeset.length == 1) return typeset[0];
		else return 'mixed'
	}
	
	/**
	 * @name groupByPositions
	 * 
	 * not type safe
	 */
	static groupByPositions(vector: Array<any>): Object {
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
	static distinctValues(vector: Array<any>): Array<any> {
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
export = VectorOperations;