import * as assert from 'assert';
import { agg } from '../../../src/table/operators/agg';
import { AnalyticsTable } from '../../../src/table/AnalyticsTable';

describe('table.operators.agg', function () {
  let fields: string[] = ['Category', 'Person', 'Score'];
  let data: any[][] = [
    [1, 'Max', 100],
    [1, 'Paul', 200],
    [2, 'John', 200],
    [2, 'Jeff', 300]
  ];
  let table: AnalyticsTable = new AnalyticsTable({
    fields: fields
  });
  table.insert(data);


  describe('number', function () {
    it('sum', function () {
      let aggs = [table.agg.sum('Score', 'SUM(Score)')];
      let res = table.groupBy(['Category'], aggs);
      assert.deepEqual(res.rows(), [[1, 300], [2, 500]]);
      assert.deepEqual(res.fields(), ['Category', 'SUM(Score)']);
    });

    it('avg', function () {
      let aggs: agg.Aggregation[] = [table.agg.avg('Score', 'AVG(Score)')];
      let res: AnalyticsTable = table.groupBy('Category', aggs);

      assert.deepEqual(res.rows(), [[1, 150], [2, 250]]);
      assert.deepEqual(res.fields(), ['Category', 'AVG(Score)']);
    });
  });
});