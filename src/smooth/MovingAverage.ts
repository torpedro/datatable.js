/**
 * @module ma
 */
module ma {
	export function SimpleMovingAverage(vector: Array<number>, k: number): Array<number> {
		var result: Array<number> = [];

		// For first k-records use their partial average
		for (var i = 0; i < k && i < vector.length; ++i) {
			// Calculate the partial average
			var sum = 0;
			for (var j = i; j >= 0; --j) {
				sum += vector[j];
			}
			result.push(sum / (i + 1));
		}

		// For the other records use the average of the k-1 past records
		for (var i = k; i < vector.length; ++i) {
			var sum = 0;
			for (var j = i; j > i - k; --j) {
				sum += vector[j];
			}
			result.push(sum / k);
		}

		return result;
	}


	// TODO: Central Moving Average
	// TODO: Cumulative Moving Average
}


// modules.export
export = ma;