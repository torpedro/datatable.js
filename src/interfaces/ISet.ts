
import { IArrayConvertible } from './IArrayConvertible';


// General interface that every set implementation has to offer.
// Resources:
//  * https://docs.python.org/2/library/sets.html#sets.Set
//  * https://docs.oracle.com/javase/7/docs/api/java/util/Set.html
export interface ISet extends IArrayConvertible {
  // Adds the an element to this set if it is not already present.
  add(val: any): void;

  // Removes all the elements from this set.
  clear(): void;

  // Returns true if this set contains the given element.
  contains(val: any): boolean;

  // Return the element at position `index`.
  // The ordering of the elements depends on the type of set.
  get(index: number): any;

  // Remove and return an arbitrary element from the set.
  pop(): any;

  // Removes the given element from this set if it is present.
  remove(val: any): void;

  // Returns the number of elements in this set.
  size(): number;

  // Returns an array containing the elements in this set.
  toArray(): any[];

  difference(other: ISet): ISet;

  intersection(other: ISet): ISet;

  isDisjoint(other: ISet): boolean;

  isEqual(other: ISet): boolean;

  isSubset(other: ISet): boolean;

  isSuperset(other: ISet): boolean;

  union(other: ISet): ISet;
}