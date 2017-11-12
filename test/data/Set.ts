import * as assert from 'assert';
import { Set } from '../../src/data/Set';
import { OrderedSet } from '../../src/data/OrderedSet';
import { Vector } from '../../src/data/Vector';

describe('data.Set', function () {
  it('works', function () {
    var set = new Set([1]);

    set.add(5);
    set.add(2);
    set.add(3);
    set.add(5);
    assert.deepEqual(set.toArray(), [1, 5, 2, 3]);

    set.remove(5);
    assert.deepEqual(set.toArray(), [1, 2, 3]);

    assert.equal(set.get(0), 1);
    assert.equal(set.get(1), 2);

    assert(set.contains(3));
  });
});

describe('data.OrderedSet', function () {
  it('basic functionality works', function () {
    var set = new OrderedSet([1, 1, 5, 2, 3, 6]);

    assert.deepEqual(set.toArray(), [1, 2, 3, 5, 6]);

    set.add(2);
    set.add(4);
    assert.deepEqual(set.toArray(), [1, 2, 3, 4, 5, 6]);

    set.clear();
    assert.deepEqual(set.toArray(), []);
  });

  it('comparison methods work', function () {
    var set1 = new OrderedSet([1, 5, 2, 3, 6]);
    var set2 = new OrderedSet([3, 5]);
    var set3 = new OrderedSet([5, 3, 3, 5, 5]);
    var set4 = new OrderedSet([4, 1]);

    assert(!set1.isSubset(set2));
    assert(set1.isSuperset(set2));
    assert(set1.isSuperset(set1));

    assert(set2.isSubset(set1));
    assert(!set2.isSuperset(set1));
    assert(set2.isSuperset(set2));

    assert(!set4.isDisjoint(set1));
    assert(set4.isDisjoint(set2));
    assert(!set1.isDisjoint(set1));

    assert(!set1.isEqual(set3));
    assert(set2.isEqual(set3));
    assert(set1.isEqual(set1));
  });

  it('set operations work', function () {
    var set1 = new OrderedSet([1, 5, 2, 3, 6]);
    var set2 = new OrderedSet([3, 5, 0]);

    assert.deepEqual(set1.difference(set2).toArray(), [1, 2, 6]);
    assert.deepEqual(set2.difference(set1).toArray(), [0]);

    assert.deepEqual(set1.union(set2).toArray(), [0, 1, 2, 3, 5, 6]);
    assert.deepEqual(set1.intersection(set2).toArray(), [3, 5]);
  });

  it('can convert from vector', function () {
    let vec = new Vector();
    vec.push(2);
    vec.push(3);
    vec.push(1);
    vec.push(2);
    let set = new Set(vec);

    assert.deepEqual(set.toArray(), [2, 3, 1]);
  });
});