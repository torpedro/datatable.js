

var assert = require("assert")
var Table = require('../../src/data/Table');

describe('Table', function() {
    
    it('should be defined empty', function() {
      
        var table = new Table();
        assert.equal(table.size(), 0);
        assert(table.empty());
      
    });
    
    
    it('should catch errors', function() {
        assert.throws(function() {
            new Table("a");
        });
    });
    
    
    it('should be created statically', function() {
        var rows = [
             [0, 'Max', null],
             [1,  null, null]
        ];
        var header = ['ID', 'Name', 'Address'];
        
        var table = new Table(rows, header);
        
        assert.deepEqual(table.rows(), [[0, 'Max', null], [1, null, null]]);
    });
    
    
    it('should be created dynamically', function() {
        var table = new Table();
        table.addField('ID');
        table.addField('Name');
        
        assert.deepEqual(table.header(), ['ID', 'Name']);
        assert.deepEqual(table.rows(), []);
        
        table.addRow([0, 'Max']);
        table.addRow([1]);
        
        assert.deepEqual(table.rows(), [[0, 'Max'], [1, null]]);
        
        table.addField('Address');
        assert.deepEqual(table.rows(), [[0, 'Max', null], [1, null, null]]);
    });
    
});
