/// <reference path="../typings/tsd.d.ts" />
import assert = require("assert")
import { Vector } from '../../src/data/Vector';


describe('data.Vector', function() {

    it('basic functionality', function() {
		var vector: Vector;

		vector = new Vector('number');
		assert.equal(vector.add(3), true);
		assert.equal(vector.add(4), true);
		assert.equal(vector.add('5'), true);
		assert.equal(vector.add('abc'), false);
		assert.equal(vector.add(3), true);

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