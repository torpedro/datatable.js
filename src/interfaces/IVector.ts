
import { IArrayConvertible } from './IArrayConvertible';

// General interface that every vector implementation has to offer.
// Interface is supposed to be close to JavaScript's Array.
// Resources:
//  * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
//  * http://www.cplusplus.com/reference/vector/vector/
export interface IVector extends IArrayConvertible {
  // Returns the element at the given position.
  get(index: number): any;

  // Adds an element to the end of the vector.
  push(value: any): void;

  // Returns the size of the vector.
  size(): number;

  // Returns an array containing the elements in this set.
  toArray(): any[];
}