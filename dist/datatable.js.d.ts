
declare module 'datatable.js' {
    // IArrayConvertible.ts
    interface IArrayConvertible {
        toArray(): any[];
    }
    type ArrayOrConvertible = (any[] | IArrayConvertible);

    // ISet.ts
    interface ISet extends IArrayConvertible {
        add(val: any): void;
        clear(): void;
        contains(val: any): boolean;
        get(index: number): any;
        pop(): any;
        remove(val: any): void;
        size(): number;
        toArray(): any[];
        difference(other: ISet): ISet;
        intersection(other: ISet): ISet;
        isDisjoint(other: ISet): boolean;
        isEqual(other: ISet): boolean;
        isSubset(other: ISet): boolean;
        isSuperset(other: ISet): boolean;
        union(other: ISet): ISet;
    }

    // Set.ts
    interface Set extends ISet {
        new(data?: ArrayOrConvertible);
        add(val: any): void;
        clear(): void;
        contains(val: any): boolean;
        difference(other: ISet): Set;
        toArray(): any[];
        get(index: number): any;
        indexOf(val: any): number;
        intersection(other: ISet): Set;
        isDisjoint(other: ISet): boolean;
        isEqual(other: ISet): boolean;
        isSubset(other: ISet): boolean;
        isSuperset(other: ISet): boolean;
        pop(): any;
        remove(val: any): void;
        size(): number;
        union(other: ISet): Set;
    }


    // FieldDescriptor.ts
    type FieldFunction = ((row: (any[] & {
        get?: ((name: string) => any);
    })) => any);
    type FieldArgument = (string | number | FieldDescriptor);
    interface FieldDescriptor {
        isStatic: boolean;
        name: string;
        outputName: string;
        fn: FieldFunction;
        constructor(what: (string | FieldFunction), as?: string);
        getValue(table: Table, rowNr: number): any;
        getValueFromRow(table: Table, row: (any[] & {
            get?: ((name: string) => any);
        })): any;
    }

    // Table (CoreColumnTable.ts & AnalyticsTable.ts)
    interface ITableDefinition {
        fields: string[];
        types?: string[];
        columns?: Column[];
    }
    type Value = (string | number | boolean | Function | Object);
    type Row = Value[];
    type Column = Value[];
    type FieldID = (string | number);
    export class Table {
        // CoreColumnTable.ts
        constructor(def: ITableDefinition);

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

        // AnalyticsTable.ts
        // groupBy(column: string | FieldDescriptor, aggregations?: aggs.Aggregation[]): Table;
        // groupBy(columns: (string | FieldDescriptor)[], aggregations?: aggs.Aggregation[]): Table;
        filter(predicate: Function): Table;
        distinctValues(field: string): Set;
        select(field: string): Table;
        select(field: FieldDescriptor): Table;
        select(fields: (string | FieldDescriptor)[]): Table;
        splitColumn(field: string, groupField: string): Table;
        sort(_field: string | FieldDescriptor, asc?: boolean): Table;
    }


}
