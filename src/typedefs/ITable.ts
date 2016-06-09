
type Value = (string|number|boolean|Function|Object);
type Row = Value[];
type Column = Value[];

interface ITableDefinition {
	fields: string[];
	types?: string[];
	columns?: Column[];
}

/**
 * @interface ITable
 * General interface that every table has to offer
 */
interface ITable {

	insert(rows: Row[]): void;

	count(): number;

	addField(fieldName: string): void;

	column(fieldName: string): Column;

	columns(): Column[];

	fields(): string[];

	row(rowNumber: number): Row;

	rows(): Row[];

	type(fieldName: string): string;

	types(): string[];

	value(rowNumber: number, fieldName: string): Value;

}