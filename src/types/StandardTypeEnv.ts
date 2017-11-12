
import {
  TypeEnvironment,
  ITypeDetectionResult,
  TypeID
} from './TypeEnvironment';

export class StandardTypeEnv extends TypeEnvironment {
  public static kAny: TypeID      = 'any';
  public static kString: TypeID   = 'string';
  public static kNumber: TypeID   = 'number';
  public static kDate: TypeID     = 'date';
  public static kObject: TypeID   = 'object';
  public static kBoolean: TypeID  = 'boolean';
  public static kNull: TypeID     = 'null';
  public static kFunction: TypeID = 'function';

  // Static instance
  private static _instance: StandardTypeEnv;

  public static getInstance(): StandardTypeEnv {
    if (!this._instance) {
      this._instance = new StandardTypeEnv();
    }
    return this._instance;
  }

  constructor() {
    super();

    // Booleans
    this.addStringConverter(StandardTypeEnv.kBoolean, {
      regex: /^[Ff][Aa][Ll][Ss][Ee]$/,
      format: function(match: RegExpExecArray): boolean { return false; }
    });
    this.addStringConverter(StandardTypeEnv.kBoolean, {
      regex: /^[Tt][Rr][Uu][Ee]$/,
      format: function(match: RegExpExecArray): boolean { return true; }
    });

    // Numbers
    this.addStringConverter(StandardTypeEnv.kNumber, {
      regex: /^\s*-?[0-9]+(?:\,[0-9][0-9][0-9])*(?:\.[0-9]+)?\s*$/,
      format: function(match: RegExpExecArray): number {
        return parseFloat(match[0].replace(',', ''));
      }
    });
    this.addStringConverter(StandardTypeEnv.kNumber, {
      regex: /^\s*-?[0-9]+(?:\.[0-9][0-9][0-9])*(?:\,[0-9]+)?\s*$/,
      format: function(match: RegExpExecArray): number {
        return parseFloat(match[0].replace('.', '').replace(',', '.'));
      }
    });

    // Dates
    // Format: dd.mm.yyyy (German)
    this.addStringConverter(StandardTypeEnv.kDate, {
      regex: /^([0-9]?[0-9])\.([0-9]?[0-9])\.([0-9][0-9][0-9][0-9])$/,
      format: function(match: RegExpExecArray): Date {
        let month: number = parseInt(match[2], 10) - 1;
        return new Date(Date.UTC(parseInt(match[3], 10), month, parseInt(match[1], 10)));
      }
    });

    // Format: yyyy-mm-dd (ISO)
    this.addStringConverter(StandardTypeEnv.kDate, {
      regex: /^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$/,
      format: function(match: RegExpExecArray): Date {
        let month: number = parseInt(match[2], 10) - 1;
        return new Date(Date.UTC(parseInt(match[1], 10), month, parseInt(match[3], 10)));
      }
    });

    // Format: mm/dd/yyyy (USA)
    this.addStringConverter(StandardTypeEnv.kDate, {
      regex: /^([0-9]?[0-9])\/([0-9]?[0-9])\/([0-9][0-9][0-9][0-9])$/,
      format: function(match: RegExpExecArray): Date {
        let month: number = parseInt(match[1], 10) - 1;
        return new Date(Date.UTC(parseInt(match[3], 10), month, parseInt(match[2], 10)));
      }
    });

    this.addStringConverter(StandardTypeEnv.kDate, {
      matchAndFormat: function(str: string): Date|boolean {
        // Check if it starts with a date
        if (/^([0-9][0-9][0-9][0-9])\-([0-9][0-9])\-([0-9][0-9])/.exec(str)) {
          let date: Date = new Date(str);
          if (!isNaN(date.getTime())) return date;
        }
        return false;
      }
    });

    this.addTypeDetector('undefined', (value: any): ITypeDetectionResult => {
      return {
        type: StandardTypeEnv.kNull,
        value: null
      };
    });

    this.addTypeDetector('object', (value: any): ITypeDetectionResult => {
      if (value === null) {
        return {
          type: StandardTypeEnv.kNull,
          value: null
        };
      }
    });

    this.addTypeDetector('object', (value: Object): ITypeDetectionResult => {
      if (value instanceof Date) {
        return {
          type: StandardTypeEnv.kDate,
          value
        };
      }
      return null;
    });
  }
}