import * as assert from 'assert';
import { vec } from '../../src/data/VectorOperations';

describe('data.VectorOperations', function() {
  it('range', function() {
    var vector: Array<any>;
    vector = [1, 2, 3, 4, 5, 2, 4, 10, -3, 5];

    assert.equal(vec.min(vector), -3);
    assert.equal(vec.max(vector), 10);
    assert.deepEqual(vec.range(vector), [-3, 10]);
  });

  it('detectDataTypes', function() {
    var vector: Array<any>;

    vector = [1, 2, 3, 4, 5, 2, 4, null, 10, -3, 5, '1.0'];
    assert.equal(vec.detectDataType(vector), 'number');

    vector = [1, 2, 3, 4, 5, 2, 4, 10, -3, 5, 'sbl'];
    assert.equal(vec.detectDataType(vector), 'any');

    vector = ['2014-02-03', '2015-05-02', '2.3.2012', '5/10/2011', new Date()];
    assert.equal(vec.detectDataType(vector), 'date');
  });

  it('distinctValues', function() {
    var vector: Array<any>;

    vector = [1, 2, 1, 1, 2, 3, '1.0', null, 1];
    assert.deepEqual(vec.distinctValues(vector), [1, 2, 3, '1.0', null]);
  });
});