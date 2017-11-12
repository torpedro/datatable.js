/// <reference path='../dist/datatable.js.d.ts' />
import { Table } from 'datatable.js';

let table = new Table({
  fields: ['One'],
  types: ['number']
});

table.insert([[1]]);
