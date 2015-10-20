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

	/**
	 * Double Exponential Smoothing
	 *
	 * TODO: Type checking
	 * TODO: tests
	 */
	export function DoubleExponentialSmoothing(data: Array<number>, alpha: number, beta: number) {
		if (!data || !alpha) return null;

		var s = []; // smoothed data
		var b = []; // trend
		var k = 1; // window size

		s.push(data[0]);
		b.push(data[1] - data[0]);

		for (var t = 1; t < data.length; ++t) {
			var val = alpha * data[t] + (1 - alpha) * (s[t - 1] + b[t - 1]);
			s.push(val);

			var trend = beta * (s[t] - s[t - 1]) + (1 - beta) * b[t - 1];
			b.push(trend);
		}

		return s;
	}

	// TODO: Triple Exponential Smoothing
}


// modules.export
export = es;