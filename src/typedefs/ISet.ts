/**
 * General interface that every set implementation has to offer
 * @interface ISet
 */
interface ISet {
	_isSet_: boolean;

	add(val: any): void;

	clear(): void;

	contains(val: any): boolean;

	difference(other: ISet): ISet;

	intersection(other: ISet): ISet;

	isDisjoint(other: ISet): boolean;

	isEqual(other: ISet): boolean;

	isSubset(other: ISet): boolean;

	isSuperset(other: ISet): boolean;

	get(): Array<any>;

	get(index: number): any;

	pop(): any;

	remove(val: any): void;

	size(): number;

	union(other: ISet): ISet;

}