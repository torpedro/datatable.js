/// <reference path="../typings/tsd.d.ts" />
import assert = require("assert")
import Types = require('../../src/data/Types');


describe('Types', function() {
    
    it('detect dates correctly', function() {
		// ISO Date
		var type = Types.detectDataType('2014-05-02');
		assert.equal(type.type, 'date');
		
		// US Dates
		type = Types.detectDataType('05/02/2014');
		assert.equal(type.type, 'date');
		
		type = Types.detectDataType('5/2/2014');
		assert.equal(type.type, 'date');
		
		// German Style Dates
		type = Types.detectDataType('02.05.2014');
		assert.equal(type.type, 'date');
		
		type = Types.detectDataType('2.5.2014');
		assert.equal(type.type, 'date');
    });
    
});