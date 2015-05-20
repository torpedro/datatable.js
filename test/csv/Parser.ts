/// <reference path="../typings/tsd.d.ts" />
import assert = require("assert");
import Parser = require('../../src/csv/Parser');

describe('csv', function() {
    describe('Parser', function () {
        it('parses string with header', function() {
			var parser = new Parser();
			
			var table = parser.parseString("A,B,C\n1,4,3\n2,1,3");
			assert.deepEqual(table.fields(), ['A', 'B', 'C']);
			assert.deepEqual(table.columns(), [[1,2],[4,1],[3,3]]);
			assert.strictEqual(table.getValue(0, 0), 1);
        });
		
        it('parses string without header', function() {
			var parser = new Parser({
				header: false
			});
			
			var table = parser.parseString("1,4,3\n2,1,3");
			assert.deepEqual(table.fields(), ['Column 1', 'Column 2', 'Column 3']);
			assert.deepEqual(table.columns(), [[1,2],[4,1],[3,3]]);
			assert.strictEqual(table.getValue(0, 0), 1);
        });
    });
});