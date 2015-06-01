

interface TypeDetection {
	type: string;
	value: any;
}

/**
 * @module types
 */
module types {
	// These are the data types that can be detected
	var types = ['any', 'string', 'number', 'date', 'object', 'boolean', 'null'];
	export var kAny     = types[0];
	export var kString  = types[1];
	export var kNumber  = types[2];
	export var kDate    = types[3];
	export var kObject  = types[4];
	export var kBoolean = types[5];
	export var kNull    = types[6];
	
	
	var _typeDetectors = {}
	export function registerTypeDetector(type: string, typeDetector: any) {
		if (!(type in _typeDetectors)) _typeDetectors[type] = [];
		_typeDetectors[type].push(typeDetector);
	}
	
	/**
	 * 
	 */
	export function convert(value: any, toType: string): any {
		if (toType == 'any') return value;
		
		var fromType = typeof value;
		if (fromType == toType) return value;
		if (fromType == 'string') {
			// Convert strings
			return convertString(value, toType);
		}
		if (fromType == 'number') {
			// Convert numbers
			if (toType == 'string') return ''+value;
		}
		
		if (fromType == 'object') {
			if (toType == 'date') {
				if (value instanceof Date) return value;
			}
		}
		// Can't convert anys
		// Can't convert booleans
		// Can't convert objects other than dates
		// Can't convert nulls
		
		return undefined;
	}
	
	/**
	 * 
	 */
	export function detectDataType(value: any, parseStrings?: boolean): TypeDetection {
		if (typeof parseStrings === 'undefined') parseStrings = true;
		
		// Get the javascript built-in type
		var type: string = typeof value;
		
		// For values of 'undefined' or 'null'
		// we assign the type 'null'  
		if (value === null || value === undefined) type = 'null';
		
		// Check if its a basic data type and just return it
		if (type == 'number' ||
			type == 'boolean' ||
			type == 'null' ||
			(type == 'string' && !parseStrings)) {
			
			return {type: type, value: value};
		}
		
		// Check for Date objects
		if (type == 'object') {
			if (value instanceof Date) type = 'date';
			
			return {type: type, value: value};
		}
		
		// Parse the string
		if (type == 'string') {
			return detectDataTypeOfString(value);
		}
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
						
						// Type deteced!
						// Return it
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
	export function detectDataTypeOfString(value: string): TypeDetection {
		// Iterate over all types
		for (var type in _typeDetectors) {
			// Try to convert and check result
			var res = convertString(value, type);
			if (res !== undefined) {
				return {
					type: type,
					value: res
				}
			}
		}
		
		return {
			type: 'string',
			value: value
		}
	}
}

/**
 * Date Detectors
 */
types.registerTypeDetector('date', { // dd.mm.yyyy
	regex: /^([0-9]?[0-9])\.([0-9]?[0-9])\.([0-9][0-9][0-9][0-9])$/, 
	format: function(match) {
		var month = parseInt(match[2]) - 1;
		return new Date(Date.UTC(match[3], month, match[1]));
	}
});

types.registerTypeDetector('date', { // yyyy-mm-dd
	regex: /^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$/, 
	format: function(match) {
		var month = parseInt(match[2]) - 1;
		return new Date(Date.UTC(match[1], month, match[3]));
	}
});

types.registerTypeDetector('date', { // mm/dd/yyyy
	regex: /^([0-9]?[0-9])\/([0-9]?[0-9])\/([0-9][0-9][0-9][0-9])$/, 
	format: function(match) {
		var month = parseInt(match[1]) - 1;
		return new Date(Date.UTC(match[3], month, match[2]));
	}
});

types.registerTypeDetector('date', {
	matchAndFormat: function(str: string): any {
		// Check if it starts with a date
		if (/^([0-9][0-9][0-9][0-9])\-([0-9][0-9])\-([0-9][0-9])/.exec(str)) {
			var date = new Date(str);
			if (!isNaN(date.getTime())) return date;
		}
		return false;
	}
});


/**
 * Number Detectors
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
		return parseFloat(match[0].replace(".", "").replace(",", "."));
	}
});

/**
 * boolean
 */
types.registerTypeDetector('boolean', {
	regex: /^[Ff][Aa][Ll][Ss][Ee]$/,
	format: function(match) { return false; }
})
types.registerTypeDetector('boolean', {
	regex: /^[Tt][Rr][Uu][Ee]$/,
	format: function(match) { return true; }
})

// modules.export
export = types;