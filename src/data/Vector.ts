
import { IVector } from '../interfaces/IVector';
import { ArrayOrConvertible } from '../interfaces/IArrayConvertible';
import { TypeEnvironment, TypeID, ITypeDetectionResult } from '../types/TypeEnvironment';
import { StandardTypeEnv } from '../types/StandardTypeEnv';

export class Vector implements IVector {
  private data: any[];
  private type: TypeID;
  private typeEnv: TypeEnvironment;

  constructor(type: TypeID = 'any', data?: ArrayOrConvertible, typeEnv?: TypeEnvironment) {
    this.type = type;
    this.data = [];
    this.typeEnv = typeEnv || StandardTypeEnv.getInstance();

    if (data instanceof Array) {
      this.data = data;
    } else if (data && data.toArray) {
      this.data = data.toArray();
    }
  }

  get(index: number): any {
    return this.data[index];
  }

  getType(): string {
    return this.type;
  }

  push(value: any): boolean {
    if (this.type === 'any') {
      this.data.push(value);
    } else {
      // Checking types...
      let parseStrings: boolean = this.type !== 'string';
      let res: ITypeDetectionResult = this.typeEnv.detectDataType(value, parseStrings);
      if (res.type === this.type) {
        this.data.push(res.value);
        return true;
      } else {
        return false;
      }
    }

    return true;
  }

  size(): number {
    return this.data.length;
  }

  toArray(): any[] {
    return this.data;
  }
}
