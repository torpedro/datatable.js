

interface TypeDetection {
	type: string;
	value: any;
}

/**
 * @module types
 */
module types {
	
	// These are the data types that can be detected
	export var kString = 'string';
	export var kNumber = 'number';
	export var kData = 'date';
	export var kObject = 'object';
	export var kBoolean = 'boolean';
	export var kNull = 'null';
	
	 var _typeDetectors = {
		'date': {
			'iso-date': { // yyyy-mm-dd
				regex: /^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$/, 
				format: function(match) {
					var month = parseInt(match[2]) - 1;
					return new Date(Date.UTC(match[1], month, match[3]));
				}
			},
			
			'usa-date': { // mm/dd/yyyy
				regex: /^([0-9]?[0-9])\/([0-9]?[0-9])\/([0-9][0-9][0-9][0-9])$/, 
				format: function(match) {
					var month = parseInt(match[1]) - 1;
					return new Date(Date.UTC(match[3], month, match[2]));
				}
			},
			
			'ger-date': { // dd.mm.yyyy
				regex: /^([0-9]?[0-9])\.([0-9]?[0-9])\.([0-9][0-9][0-9][0-9])$/, 
				format: function(match) {
					var month = parseInt(match[2]) - 1;
					return new Date(Date.UTC(match[3], month, match[1]));
				}
			},
			
			'iso-datetime': {
				matchAndFormat: function(str: string): any {
					// Check if it starts with a date
					if (/^([0-9][0-9][0-9][0-9])\-([0-9][0-9])\-([0-9][0-9])/.exec(str)) {
						var date = new Date(str);
						if (!isNaN(date.getTime())) return date;
					}
					return false;
				}
			}
		},
		'number': {
			'eng-style': {
				regex: /^\s*-?[0-9]+(?:\,[0-9][0-9][0-9])*(?:\.[0-9]+)?\s*$/,
				format: function(match) {
					return parseFloat(match[0].replace(',', ''));
				}
			},
			'ger-style': {
				regex: /^\s*-?[0-9]+(?:\.[0-9][0-9][0-9])*(?:\,[0-9]+)?\s*$/,
				format: function(match) {
					return parseFloat(match[0].replace(".", "").replace(",", "."));
				}
			}
		}
	}
	
	
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
	
	export function detectDataTypeOfString(value: string): TypeDetection {
		// Iterate over all types
		for (var type in _typeDetectors) {
			// Iterate over all detectors of that type
			for (var key in _typeDetectors[type]) {
				var detector = _typeDetectors[type][key];
				
				if (detector.regex) {
					var match = detector.regex.exec(value);
					if (match !== null) {
						var newValue = detector.format(match);
						
						// Type deteced!
						// Return it
						return {
							type: type,
							value: newValue
						}
					}
				} else if (detector.matchAndFormat) {
					var res = detector.matchAndFormat(value);
					if (res !== false) return {
						type: type,
						value: res
					}
				}
			}
		}
		
		return {
			type: 'string',
			value: value
		}
	}
	
	
}



// modules.export
export = types;