/// <reference path="../typings/tsd.d.ts" />
import assert = require("assert")
import VectorOperations = require('../../src/data/VectorOperations');


describe('VectorOperations', function() {
    
    it('range', function() {
		var vector: Array<any>;
		vector = [1, 2, 3, 4, 5, 2, 4, 10, -3, 5];
		
		assert.equal(VectorOperations.min(vector), -3);
		assert.equal(VectorOperations.max(vector), 10);
		assert.deepEqual(VectorOperations.range(vector), [-3, 10]);
    });
	
    it('detectDataTypes', function() {
		var vector: Array<any>;
		var type: string;
		
		vector = [1, 2, 3, 4, 5, 2, 4, null, 10, -3, 5, '1.0'];
		assert.equal(VectorOperations.detectDataType(vector), 'number');
		
		vector = [1, 2, 3, 4, 5, 2, 4, 10, -3, 5, 'sbl'];
		assert.equal(VectorOperations.detectDataType(vector), 'mixed');
		
		vector = ['2014-02-03', '2015-05-02', '2.3.2012', '5/10/2011', new Date()];
		assert.equal(VectorOperations.detectDataType(vector), 'date');
    });
    
});