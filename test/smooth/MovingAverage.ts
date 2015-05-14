/// <reference path="../typings/tsd.d.ts" />
import assert = require("assert")
import MovingAverage = require('../../src/smooth/MovingAverage');


describe('MovingAverage', function() {
    
    it('SimpleMovingAverage', function() {
		var vector: Array<number>;
		var smoothed: Array<any>;
		
		vector = [1, 2, 2, 1, 5];
		
		smoothed = MovingAverage.SimpleMovingAverage(vector, 2);
		assert.deepEqual(smoothed, [1, 1.5, 2, 1.5, 3]);
		
		smoothed = MovingAverage.SimpleMovingAverage(vector, 3);
		assert.deepEqual(smoothed, [1, 1.5, 5/3, 5/3, 8/3]);
		
		smoothed = MovingAverage.SimpleMovingAverage(vector, 4);
		assert.deepEqual(smoothed, [1, 1.5, 5/3, 6/4, 10/4]);
    });
    
});