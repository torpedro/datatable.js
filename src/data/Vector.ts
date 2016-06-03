
class Vector {
	private data: any[];
	private type: string;

	constructor(type: string, data?: any[]) {
		this.type = type;
		if (data) {
			this.data = data;
		} else {
			this.data = [];
		}
	}

	add(value: any): void {
		// todo: check type
		this.data.push(value);
	}

	size(): number {
		return this.data.length;
	}

	get(index?: number): any[] {
		if (typeof index === 'undefined') {
			return this.data;
		} else {
			return this.data[index];
		}
	}

}

// modules.export
export = Vector;
