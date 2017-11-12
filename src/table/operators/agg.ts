import { AnalyticsTable } from '../AnalyticsTable';

// Used in group-by operations
export module agg {
  export type Aggregation = (
    ((rows: any[], table: AnalyticsTable) => any) & { aggName?: string, name?: string }
  );

  export function sum(targetField: string, outputName?: string): Aggregation {
    let aggf: Aggregation = function(rows: any[], table: AnalyticsTable): number {
      // TODO: type-switch
      let total: number = 0;
      let c: number = table.getFieldIndex(targetField);
      for (let r: number = 0; r < rows.length; ++r) {
        total += rows[r][c];
      }
      return total;
    };

    // Set output name
    if (outputName) aggf.aggName = outputName;
    else aggf.aggName = 'SUM(' + targetField + ')';
    return aggf;
  }

  export function avg(targetField: string, outputName: string): Aggregation {
    let aggf: Aggregation = function(rows: any[], table: AnalyticsTable): number {
      // TODO: type-switch
      let total: number = 0;
      let c: number = table.getFieldIndex(targetField);
      for (let r: number = 0; r < rows.length; ++r) {
        total += rows[r][c];
      }
      return (total / rows.length);
    };

    // Set output name
    if (outputName) aggf.aggName = outputName;
    else aggf.aggName = 'AVG(' + targetField + ')';
    return aggf;
  }

  export function first(targetField: string, outputName: string): Aggregation {
    let aggf: Aggregation = function(rows: any[], table: AnalyticsTable): any {
      let c: number = table.getFieldIndex(targetField);
      return rows[0][c];
    };

    // Set output name
    if (outputName) aggf.aggName = outputName;
    else aggf.aggName = 'AVG(' + targetField + ')';
    return aggf;
  }
}
