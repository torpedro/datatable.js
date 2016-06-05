
export class Vector {
	private data: any[];
	private type: string;

	constructor(type: string = 'any', data?: any[]) {
		this.type = type;
		if (data) {
			this.data = data;
		} else {
			this.data = [];
		}
	}

	add(value: any): boolean {
		// todo: check type
		this.data.push(value);
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
}
