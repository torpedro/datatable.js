interface TypeDetection {
	type: string;
	value: any;
}

/**
 * @class Types
 */
class Types {
	static kString = 'string';
	static kNumber = 'number';
	static kData = 'date';
	
	private static _typeDetectors = {
		'date': {
			'iso-date': { // yyyy-mm-dd
				regex: /^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$/, 
				format: function(match) {
					return match[0];
				}
			},
			
			'usa-date': { // mm/dd/yyyy
				regex: /^([0-9]?[0-9])\/([0-9]?[0-9])\/([0-9][0-9][0-9][0-9])$/, 
				format: function(match) {
					return match[0];
				}
			},
			
			'ger-date': { // dd.mm.yyyy
				regex: /^([0-9]?[0-9])\.([0-9]?[0-9])\.([0-9][0-9][0-9][0-9])$/, 
				format: function(match) {
					return match[0];
				}
			}
		}
	}
	
	static detectDataType(value: string): TypeDetection {
		// Iterate over all types
		for (var type in this._typeDetectors) {
			// Iterate over all detectors of that type
			for (var key in this._typeDetectors[type]) {
				var detector = this._typeDetectors[type][key];
				
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
				}
			}
		}
		
		return {
			type: 'unknown',
			value: 0
		}
	}
	
	
}



// modules.export
export = Types;