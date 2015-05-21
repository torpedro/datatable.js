/**
 * @interface SetInterface
 */
interface SetInterface {
	_isSet_: boolean;
	
	add(val: any): void;
	
	clear(): void;
	
	contains(val: any): boolean;
	
	difference(other: SetInterface): SetInterface;
	
	intersection(other: SetInterface): SetInterface;
	
	isDisjoint(other: SetInterface): boolean;
	
	isEqual(other: SetInterface): boolean;

	isSubset(other: SetInterface): boolean;
	
	isSuperset(other: SetInterface): boolean;

	get(): Array<any>;
	
	get(index: number): any;
	
	pop(): any;
	
	remove(val: any): void;
	
	size(): number;
	
	union(other: SetInterface): SetInterface;
	
}