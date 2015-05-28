/// <reference path="../typings/tsd.d.ts" />
import assert = require("assert");
import AnalyticsTable = require('../../src/data/AnalyticsTable');
import CoreColumnTable = require('../../src/data/CoreColumnTable');


describe('data.AnalyticsTable', function() {
    it('filter', function() {
		var table = new AnalyticsTable({
			fields: ['ID', 'First Name', 'Last Name']
		});
        
		table.addRow([1, 'Max', 'Mustermann']);
		table.addRow([2, 'John', 'Doe']);
		
		var result = table.filter(function(row) { return row[0] < 2	});
		assert.deepEqual(result.rows(), [[1, 'Max', 'Mustermann']]);
    });
	
	
    it('can be created from CoreColumnTable', function() {
		var table = new CoreColumnTable({
			fields: ['ID', 'First Name', 'Last Name']
		});
        
		table.addRow([1, 'Max', 'Mustermann']);
		table.addRow([2, 'John', 'Doe']);
		
		var anaTable = new AnalyticsTable(table);
		
		var resultTable = anaTable.filter(function(row) { return row[0] < 2	});
		assert.deepEqual(resultTable.rows(), [[1, 'Max', 'Mustermann']]);
    });
	
	
    it('group by', function() {
		var table = new AnalyticsTable({
			fields: ['Category', 'Score1', 'Score2']
		});
        
		table.addRow([1, 100, 1000]);
		table.addRow([1, 100, 2000]);
		table.addRow([1, 200, 3000]);
		table.addRow([2, 103, 4000]);
		
		var res1 = table.groupBy(['Category', 'Score1'], []);
		assert.deepEqual(res1.rows(), [[1, 100], [1, 200], [2, 103]]);
		
		var res2 = table.groupBy(['Category'], [
			function SumScore1(rows) {
				var sum = 0;
				for (var i = 0; i < rows.length; ++i) {
					sum += rows[i][1];
				}
				return sum;
			}
		]);
		assert.deepEqual(res2.rows(), [[1, 400], [2, 103]])
		assert.deepEqual(res2.fields(), ['Category', 'SumScore1'])
    });
	
	it('distinctValues', function() {
		var table = new AnalyticsTable({
			fields: ['Category', 'Score1', 'Score2']
		});
		table.addRow([1, 100, 1000]);
		table.addRow([1, 100, 2000]);
		table.addRow([1, 200, 3000]);
		table.addRow([2, 103, 4000]);
		
		assert.deepEqual(table.distinctValues('Category').get(), [1, 2]);
		assert.deepEqual(table.distinctValues('Score1').get(), [100, 103, 200]);
	});
	
	it('explodeColumn', function() {
		// 1st test
		var table = new AnalyticsTable({
			fields: ['TimeID', 'Category', 'Score'],
			columns: [
				[1, 1, 2, 2, 3],
				[1, 2, 1, 2, 2],
				[1, 5, 2, 3, 3]
			]
		});
		
		var result = table.explodeColumn('Category', 'TimeID');
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
		
		result = table.explodeColumn('Category', 'TimeID');
		assert.deepEqual(result.fields(), ['TimeID', 'Score1 (1)', 'Score2 (1)', 'Score1 (2)', 'Score2 (2)']);
		assert.deepEqual(result.rows(), [
			[1, 1, 6, 5, 5],
			[2, 2, 4, 3, 2],
			[3, null, null, 3, 3]
		]);
	});
	
	it('select', function() {
		var table = new AnalyticsTable({
			fields: ['TimeID', 'Category', 'Score'],
			columns: [
				[1, 1, 2, 2, 3],
				[1, 2, 1, 2, 2],
				[1, 5, 2, 3, 3]
			]
		});
		
		assert.deepEqual(table.select('TimeID', 'Category', 'Score').rows(), table.rows());
		assert.deepEqual(table.select('Category', 'TimeID').columns(), [
			[1, 2, 1, 2, 2],
			[1, 1, 2, 2, 3]
		]);
		
		var other = table.select({what: 'TimeID', as: 'OtherName'}, 'Category', 'Score');
		assert.deepEqual(other.rows(), table.rows());
		assert.deepEqual(other.fields(), ['OtherName', 'Category', 'Score']);
	});
	
	it('select function', function() {
		var table = new AnalyticsTable({
			fields: ['TimeID', 'Category', 'Score'],
			columns: [
				[1, 1, 2, 2, 3],
				[1, 2, 1, 2, 2],
				[1, 5, 2, 3, 3]
			]
		});
		
		var double = table.select('Score', {
			what: function(row) {
				return row.get('Score') * 2
			},
			as: 'DoubleScore'
		});
		
		assert.deepEqual(double.columns(), [
			[1,  5, 2, 3, 3],
			[2, 10, 4, 6, 6]
		])
	});
	
	it('select system columns', function() {
		var table = new AnalyticsTable({
			fields: ['TimeID', 'Category', 'Score'],
			columns: [
				[1, 1, 2, 2, 3],
				[1, 2, 1, 2, 2],
				[1, 5, 2, 3, 3]
			]
		});
		
		assert.deepEqual(table.select('$rownr', 'TimeID').columns(), [
			[0, 1, 2, 3, 4],
			[1, 1, 2, 2, 3]
		]);
	});
});


describe('data.agg', function() {
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