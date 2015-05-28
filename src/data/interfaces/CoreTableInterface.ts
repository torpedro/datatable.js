
type Row = Array<any>;

interface CoreTableInterface {
	
	addRow(record: Row): void;
	
	column(name: string): Array<any>;
	
	columns(): Array<Array<any>>;
	
	empty(): boolean;
	
	row(n: number): Row;
	
	rows(): Array<Row>;
	
	size(): number;
	
}