import * as assert from 'assert';
import { agg } from '../../src/table/operators/agg';
import { AnalyticsTable } from '../../src/table/AnalyticsTable';
import { FieldDescriptor } from '../../src/table/FieldDescriptor';
import { CoreColumnTable } from '../../src/table/CoreColumnTable';


describe('table.AnalyticsTable', function () {
  var table1 = new AnalyticsTable({
    fields: ['Category', 'Score1', 'Score2']
  });

  table1.insert([
    [1, 10, 100],
    [1, 50, 300],
    [2, 30, 200],
    [3, 40, 400],
    [1, 20, 500]
  ]);

  it('filter', function () {
    var table = new AnalyticsTable({
      fields: ['ID', 'First Name', 'Last Name']
    });

    table.insert([[1, 'Max', 'Mustermann']]);
    table.insert([[2, 'John', 'Doe']]);

    var result = table.filter(function (row: any[]) { return row[0] < 2; });
    assert.deepEqual(result.rows(), [[1, 'Max', 'Mustermann']]);
  });


  it('can be created from CoreColumnTable', function () {
    var table = new CoreColumnTable({
      fields: ['ID', 'First Name', 'Last Name']
    });

    table.insert([[1, 'Max', 'Mustermann']]);
    table.insert([[2, 'John', 'Doe']]);

    var anaTable = new AnalyticsTable(table);

    var resultTable = anaTable.filter(function (row: any[]) { return row[0] < 2; });
    assert.deepEqual(resultTable.rows(), [[1, 'Max', 'Mustermann']]);
  });


  it('group by', function () {

    var res1 = table1.groupBy(['Category', 'Score1'], []);
    assert.deepEqual(res1.rows(), [[1, 10], [1, 50], [2, 30], [3, 40], [1, 20]]);

    // Custom Function
    // For the predefined aggregation function see the tests of agg-module below
    var res2 = table1.groupBy(['Category'], [
      function SumScore1(rows: any[][]) {
        var sum = 0;
        for (var i = 0; i < rows.length; ++i) {
          sum += rows[i][1];
        }
        return sum;
      }
    ]);
    assert.deepEqual(res2.rows(), [[1, 80], [2, 30], [3, 40]]);
    assert.deepEqual(res2.fields(), ['Category', 'SumScore1']);
  });

  it('group by function', function () {
    var res1 = table1.groupBy([new FieldDescriptor(
      function (row: any) {
        return Math.round(row.get('Category') / 2);
      },
      'HalfCategories')]);

    assert.deepEqual(res1.rows(), [[1], [2]]);
  });

  it('distinctValues', function () {
    assert.deepEqual(table1.distinctValues('Category').toArray(), [1, 2, 3]);
    assert.deepEqual(table1.distinctValues('Score1').toArray(), [10, 20, 30, 40, 50]);
  });

  it('explodeColumn', function () {
    // 1st test
    var table = new AnalyticsTable({
      fields: ['TimeID', 'Category', 'Score'],
      columns: [
        [1, 1, 2, 2, 3],
        [1, 2, 1, 2, 2],
        [1, 5, 2, 3, 3]
      ]
    });

    var result = table.splitColumn('Category', 'TimeID');
    assert.deepEqual(result.fields(), ['TimeID', 'Score (1)', 'Score (2)']);
    assert.deepEqual(result.rows(), [
      [1, 1, 5],
      [2, 2, 3],
      [3, null, 3]
    ]);

    // 2nd test
    table = new AnalyticsTable({
      fields: ['TimeID', 'Category', 'Score1', 'Score2'],
      columns: [
        [1, 1, 2, 2, 3],
        [1, 2, 1, 2, 2],
        [1, 5, 2, 3, 3],
        [6, 5, 4, 2, 3]
      ]
    });

    result = table.splitColumn('Category', 'TimeID');
    assert.deepEqual(result.fields(), ['TimeID', 'Score1 (1)', 'Score2 (1)', 'Score1 (2)', 'Score2 (2)']);
    assert.deepEqual(result.rows(), [
      [1, 1, 6, 5, 5],
      [2, 2, 4, 3, 2],
      [3, null, null, 3, 3]
    ]);
  });

  it('select', function () {
    var table = new AnalyticsTable({
      fields: ['TimeID', 'Category', 'Score'],
      columns: [
        [1, 1, 2, 2, 3],
        [1, 2, 1, 2, 2],
        [1, 5, 2, 3, 3]
      ]
    });

    assert.deepEqual(table.select(['TimeID', 'Category', 'Score']).rows(), table.rows());
    assert.deepEqual(table.select(['Category', 'TimeID']).columns(), [
      [1, 2, 1, 2, 2],
      [1, 1, 2, 2, 3]
    ]);

    var other = table.select([new FieldDescriptor('TimeID', 'OtherName'), 'Category', 'Score']);
    assert.deepEqual(other.rows(), table.rows());
    assert.deepEqual(other.fields(), ['OtherName', 'Category', 'Score']);
  });

  it('select function', function () {
    var table = new AnalyticsTable({
      fields: ['TimeID', 'Category', 'Score'],
      columns: [
        [1, 1, 2, 2, 3],
        [1, 2, 1, 2, 2],
        [1, 5, 2, 3, 3]
      ]
    });

    var double = table.select(['Score', new FieldDescriptor(
      function (row: any) {
        return row.get('Score') * 2;
      },
      'DoubleScore'
    )]);

    assert.deepEqual(double.columns(), [
      [1, 5, 2, 3, 3],
      [2, 10, 4, 6, 6]
    ]);
  });

  it('select system columns', function () {
    var table = new AnalyticsTable({
      fields: ['TimeID', 'Category', 'Score'],
      columns: [
        [1, 1, 2, 2, 3],
        [1, 2, 1, 2, 2],
        [1, 5, 2, 3, 3]
      ]
    });

    assert.deepEqual(table.select(['$rownr', 'TimeID']).columns(), [
      [0, 1, 2, 3, 4],
      [1, 1, 2, 2, 3]
    ]);
  });

  it('sort', function () {
    var res1 = table1.sort(new FieldDescriptor('Score1'), true);
    assert.deepEqual(res1.rows(), [
      [1, 10, 100],
      [1, 20, 500],
      [2, 30, 200],
      [3, 40, 400],
      [1, 50, 300]
    ]);
  });

  it('sort and groupby', function () {
    var res = table1
      .groupBy(['Category'], [agg.avg('Score2', 'AVG Score2')])
      .sort('AVG Score2', true);

    assert.deepEqual(res.rows(), [
      [2, 200],
      [1, 300],
      [3, 400]
    ]);
  });
});