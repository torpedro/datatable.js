import * as assert from 'assert';
import { CoreColumnTable } from '../../src/table/CoreColumnTable';

describe('table.CoreColumnTable', function () {
  it('should be defined empty', function () {
    var table = new CoreColumnTable({
      fields: ['ID']
    });
    assert.equal(table.count(), 0);
    assert(table.isEmpty());
  });


  it('should catch errors', function () {
    function throwError() {
      return new (<any>CoreColumnTable)('a'); // Should throw an exception
    }
    assert.throws(throwError);

    // Type errors
    assert.throws(function () {
      var t = new CoreColumnTable({
        fields: ['A', 'B'],
        types: ['number', 'boolean']
      });
      t.insert([['abc', false]]);
    });
  });


  it('should be created statically', function () {
    var header = ['ID', 'Name', 'Address'];

    var table = new CoreColumnTable({
      fields: header
    });
    table.insert([[0, 'Max', null]]);
    table.insert([[1, null, null]]);

    assert.deepEqual(table.rows(), [[0, 'Max', null], [1, null, null]]);
    assert.deepEqual(table.column('Name'), ['Max', null]);
  });


  it('should be created dynamically', function () {
    var table = new CoreColumnTable({
      fields: ['ID']
    });
    table.addField('Name');

    assert.deepEqual(table.fields(), ['ID', 'Name']);
    assert.deepEqual(table.rows(), []);

    table.insert([[0, 'Max']]);
    table.insert([[1]]);

    assert.deepEqual(table.rows(), [[0, 'Max'], [1, null]]);

    table.addField('Address');
    assert.deepEqual(table.rows(), [[0, 'Max', null], [1, null, null]]);
  });


  it('should have copy constructor', function () {
    const fields = ['ID', 'Name', 'Address'];
    const columns = [[1, 2], ['Max', 'John'], ['Germany', 'UK']];
    let table = new CoreColumnTable({ fields, columns });

    assert.deepEqual(table.rows(), [[1, 'Max', 'Germany'], [2, 'John', 'UK']]);

    let copy = new CoreColumnTable(table);
    assert.deepEqual(copy.rows(), [[1, 'Max', 'Germany'], [2, 'John', 'UK']]);

    // Check that the vectors are not linked
    table.insert([['3', 'Peter', 'France']]);

    assert.deepEqual(table.rows(), [[1, 'Max', 'Germany'], [2, 'John', 'UK'], ['3', 'Peter', 'France']]);
    assert.deepEqual(copy.rows(), [[1, 'Max', 'Germany'], [2, 'John', 'UK']]);
  });


  it('should convert types', function () {
    var t = new CoreColumnTable({
      fields: ['A', 'B'],
      types: ['number', 'boolean']
    });
    t.insert([['1', 'false']]);

    assert.strictEqual(t.value(0, 'A'), 1);
    assert.strictEqual(t.value(0, 'B'), false);

    t.insert([['', 'true']]);
    assert.strictEqual(t.value(1, 'A'), null);
    assert.strictEqual(t.value(1, 'B'), true);

    t.insert([['23.5', null]]);
    assert.strictEqual(t.value(2, 'A'), 23.5);
    assert.strictEqual(t.value(2, 'B'), null);
  });

  it('should be able to insert null values', function () {
    let table = new CoreColumnTable({
      fields: ['A', 'B', 'C', 'D', 'E'],
      types: ['boolean', 'number', 'date', 'string', 'any']
    });
    table.insert([[null, null, null, null, null]]);
    assert.deepEqual(table.rows(), [[null, null, null, null, null]]);
  });
});
