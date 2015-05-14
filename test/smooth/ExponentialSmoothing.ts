/// <reference path="../typings/tsd.d.ts" />
import assert = require("assert")
import ExponentialSmoothing = require('../../src/smooth/ExponentialSmoothing');


describe('ExponentialSmoothing', function() {
    
    it('SingleExponentialSmoothing', function() {
		var vector: Array<number>;
		var smoothed: Array<any>;
		
		vector = [1, 2, 2, 1, 5];
		
		smoothed = ExponentialSmoothing.SingleExponentialSmoothing(vector, 1);
		assert.deepEqual(smoothed, vector);
		
		smoothed = ExponentialSmoothing.SingleExponentialSmoothing(vector, 0.5);
		assert.deepEqual(smoothed, [1, 1.5, 1.75, 1.375, 3.1875]);
		
		smoothed = ExponentialSmoothing.SingleExponentialSmoothing(vector, 0);
		assert.deepEqual(smoothed, [1, 1, 1, 1, 1]);
    });
	
	
    
});