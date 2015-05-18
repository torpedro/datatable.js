/// <reference path="../typings/tsd.d.ts" />
import assert = require("assert");
import Set = require('../../src/data/Set');
import OrderedSet = require('../../src/data/OrderedSet');

describe('Sets', function() {
    describe('Set', function () {
        it('works', function() {
    		var set = new Set([1]);
            
            set.add(5);
            set.add(2);
            set.add(3);
            set.add(5);
            assert.deepEqual(set.get(), [1, 5, 2, 3]);
            
            set.remove(5);
            assert.deepEqual(set.get(), [1, 2, 3]);
            
            assert.equal(set.get(0), 1);
            assert.equal(set.get(1), 2);
            
            assert(set.contains(3));
        });
    });

    describe('OrderedSet', function() {
       it('works', function() {
    		var set = new OrderedSet([1, 1, 5, 2, 3, 6]);
            
            assert.deepEqual(set.get(), [1, 2, 3, 5, 6]);
            
            set.add(2);
            set.add(4);
            assert.deepEqual(set.get(), [1, 2, 3, 4, 5, 6]);
       });
    });
});