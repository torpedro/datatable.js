
export interface ITypeConversionResult {
	success: boolean;
	resultType?: string,
	result?: any;
}

export interface ITypeConverter {
	fromType: string; // javascript type or custom type or *
	toType: string; // custom type
	priority: number;
	converter: (val: any) => ITypeConversionResult;
}

export interface IStringTypeConverter {
	regex?: RegExp;
	matchAndFormat?: ((value: string) => any);
	format?: ((match: RegExpExecArray) => any);
	priority?: number;
}

export class BaseTypeConverter {
	protected typeConverters: { [fromType: string]: ITypeConverter[] };

	constructor() {
		this.typeConverters = {};
	}

	convert(value: any, toType: string, forceFromType: string = null): ITypeConversionResult {
		let fromType: string = forceFromType || (typeof value);

		// check fromType === toType
		if (fromType === toType) {
			return {
				success: true,
				resultType: toType,
				result: value
			};
		}

		// get all converters that convert from fromType
		// order by priority and filter by toType
		let converters: ITypeConverter[] = this.typeConverters[fromType];
		converters = converters.sort((a: ITypeConverter, b: ITypeConverter): number => a.priority - b.priority);
		converters = converters.filter((conv: ITypeConverter): boolean => conv.toType === toType);

		for (let conv of converters) {
			let res: ITypeConversionResult = conv.converter(value);
			if (res.success) {
				return res;
			}
		}

		return {
			success: false
		};
	}

	autoConvertString(value: string): ITypeConversionResult {
		let converters: ITypeConverter[] = this.typeConverters['string'];

		for (let conv of converters) {
			let res: ITypeConversionResult = conv.converter(value);
			if (res.success) {
				return res;
			}
		}

		return {
			success: false
		}
	}

	addTypeConverter(fromType: string, conv: ITypeConverter): void {
		if (!(fromType in this.typeConverters)) {
			this.typeConverters[fromType] = [];
		}
		this.typeConverters[fromType].push(conv);
	}

	addStringConverter(toType: string, conv: IStringTypeConverter): void {
		this.addTypeConverter('string', {
			fromType: 'string',
			toType,
			priority: conv.priority || 0,
			converter: (value: string): ITypeConversionResult => {
				if (conv.regex) {
					let match: RegExpExecArray = conv.regex.exec(value);
					if (match !== null) {
						let newValue: any = conv.format(match);
						return {
							success: true,
							resultType: toType,
							result: newValue
						};
					}
				} else if (conv.matchAndFormat) {
					let res: any = conv.matchAndFormat(value);
					if (res !== false) {
						return {
							success: true,
							resultType: toType,
							result: res
						};
					}
				}
				return {
					success: false
				}
			}
		});
	}
}

export class StandardTypeConverter extends BaseTypeConverter {

	constructor() {
		super();

		// booleans
		this.addStringConverter('boolean', {
			regex: /^[Ff][Aa][Ll][Ss][Ee]$/,
			format: function(match: RegExpExecArray): boolean { return false; }
		});
		this.addStringConverter('boolean', {
			regex: /^[Tt][Rr][Uu][Ee]$/,
			format: function(match: RegExpExecArray): boolean { return true; }
		});

		// numbers
		this.addStringConverter('number', {
			regex: /^\s*-?[0-9]+(?:\,[0-9][0-9][0-9])*(?:\.[0-9]+)?\s*$/,
			format: function(match: RegExpExecArray): number {
				return parseFloat(match[0].replace(',', ''));
			}
		});
		this.addStringConverter('number', {
			regex: /^\s*-?[0-9]+(?:\.[0-9][0-9][0-9])*(?:\,[0-9]+)?\s*$/,
			format: function(match: RegExpExecArray): number {
				return parseFloat(match[0].replace('.', '').replace(',', '.'));
			}
		});

		// dates
		this.addStringConverter('date', { // dd.mm.yyyy
			regex: /^([0-9]?[0-9])\.([0-9]?[0-9])\.([0-9][0-9][0-9][0-9])$/,
			format: function(match: RegExpExecArray): Date {
				let month: number = parseInt(match[2], 10) - 1;
				return new Date(Date.UTC(parseInt(match[3], 10), month, parseInt(match[1], 10)));
			}
		});

		this.addStringConverter('date', { // yyyy-mm-dd
			regex: /^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$/,
			format: function(match: RegExpExecArray): Date {
				let month: number = parseInt(match[2], 10) - 1;
				return new Date(Date.UTC(parseInt(match[1], 10), month, parseInt(match[3], 10)));
			}
		});

		this.addStringConverter('date', { // mm/dd/yyyy
			regex: /^([0-9]?[0-9])\/([0-9]?[0-9])\/([0-9][0-9][0-9][0-9])$/,
			format: function(match: RegExpExecArray): Date {
				let month: number = parseInt(match[1], 10) - 1;
				return new Date(Date.UTC(parseInt(match[3], 10), month, parseInt(match[2], 10)));
			}
		});

		this.addStringConverter('date', {
			matchAndFormat: function(str: string): Date|boolean {
				// check if it starts with a date
				if (/^([0-9][0-9][0-9][0-9])\-([0-9][0-9])\-([0-9][0-9])/.exec(str)) {
					let date: Date = new Date(str);
					if (!isNaN(date.getTime())) return date;
				}
				return false;
			}
		});

	}




}