declare module 'datatable.js' {
  /////////////////////////////////////////
  // CoreColumnTable.d.ts
  interface ITableDefinition {
    fields: string[];
    types?: string[];
    columns?: Column[];
  }
  type Value = (string | number | boolean | Function | Object);
  type Row = Value[];
  type Column = Value[];
  type FieldID = (string | number);
  class CoreColumnTable {
    constructor(definition: ITableDefinition);
    insert(rows: Row[]): void;
    count(): number;
    addField(name: string, type?: string): void;
    fields(): string[];
    numFields(): number;
    hasField(field: FieldID): boolean;
    types(): string[];
    type(field: FieldID): string;
    isEmpty(): boolean;
    rows(): Row[];
    row(r: number): Row;
    getFieldIndex(field: FieldID): number;
    value(row: number, field: FieldID): any;
    setValue(row: number, field: FieldID, value: any): void;
    reserve(numRows: number): void;
    column(field: FieldID): any[];
    columns(): any[][];
    detectTypes(setTypes: boolean): string[];
    setType(field: FieldID, type: string): void;
  }
  // CoreColumnTable.d.ts
  /////////////////////////////////////////
  /////////////////////////////////////////
  // AnalyticsTable.d.ts
  class AnalyticsTable extends CoreColumnTable {
    agg: any;
    // groupBy(column: string | FieldDescriptor, aggregations?: aggs.Aggregation[]): AnalyticsTable;
    // groupBy(columns: (string | FieldDescriptor)[], aggregations?: aggs.Aggregation[]): AnalyticsTable;
    filter(predicate: Function): AnalyticsTable;
    // distinctValues(field: string): OrderedSet;
    select(field: string): AnalyticsTable;
    select(field: FieldDescriptor): AnalyticsTable;
    select(fields: (string | FieldDescriptor)[]): AnalyticsTable;
    splitColumn(field: string, groupField: string): AnalyticsTable;
    sort(_field: string | FieldDescriptor, asc?: boolean): AnalyticsTable;
  }
  // CoreColumnTable.d.ts
  /////////////////////////////////////////
  /////////////////////////////////////////
  // FieldDescriptor.d.ts
  type FieldFunction = ((row: (any[] & {
    get?: ((name: string) => any);
  })) => any);
  type FieldArgument = (string | number | FieldDescriptor);
  class FieldDescriptor {
    isStatic: boolean;
    name: string;
    outputName: string;
    fn: FieldFunction;
    constructor(what: (string | FieldFunction), as?: string);
    getValue(table: CoreColumnTable, rowNr: number): any;
    getValueFromRow(table: CoreColumnTable, row: (any[] & {
      get?: ((name: string) => any);
    })): any;
  }
  // FieldDescriptor.d.ts
  /////////////////////////////////////////

  export class Table extends AnalyticsTable {}
}
