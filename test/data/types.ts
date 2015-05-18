/// <reference path="../typings/tsd.d.ts" />
import assert = require("assert");
import types = require('../../src/data/types');


describe('types', function() {
	
	describe('detectDataTypeOfString', function() {
   
	    it('detect dates correctly', function() {
			var res;
			
			// ISO Date
			res = types.detectDataTypeOfString('2014-05-02');
			assert.strictEqual(res.type, 'date');
			assert.strictEqual(res.value.toISOString(), '2014-05-02T00:00:00.000Z');
			
			// US Dates
			res = types.detectDataTypeOfString('05/02/2014');
			assert.strictEqual(res.type, 'date');
			assert.strictEqual(res.value.toISOString(), '2014-05-02T00:00:00.000Z');
			
			res = types.detectDataTypeOfString('5/2/2014');
			assert.strictEqual(res.type, 'date');
			assert.strictEqual(res.value.toISOString(), '2014-05-02T00:00:00.000Z');
			
			// German Style Dates
			res = types.detectDataTypeOfString('02.05.2014');
			assert.strictEqual(res.type, 'date');
			assert.strictEqual(res.value.toISOString(), '2014-05-02T00:00:00.000Z');
			
			res = types.detectDataTypeOfString('2.5.2014');
			assert.strictEqual(res.type, 'date');
			assert.strictEqual(res.value.toISOString(), '2014-05-02T00:00:00.000Z');
	    });
		
		it('detects numbers correctly', function() {
			var res;
			
			// US Number
			res = types.detectDataTypeOfString('3100.2');
			assert.strictEqual(res.type, 'number');
			assert.strictEqual(res.value, 3100.2);
			
			res = types.detectDataTypeOfString('1,300.500');
			assert.strictEqual(res.type, 'number');
			assert.strictEqual(res.value, 1300.5);
			
			// GER Number
			res = types.detectDataTypeOfString('1500,2');
			assert.strictEqual(res.type, 'number');
			assert.strictEqual(res.value, 1500.2);
			
			res = types.detectDataTypeOfString('1.100,2');
			assert.strictEqual(res.type, 'number');
			assert.strictEqual(res.value, 1100.2);
		});
		
		it('detects strings correctly', function() {
			var res;
			
			res = types.detectDataTypeOfString('name');
			assert.strictEqual(res.type, 'string');
			assert.strictEqual(res.value, 'name');
			
		});
	});

	describe('detectDataType', function() {
		it('detects correctly', function() {
			var res;
			
			res = types.detectDataType(100);
			assert.strictEqual(res.type, 'number');
			
			res = types.detectDataType(undefined);
			assert.strictEqual(res.type, 'null');
			
			res = types.detectDataType(null);
			assert.strictEqual(res.type, 'null');
			
			res = types.detectDataType('100', false);
			assert.strictEqual(res.type, 'string');
			
			res = types.detectDataType('100');
			assert.strictEqual(res.type, 'number');
			
			res = types.detectDataType(new Date());
			assert.strictEqual(res.type, 'date');
			
		});
	});
});