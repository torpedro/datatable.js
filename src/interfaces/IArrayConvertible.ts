
/**
 * Classes that can be converted to arrays,
 * should implement toArray(): any[]
 */
export interface IArrayConvertible {
	/**
	 * Returns an array containing the elements in this set.
	 */
	toArray(): any[];
}

export type ArrayOrConvertible = (any[] | IArrayConvertible)