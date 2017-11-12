import * as _ from 'underscore';

import { ITypeDetectionResult } from '../types/TypeEnvironment';
import { StandardTypeEnv as TypeEnv } from '../types/StandardTypeEnv';

export module vec {
  export function range(vector: any[], dataType?: string): [any, any] {
    let size: number = vector.length;
    if (size === 0) return null;

    let interval: [any, any] = [vector[0], vector[0]];
    for (let n: number = 1; n < size; ++n) {
      let value: any = vector[n];

      // TODO: Handle different datatypes
      if (value < interval[0]) interval[0] = value;
      if (value > interval[1]) interval[1] = value;
    }

    return interval;
  }

  export function min(vector: any[]): any { return range(vector)[0]; }
  export function max(vector: any[]): any { return range(vector)[1]; }

  export function detectDataType(vector: any[], parseStrings: boolean = true, convertTypes: boolean = false): string  {
    let env: TypeEnv = TypeEnv.getInstance();

    let typeset: string[] = [];
    for (let i: number = 0; i < vector.length; ++i) {
      let value: any = vector[i];


      let res: ITypeDetectionResult = env.detectDataType(value, parseStrings);

      // Ignore nulls, they have no type
      if (res.type === 'null') continue;

      // Add to the typeset
      if (typeset.indexOf(res.type) === -1) typeset.push(res.type);
      if (convertTypes) vector[i] = res.value;
    }


    if (typeset.length === 0) return TypeEnv.kNull;
    if (typeset.length === 1) return typeset[0];
    else return 'any';
    // TODO: roll-up the types
  }

  export function convertToType(vector: any[], targetType: string): any[] {
    let newVec: any[] = _.map(vector, function(value: any, i: number): any {
      return TypeEnv.getInstance().convert(value, targetType).result;
    });
    return newVec;
  }

  // This is not types safe
  export function groupByPositions(vector: any[]): {} {
    let map: {} = {};
    for (let i: number = 0; i < vector.length; ++i) {
      let value: any = vector[i];
      if (value in map) {
        map[value].push(i);
      } else {
        map[value] = [i];
      }
    }
    return map;
  }

  // List all distinct values within the array
  export function distinctValues(vector: any[]): any[] {
    let values: any[] = [];
    for (let i: number = 0; i < vector.length; ++i) {
      if (values.indexOf(vector[i]) === -1) {
        values.push(vector[i]);
      }
    }
    return values;
  }
}
