/// <reference path="../typings/tsd.d.ts" />
import assert = require("assert")
import CoreColumnTable = require('../../src/data/CoreColumnTable');

describe('data.CoreColumnTable', function() {
    
    it('should be defined empty', function() {
        var table = new CoreColumnTable({
            fields: ['ID']
        });
        assert.equal(table.size(), 0);
        assert(table.empty());
    });
    
    
    it('should catch errors', function() {
        assert.throws(function() {
            new (<any> CoreColumnTable)("a"); // Should throw an exception
        });
        assert.throws(function() {
            new CoreColumnTable({fields: []}); // Should throw an exception
        });
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
});
