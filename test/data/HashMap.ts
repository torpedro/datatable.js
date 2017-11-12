import * as assert from 'assert';
import { HashMap } from '../../src/data/HashMap';

describe('data.HashMap', function () {
  it('equality map works', function () {
    // Use the default/equality constructor
    var map = new HashMap();

    map.set('abc', 1);
    map.set({ a: 1 }, 1);

    assert.equal(map.get('abc'), 1);
    assert.equal(map.get({ a: 1 }), 1);

    map.set({ a: 1 }, 2);
    assert.equal(map.get({ a: 1 }), 2);

    map.set(['Max', 'Mustermann'], 1000);
    assert.equal(map.get(['Max', 'Mustermann']), 1000);


    assert.deepEqual(map.keys(), ['abc', { a: 1 }, ['Max', 'Mustermann']]);
  });


  it('identity map works', function () {
    // Use the identity constructor
    var map = new HashMap(true);

    var a = { 'a': 1 };
    var b = { 'a': 1 };

    map.set('abc', 1);
    map.set(a, 1);

    assert.equal(map.get('abc'), 1);
    assert.equal(map.get(b), null); // Not Identical keys
    assert.equal(map.get(a), 1); // Identical keys

    map.set(b, 2);
    assert.equal(map.get(a), 1);
    assert.equal(map.get(b), 2);
  });
});