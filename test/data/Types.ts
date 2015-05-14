/// <reference path="../typings/tsd.d.ts" />
import assert = require("assert")
import Types = require('../../src/data/Types');


describe('Types', function() {
	
	describe('detectDataTypeOfString', function() {
   
	    it('detect dates correctly', function() {
			var res;
			
			// ISO Date
			res = Types.detectDataTypeOfString('2014-05-02');
			assert.strictEqual(res.type, 'date');
			assert.strictEqual(res.value.toISOString(), '2014-05-02T00:00:00.000Z');
			
			// US Dates
			res = Types.detectDataTypeOfString('05/02/2014');
			assert.strictEqual(res.type, 'date');
			assert.strictEqual(res.value.toISOString(), '2014-05-02T00:00:00.000Z');
			
			res = Types.detectDataTypeOfString('5/2/2014');
			assert.strictEqual(res.type, 'date');
			assert.strictEqual(res.value.toISOString(), '2014-05-02T00:00:00.000Z');
			
			// German Style Dates
			res = Types.detectDataTypeOfString('02.05.2014');
			assert.strictEqual(res.type, 'date');
			assert.strictEqual(res.value.toISOString(), '2014-05-02T00:00:00.000Z');
			
			res = Types.detectDataTypeOfString('2.5.2014');
			assert.strictEqual(res.type, 'date');
			assert.strictEqual(res.value.toISOString(), '2014-05-02T00:00:00.000Z');
	    });
		
		it('detects numbers correctly', function() {
			var res;
			
			// US Number
			res = Types.detectDataTypeOfString('3100.2');
			assert.strictEqual(res.type, 'number');
			assert.strictEqual(res.value, 3100.2);
			
			res = Types.detectDataTypeOfString('1,300.500');
			assert.strictEqual(res.type, 'number');
			assert.strictEqual(res.value, 1300.5);
			
			// GER Number
			res = Types.detectDataTypeOfString('1500,2');
			assert.strictEqual(res.type, 'number');
			assert.strictEqual(res.value, 1500.2);
			
			res = Types.detectDataTypeOfString('1.100,2');
			assert.strictEqual(res.type, 'number');
			assert.strictEqual(res.value, 1100.2);
		});
		
		it('detects strings correctly', function() {
			var res;
			
			res = Types.detectDataTypeOfString('name');
			assert.strictEqual(res.type, 'string');
			assert.strictEqual(res.value, 'name');
			
		});
	});

	describe('detectDataType', function() {
		it('detects correctly', function() {
			var res;
			
			res = Types.detectDataType(100);
			assert.strictEqual(res.type, 'number');
			
			res = Types.detectDataType(undefined);
			assert.strictEqual(res.type, 'null');
			
			res = Types.detectDataType(null);
			assert.strictEqual(res.type, 'null');
			
			res = Types.detectDataType('100', false);
			assert.strictEqual(res.type, 'string');
			
			res = Types.detectDataType('100');
			assert.strictEqual(res.type, 'number');
			
			res = Types.detectDataType(new Date());
			assert.strictEqual(res.type, 'date');
			
		});
	});
});