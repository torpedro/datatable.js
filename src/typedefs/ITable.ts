type Row = any[];
type Column = any[];

interface ITableData {
	fields: string[];
	types: string[];
	rows: Row[];
}

interface ITableDefinition {
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

	rows(): Row[];

	size(): number;

	type(fieldName: string): string;

	types(): string[];

	value(rowNumber: number, fieldName: string): any;

}