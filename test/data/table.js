

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
    })
  })
})
