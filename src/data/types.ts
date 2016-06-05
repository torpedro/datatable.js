/**
 * @module types
 */
export module types {
	export interface ITypeDetector {
		regex?: RegExp;
		matchAndFormat?: ((value: string) => any);
		format?: ((match: RegExpExecArray) => any);
	}

	export interface ITypeDetection {
		type: string;
		value: any;
	}

	// these are the data types that can be detected
	export type TypeID = string;
	export const kAny: TypeID      = 'any';
	export const kString: TypeID   = 'string';
	export const kNumber: TypeID   = 'number';
	export const kDate: TypeID     = 'date';
	export const kObject: TypeID   = 'object';
	export const kBoolean: TypeID  = 'boolean';
	export const kNull: TypeID     = 'null';
	export const kFunction: TypeID = 'function';

	let detectors: { [type: string]: ITypeDetector[] } = {};

	export function registerTypeDetector(type: string, typeDetector: ITypeDetector): void {
		if (!(type in detectors)) detectors[type] = [];
		detectors[type].push(typeDetector);
	}

	/**
	 *
	 */
	export function convert(value: any, toType: string): any {
		let fromType: string = typeof value;

		if (fromType === toType) return value;
		if (toType === 'any') return value;

		if (fromType === 'string') {
			// convert strings
			return convertString(value, toType);
		}

		if (fromType === 'number') {
			// convert numbers
			if (toType === 'string') return '' + value;
		}

		if (fromType === 'object') {
			if (toType === 'date') {
				if (value instanceof Date) return value;
			}
		}
		// can't convert anys
		// can't convert booleans
		// can't convert objects other than dates
		// can't convert nulls

		return undefined;
	}

	/**
	 * possible Types that can be result of JavaScript typeof operator
	 *  - undefined (-> kNull)
	 *  - object (null is an object in JS)  (-> kObject | kDate | kNull)
	 *  - boolean (-> kBoolaen)
	 *  - number (-> kNumber)
	 *  - string
	 *  - function (-> kFunction)
	 *  - symbol (ES6) (-> error)
	 */
	export function detectDataType(value: any, parseStrings: boolean = true): ITypeDetection {

		// get the javascript built-in type
		let jsType: string = typeof value;

		// for values of 'undefined' or 'null'
		// we assign the type 'null'
		if (value === null ||
			value === undefined) {
			return { type: kNull, value: null };
		}

		if (jsType === 'number') return { type: kNumber, value: value };
		if (jsType === 'boolean') return { type: kBoolean, value: value };
		if (jsType === 'function') return { type: kFunction, value: value };
		if (jsType === 'string' && !parseStrings) return { type: kString, value: value };

		// check for Date objects
		if (jsType === 'object') {
			if (value instanceof Date) {
				return { type: kDate, value: value };
			} else {
				return { type: kObject, value: value };
			}
		}

		// parse the string
		if (jsType === 'string' && parseStrings) {
			return detectDataTypeOfString(value);
		}

		throw 'Unable to detect data type!';
	}

	/**
	 *
	 */
	export function convertString(value: string, toType: string): any {
		if (toType in detectors) {
			for (let i: number = 0; i < detectors[toType].length; ++i) {
				let detector: ITypeDetector = detectors[toType][i];

				if (detector.regex) {
					let match: RegExpExecArray = detector.regex.exec(value);
					if (match !== null) {
						let newValue: any = detector.format(match);

						// type detected -> return it
						return newValue;
					}
				} else if (detector.matchAndFormat) {
					let res: any = detector.matchAndFormat(value);
					if (res !== false) return res;
				}
			}
		}
		return undefined;
	}

	/**
	 *
	 */
	export function detectDataTypeOfString(value: string): ITypeDetection {
		// iterate over all types
		for (let type in detectors) {
			// try to convert and check result
			let res: any = convertString(value, type);
			if (res !== undefined) {
				return {
					type: type,
					value: res
				};
			}
		}

		return {
			type: 'string',
			value: value
		};
	}
}

/**
 * date detectors
 */
types.registerTypeDetector('date', { // dd.mm.yyyy
	regex: /^([0-9]?[0-9])\.([0-9]?[0-9])\.([0-9][0-9][0-9][0-9])$/,
	format: function(match: RegExpExecArray): Date {
		let month: number = parseInt(match[2], 10) - 1;
		return new Date(Date.UTC(parseInt(match[3], 10), month, parseInt(match[1], 10)));
	}
});

types.registerTypeDetector('date', { // yyyy-mm-dd
	regex: /^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$/,
	format: function(match: RegExpExecArray): Date {
		let month: number = parseInt(match[2], 10) - 1;
		return new Date(Date.UTC(parseInt(match[1], 10), month, parseInt(match[3], 10)));
	}
});

types.registerTypeDetector('date', { // mm/dd/yyyy
	regex: /^([0-9]?[0-9])\/([0-9]?[0-9])\/([0-9][0-9][0-9][0-9])$/,
	format: function(match: RegExpExecArray): Date {
		let month: number = parseInt(match[1], 10) - 1;
		return new Date(Date.UTC(parseInt(match[3], 10), month, parseInt(match[2], 10)));
	}
});

types.registerTypeDetector('date', {
	matchAndFormat: function(str: string): Date|boolean {
		// check if it starts with a date
		if (/^([0-9][0-9][0-9][0-9])\-([0-9][0-9])\-([0-9][0-9])/.exec(str)) {
			let date: Date = new Date(str);
			if (!isNaN(date.getTime())) return date;
		}
		return false;
	}
});


/**
 * number detectors
 */
types.registerTypeDetector('number', {
	regex: /^\s*-?[0-9]+(?:\,[0-9][0-9][0-9])*(?:\.[0-9]+)?\s*$/,
	format: function(match: RegExpExecArray): number {
		return parseFloat(match[0].replace(',', ''));
	}
});
types.registerTypeDetector('number', {
	regex: /^\s*-?[0-9]+(?:\.[0-9][0-9][0-9])*(?:\,[0-9]+)?\s*$/,
	format: function(match: RegExpExecArray): number {
		return parseFloat(match[0].replace('.', '').replace(',', '.'));
	}
});

/**
 * boolean
 */
types.registerTypeDetector('boolean', {
	regex: /^[Ff][Aa][Ll][Ss][Ee]$/,
	format: function(match: RegExpExecArray): boolean { return false; }
});
types.registerTypeDetector('boolean', {
	regex: /^[Tt][Rr][Uu][Ee]$/,
	format: function(match: RegExpExecArray): boolean { return true; }
});
