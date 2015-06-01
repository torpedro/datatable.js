/// <reference path="../../typings/tsd.d.ts" />
import assert = require("assert");
import agg = require('../../../src/table/operators/agg');
import AnalyticsTable = require('../../../src/table/AnalyticsTable');

describe('table.operators.agg', function() {
	var fields = ['Category', 'Person', 'Score'];
	var data = [
		[1, 'Max',  100],
		[1, 'Paul', 200],
		[2, 'John', 200],
		[2, 'Jeff', 300]
	]
	var table = new AnalyticsTable({
		fields: fields
	});
	table.addRows(data);
	
	
	describe('number', function() {
		it('sum', function() {
			var aggs = [table.agg.sum('Score', 'SUM(Score)')];
			var res = table.groupBy(['Category'], aggs);
			assert.deepEqual(res.rows(), [[1, 300], [2, 500]]);
			assert.deepEqual(res.fields(), ['Category', 'SUM(Score)']);
		});
		
		it('avg', function() {
			var aggs = [table.agg.avg('Score', 'AVG(Score)')];
			var res = table.groupBy('Category', aggs);
			assert.deepEqual(res.rows(), [[1, 150], [2, 250]]);
			assert.deepEqual(res.fields(), ['Category', 'AVG(Score)']);
		});
	});
});