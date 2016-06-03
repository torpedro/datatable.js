type Row = any[];
type Column = any[];

interface TableData {
	fields: string[];
	types: string[];
	rows: Array<Row>;
}

interface TableDefinition {
	fields: string[];
	types?: string[];
	columns?: any[][];
}

/**
 * General interface that every table has to offer
 * @interface ITable
 */
interface ITable {

	addField(fieldName: string): void;

	addRow(row: Row): void;

	column(fieldName: string): any[];

	columns(): any[][];

	fields(): string[];

	row(rowNumber: number): Row;

	rows(): Array<Row>;

	size(): number;

	type(fieldName: string): string;

	types(): string[];

	value(rowNumber: number, fieldName: string): any;

}