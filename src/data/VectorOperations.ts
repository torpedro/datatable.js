
/**
 * @class VectorOperations
 */
class VectorOperations {
	static range(vector: Array<any>): Array<any> {
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
}


// export.modules
export = VectorOperations;