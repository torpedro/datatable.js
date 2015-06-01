/// <reference path="../typings/tsd.d.ts" />
import assert = require("assert");
import CSVParser = require('../../src/io/CSVParser');

describe('io.Parser', function () {
    it('parses string with header', function() {
		var parser = new CSVParser();
		
		var table = parser.parseString("A,B,C\n1,4,3\n2,1,3");
		assert.deepEqual(table.fields(), ['A', 'B', 'C']);
		assert.deepEqual(table.columns(), [[1,2],[4,1],[3,3]]);
		assert.strictEqual(table.value(0, 'A'), 1);
    });
	
    it('parses string without header', function() {
		var parser = new CSVParser({
			header: false
		});
		
		var table = parser.parseString("1,4,3\n2,1,3");
		assert.deepEqual(table.fields(), ['Column 1', 'Column 2', 'Column 3']);
		assert.deepEqual(table.columns(), [[1,2],[4,1],[3,3]]);
		assert.strictEqual(table.value(0, 'Column 1'), 1);
    });
});