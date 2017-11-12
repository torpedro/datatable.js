import * as assert from 'assert';
import { es } from '../../src/smooth/ExponentialSmoothing';


describe('smooth.ExponentialSmoothing', function () {
  it('SingleExponentialSmoothing', function () {
    var vector: Array<number>;
    var smoothed: Array<any>;

    vector = [1, 2, 2, 1, 5];

    smoothed = es.SingleExponentialSmoothing(vector, 1);
    assert.deepEqual(smoothed, vector);

    smoothed = es.SingleExponentialSmoothing(vector, 0.5);
    assert.deepEqual(smoothed, [1, 1.5, 1.75, 1.375, 3.1875]);

    smoothed = es.SingleExponentialSmoothing(vector, 0);
    assert.deepEqual(smoothed, [1, 1, 1, 1, 1]);
  });
});