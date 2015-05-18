/**
 * @module es
 */
module es {
	export function SingleExponentialSmoothing(vector: Array<number>, alpha: number): Array<number> {
		if (!vector || typeof alpha == 'undefined') throw "Not enough parameters given!";
		if (0 > alpha || alpha > 1) throw "Alpha has to be in [0,1]!";
		
		var result = []; // smoothed data
		var k = 1; // window size

		result.push(vector[0]);
		for (var t = 1; t < vector.length; ++t) {
			var val = alpha * vector[t] + (1 - alpha) * result[t - 1];
			result.push(val);
		}
		
		return result;
	}
	
	// TODO: Double Exponential Smoothing
	// TODO: Triple Exponential Smoothing
}


// modules.export
export = es;