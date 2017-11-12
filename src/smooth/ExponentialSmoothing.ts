export module es {
  export function SingleExponentialSmoothing(vector: number[], alpha: number): number[] {
    if (!vector || typeof alpha === 'undefined') throw 'Not enough parameters given!';
    if (0 > alpha || alpha > 1) throw 'Alpha has to be in [0,1]!';

    let result: number[] = []; // Smoothed data

    result.push(vector[0]);
    for (let t: number = 1; t < vector.length; ++t) {
      let val: number = alpha * vector[t] + (1 - alpha) * result[t - 1];
      result.push(val);
    }

    return result;
  }

  // Double Exponential Smoothing
  // TODO: Type checking
  // TODO: tests
  export function DoubleExponentialSmoothing(data: number[], alpha: number, beta: number): number[] {
    if (!data || !alpha) return null;

    let s: number[] = []; // Smoothed data
    let b: number[] = []; // Trend

    s.push(data[0]);
    b.push(data[1] - data[0]);

    for (let t: number = 1; t < data.length; ++t) {
      let val: number = alpha * data[t] + (1 - alpha) * (s[t - 1] + b[t - 1]);
      s.push(val);

      let trend: number = beta * (s[t] - s[t - 1]) + (1 - beta) * b[t - 1];
      b.push(trend);
    }

    return s;
  }

  // TODO: Triple Exponential Smoothing
}
