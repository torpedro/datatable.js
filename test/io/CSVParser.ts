import * as assert from 'assert';
import { CSVParser } from '../../src/io/CSVParser';
import { CoreColumnTable } from '../../src/table/CoreColumnTable';

describe('io.CSVParser', function () {
  it('parses string with header', function () {
    var parser = new CSVParser();

    var table = parser.parseString('A,B,C\n1,4,3\n2,1,3');
    assert.deepEqual(table.fields(), ['A', 'B', 'C']);
    assert.deepEqual(table.columns(), [[1, 2], [4, 1], [3, 3]]);
    assert.strictEqual(table.value(0, 'A'), 1);
  });

  it('parses string without header', function () {
    var parser = new CSVParser({
      header: false
    });

    var table = parser.parseString('1,4,3\n2,1,3');
    assert.deepEqual(table.fields(), ['Column 1', 'Column 2', 'Column 3']);
    assert.deepEqual(table.columns(), [[1, 2], [4, 1], [3, 3]]);
    assert.strictEqual(table.value(0, 'Column 1'), 1);
    assert.deepEqual(table.types(), ['number', 'number', 'number']);
  });

  it('dumps table to string', function () {
    var table = new CoreColumnTable({
      fields: ['ID', 'Name', 'Address']
    });
    table.insert([[0, 'Max', 'Berlin']]);
    table.insert([[1, 'Meier', 'Potsdam']]);

    var parser = new CSVParser({
      delimiter: ','
    });

    var csv = parser.dumpString(table);

    assert.strictEqual(csv, 'ID,Name,Address\n0,Max,Berlin\n1,Meier,Potsdam');
  });
});