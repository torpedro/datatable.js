
export interface ITypeConversionResult {
  success: boolean;
  resultType?: string;
  result?: any;
}

export interface ITypeConverter {
  fromType: string; // Javascript type or custom type or *
  toType: string; // Custom type
  priority: number;
  converter: (val: any) => ITypeConversionResult;
}

export interface IStringTypeConverter {
  regex?: RegExp;
  matchAndFormat?: ((value: string) => any);
  format?: ((match: RegExpExecArray) => any);
  priority?: number;
}

export interface ITypeDetectionResult {
  type: TypeID;
  value: any;
}

export type TypeDetector = ((value: any) => ITypeDetectionResult);
export type TypeID = string;

export class TypeEnvironment {
  protected typeConverters: { [fromType: string]: ITypeConverter[] };
  protected typeDetectors: { [jsType: string]: TypeDetector[] };

  constructor() {
    this.typeConverters = {};
    this.typeDetectors = {};
  }

  convert(value: any, toType: string, forceFromType: string = null): ITypeConversionResult {
    let fromType: string = forceFromType || this.detectDataType(value, false).type;

    // Check [fromType === toType]
    if (fromType === toType) {
      return {
        success: true,
        resultType: toType,
        result: value
      };
    }

    // Get all converters that convert from [fromType].
    // Order by priority and filter by [toType].
    let converters: ITypeConverter[] = this.typeConverters[fromType] || [];
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
    };
  }

  addTypeConverter(fromType: string, conv: ITypeConverter): void {
    if (!(fromType in this.typeConverters)) {
      this.typeConverters[fromType] = [];
    }
    this.typeConverters[fromType].push(conv);
  }

  addTypeDetector(jsType: string, detector: TypeDetector): void {
    if (!(jsType in this.typeDetectors)) {
      this.typeDetectors[jsType] = [];
    }
    this.typeDetectors[jsType].push(detector);
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
        };
      }
    });
  }

  detectDataType(value: any, tryParseStrings: boolean = true): ITypeDetectionResult {
    let jsType: string = typeof value;

    let detectors: TypeDetector[] = this.typeDetectors[jsType] || [];
    for (let fn of detectors) {
      let res: ITypeDetectionResult = fn(value);
      if (res) {
        return res;
      }
    }
    if (jsType === 'string' && tryParseStrings) {
      let res: ITypeConversionResult = this.autoConvertString(value);
      if (res.success) {
        return {
          type: res.resultType,
          value: res.result
        };
      }
    }

    return {
      type: jsType,
      value
    };
  }
}