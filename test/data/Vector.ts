/// <reference path="../typings/tsd.d.ts" />
import assert = require("assert")
import Vector = require('../../src/data/Vector');


describe('data.Vector', function() {

    it('basic functionality', function() {
		var vector: Vector;

		vector = new Vector('number');
		vector.add(3);
		vector.add(4);
		vector.add(5);
		vector.add(3);

		assert.deepEqual(vector.getData(), [3, 4, 5, 3]);
		assert.equal(vector.get(2), 5);
		assert.equal(vector.size(), 4);


		vector = new Vector('number', [5, 3]);
		vector.add(22);

		assert.deepEqual(vector.getData(), [5, 3, 22]);
		assert.equal(vector.get(2), 22);
		assert.equal(vector.size(), 3);
    });

});