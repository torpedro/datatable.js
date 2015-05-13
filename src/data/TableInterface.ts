
type Row = Array<any>;

interface TableInterface {
	
	size() : number;
	
	empty() : boolean;
	
	row(n : number) : Row;
	
	rows() : Array<Row>;
	
	addRow(record : Row) : void;
	
}