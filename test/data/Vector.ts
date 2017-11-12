import * as assert from 'assert';
import { Vector } from '../../src/data/Vector';


describe('data.Vector', function() {
  it('basic functionality', function() {
    var vector: Vector;

    vector = new Vector('number');
    assert.equal(vector.push(3), true);
    assert.equal(vector.push(4), true);
    assert.equal(vector.push('5'), true);
    assert.equal(vector.push('abc'), false);
    assert.equal(vector.push(3), true);

    assert.deepEqual(vector.toArray(), [3, 4, 5, 3]);
    assert.equal(vector.get(2), 5);
    assert.equal(vector.size(), 4);


    vector = new Vector('number', [5, 3]);
    vector.push(22);

    assert.deepEqual(vector.toArray(), [5, 3, 22]);
    assert.equal(vector.get(2), 22);
    assert.equal(vector.size(), 3);
  });
});