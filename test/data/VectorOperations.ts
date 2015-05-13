/// <reference path="../typings/tsd.d.ts" />
import assert = require("assert")
import VectorOperations = require('../../src/data/VectorOperations');


describe('VectorOperations', function() {
    
    it('range should give correct results', function() {
		var vector: Array<any>;
		vector = [1, 2, 3, 4, 5, 2, 4, 10, -3, 5];
		
		assert.equal(VectorOperations.min(vector), -3);
		assert.equal(VectorOperations.max(vector), 10);
		assert.deepEqual(VectorOperations.range(vector), [-3, 10]);
    });
    
});