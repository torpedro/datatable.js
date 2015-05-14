
type Row = Array<any>;

interface CoreTableInterface {
	
	size(): number;
	
	empty(): boolean;
	
	row(n: number): Row;
	
	rows(): Array<Row>;
	
	column(c: number): Array<any>;
	
	columns(): Array<Array<any>>;
	
	addRow(record: Row): void;
	
	
}