type Row = Array<any>;
type Column = Array<any>;

interface TableData {
	fields: Array<string>,
	types: Array<string>,
	rows: Array<Row>
}

interface TableDefinition {
	fields: Array<string>,
	types?: Array<string>,
	columns?: Array<Array<any>>
}

/**
 * General interface that every table has to offer
 * @interface ITable
 */
interface ITable {

//	constructor(def: TableDefinition);

	addField(fieldName: string): void;

	addRow(row: Row): void;

	column(fieldName: string): Array<any>;

	columns(): Array<Array<any>>;

//	data(): TableData;

	fields(): Array<string>;

	row(rowNumber: number): Row;

	rows(): Array<Row>;

	size(): number;

	type(fieldName: string): string;

	types(): Array<string>;

	value(rowNumber: number, fieldName: string): any;

}