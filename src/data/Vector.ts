
import { TypeEnvironment, TypeID, ITypeDetectionResult } from '../types/TypeEnvironment';
import { StandardTypeEnv } from '../types/StandardTypeEnv';

export class Vector {
	private data: any[];
	private type: TypeID;
	private typeEnv: TypeEnvironment;

	constructor(type: TypeID = 'any', data?: any[], typeEnv?: TypeEnvironment) {
		this.type = type;
		this.data = data || [];
		this.typeEnv = typeEnv || StandardTypeEnv.getInstance();
	}

	add(value: any): boolean {
		if (this.type === 'any') {
			this.data.push(value);
		} else {
			// check types
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

	get(index: number): any {
		return this.data[index];
	}

	getData(): any[] {
		return this.data;
	}

	getType(): string {
		return this.type;
	}
}
