/**
 * @module types
 */
module types {
	export interface ITypeDetection {
		type: string;
		value: any;
	}

	// these are the data types that can be detected
	var types: string[] = ['any', 'string', 'number', 'date', 'object', 'boolean', 'null', 'function'];
	export var kAny      = types[0];
	export var kString   = types[1];
	export var kNumber   = types[2];
	export var kDate     = types[3];
	export var kObject   = types[4];
	export var kBoolean  = types[5];
	export var kNull     = types[6];
	export var kFunction = types[7];


	var _typeDetectors = {};
	export function registerTypeDetector(type: string, typeDetector: any) {
		if (!(type in _typeDetectors)) _typeDetectors[type] = [];
		_typeDetectors[type].push(typeDetector);
	}

	/**
	 *
	 */
	export function convert(value: any, toType: string): any {
		var fromType: string = typeof value;

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
	export function detectDataType(value: any, parseStrings?: boolean): ITypeDetection {
		if (typeof parseStrings === 'undefined') parseStrings = true;

		// get the javascript built-in type
		var jsType: string = typeof value;

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
	export function convertString(value: string, toType: string) {
		if (toType in _typeDetectors) {
			for (var i = 0; i < _typeDetectors[toType].length; ++i) {
				var detector = _typeDetectors[toType][i];

				if (detector.regex) {
					var match = detector.regex.exec(value);
					if (match !== null) {
						var newValue = detector.format(match);

						// type detected -> return it
						return newValue;
					}
				} else if (detector.matchAndFormat) {
					var res = detector.matchAndFormat(value);
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
		for (var type in _typeDetectors) {
			// try to convert and check result
			var res = convertString(value, type);
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
	format: function(match) {
		var month = parseInt(match[2], 10) - 1;
		return new Date(Date.UTC(match[3], month, match[1]));
	}
});

types.registerTypeDetector('date', { // yyyy-mm-dd
	regex: /^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$/,
	format: function(match) {
		var month = parseInt(match[2], 10) - 1;
		return new Date(Date.UTC(match[1], month, match[3]));
	}
});

types.registerTypeDetector('date', { // mm/dd/yyyy
	regex: /^([0-9]?[0-9])\/([0-9]?[0-9])\/([0-9][0-9][0-9][0-9])$/,
	format: function(match) {
		var month = parseInt(match[1], 10) - 1;
		return new Date(Date.UTC(match[3], month, match[2]));
	}
});

types.registerTypeDetector('date', {
	matchAndFormat: function(str: string): any {
		// check if it starts with a date
		if (/^([0-9][0-9][0-9][0-9])\-([0-9][0-9])\-([0-9][0-9])/.exec(str)) {
			var date = new Date(str);
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
	format: function(match) {
		return parseFloat(match[0].replace(',', ''));
	}
});
types.registerTypeDetector('number', {
	regex: /^\s*-?[0-9]+(?:\.[0-9][0-9][0-9])*(?:\,[0-9]+)?\s*$/,
	format: function(match) {
		return parseFloat(match[0].replace('.', '').replace(',', '.'));
	}
});

/**
 * boolean
 */
types.registerTypeDetector('boolean', {
	regex: /^[Ff][Aa][Ll][Ss][Ee]$/,
	format: function(match) { return false; }
});
types.registerTypeDetector('boolean', {
	regex: /^[Tt][Rr][Uu][Ee]$/,
	format: function(match) { return true; }
});

// modules.export
export = types;