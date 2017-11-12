import { CoreColumnTable } from './CoreColumnTable';

export type FieldFunction = (
  (row: (any[] & { get?: ((name: string) => any) }))
  => any
);
export type FieldArgument = (string|number|FieldDescriptor);

export class FieldDescriptor {
  isStatic: boolean;
  name: string;
  outputName: string;
  fn: FieldFunction;

  constructor(what: (string|FieldFunction), as?: string) {
    if (typeof what === 'string') {
      // Input is a static field selector
      this.isStatic = true;
      this.name = what;

      if (as) this.outputName = as;
      else this.outputName = what;
    } else {
      // Input is a function selector
      this.isStatic = false;
      this.fn = <FieldFunction>what;
      this.outputName = as;
    }
  }

  getValue(table: CoreColumnTable, rowNr: number): any {
    if (this.isStatic) return table.value(rowNr, this.name);
    else {
      let row: (any[] & { get?: ((name: string) => any) }) = table.row(rowNr);

      (<any>row).get = function(name: string): any {
        return table.value(rowNr, name);
      };

      let value: any = this.fn(row);
      return value;
    }
  }

  getValueFromRow(table: CoreColumnTable, row: (any[] & { get?: ((name: string) => any) })): any {
    if (this.isStatic) {
      let id: number = table.getFieldIndex(this.name);
      return row[id];

    } else {
      (<any>row).get = function(name: string): any {
        let id: number = table.getFieldIndex(name);
        return row[id];
      };

      let value: any = this.fn(row);
      return value;
    }
  }
}
