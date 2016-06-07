/// <reference path="../typings/tsd.d.ts" />
import assert = require("assert");
import { CoreColumnTable } from '../../src/table/CoreColumnTable';

describe('table.CoreColumnTable', function() {
    it('should be defined empty', function() {
        var table = new CoreColumnTable({
            fields: ['ID']
        });
        assert.equal(table.size(), 0);
        assert(table.empty());
    });


    it('should catch errors', function() {
        console.log("A");
        assert.throws(function() {
            new (<any> CoreColumnTable)("a"); // Should throw an exception
        });
        console.log("A");
        assert.throws(function() {
            new CoreColumnTable({fields: []}); // Should throw an exception
        });
        console.log("A");

        // Type errors
        assert.throws(function() {
            var t = new CoreColumnTable({
                fields: ['A', 'B'],
                types: ['number', 'boolean']
            });
            t.addRow(['abc', false]);
        });
        console.log("A");
    });


    it('should be created statically', function() {
        var header = ['ID', 'Name', 'Address'];

        var table = new CoreColumnTable({
            fields: header
        });
        table.addRow([0, 'Max', null]);
        table.addRow([1,  null, null]);

        assert.deepEqual(table.rows(), [[0, 'Max', null], [1, null, null]]);
        assert.deepEqual(table.column('Name'), ['Max', null])
    });


    it('should be created dynamically', function() {
        var table = new CoreColumnTable({
            fields: ['ID']
        });
        table.addField('Name');

        assert.deepEqual(table.fields(), ['ID', 'Name']);
        assert.deepEqual(table.rows(), []);

        table.addRow([0, 'Max']);
        table.addRow([1]);

        assert.deepEqual(table.rows(), [[0, 'Max'], [1, null]]);

        table.addField('Address');
        assert.deepEqual(table.rows(), [[0, 'Max', null], [1, null, null]]);
    });


    it('should have copy constructor', function() {
        var header = ['ID', 'Name', 'Address'];

        var table = new CoreColumnTable({
            fields: ['ID', 'Name', 'Address'],
            columns: [[1,2], ['Max', 'John'], ['Germany', 'UK']]
        });
        assert.deepEqual(table.rows(), [[1, 'Max', 'Germany'], [2, 'John', 'UK']]);

        var copy = new CoreColumnTable(table);
        assert.deepEqual(copy.rows(), [[1, 'Max', 'Germany'], [2, 'John', 'UK']]);

        // Check that the vectors are not linked
        table.addRow(['3', 'Peter', 'France']);

        assert.deepEqual(table.rows(), [[1, 'Max', 'Germany'], [2, 'John', 'UK'], ['3', 'Peter', 'France']]);
        assert.deepEqual(copy.rows(), [[1, 'Max', 'Germany'], [2, 'John', 'UK']]);
    });


    it('should convert types', function() {
        var t = new CoreColumnTable({
            fields: ['A', 'B'],
            types: ['number', 'boolean']
        });
        t.addRow(['1', 'false']);

        assert.strictEqual(t.value(0, 'A'), 1);
        assert.strictEqual(t.value(0, 'B'), false);

        t.addRow(['', 'true']);
        assert.strictEqual(t.value(1, 'A'), null);
        assert.strictEqual(t.value(1, 'B'), true);

        t.addRow(['23.5', null]);
        assert.strictEqual(t.value(2, 'A'), 23.5);
        assert.strictEqual(t.value(2, 'B'), null);
    });
});
