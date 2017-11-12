(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.dt = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var __module__1 = require("./data/__module__");
exports.Vector = __module__1.Vector;
exports.Set = __module__1.Set;
exports.HashMap = __module__1.HashMap;
var __module__2 = require("./table/__module__");
exports.Table = __module__2.AnalyticsTable;
var __module__3 = require("./io/__module__");
exports.CSVParser = __module__3.CSVParser;

},{"./data/__module__":7,"./io/__module__":10,"./table/__module__":14}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("underscore");
var util_1 = require("./util");
var HashMap = (function () {
    function HashMap(useIdentity) {
        this.map = {};
        if (useIdentity)
            this.useIdentity = true;
        else
            this.useIdentity = false;
    }
    HashMap.prototype.set = function (key, val) {
        var bucket = this.getBucket(key);
        var i = this.findKeyInBucket(key, bucket);
        if (i >= 0)
            bucket[i][1] = val;
        else
            bucket.push([key, val]);
    };
    HashMap.prototype.get = function (key) {
        var bucket = this.getBucket(key);
        var i = this.findKeyInBucket(key, bucket);
        if (i >= 0)
            return bucket[i][1];
        else
            return null;
    };
    HashMap.prototype.contains = function (key) {
        var bucket = this.getBucket(key);
        return this.findKeyInBucket(key, bucket) >= 0;
    };
    HashMap.prototype.keys = function () {
        var keys = [];
        for (var hash in this.map) {
            var bucket = this.map[hash];
            for (var i = 0; i < bucket.length; ++i) {
                keys.push(bucket[i][0]);
            }
        }
        return keys;
    };
    HashMap.prototype.getBucket = function (key) {
        var hash = util_1.util.hashCode(key);
        if (!(hash in this.map))
            this.map[hash] = [];
        return this.map[hash];
    };
    HashMap.prototype.findKeyInBucket = function (key, bucket) {
        for (var i = 0; i < bucket.length; ++i) {
            if (this.isEqual(key, bucket[i][0])) {
                return i;
            }
        }
        return -1;
    };
    HashMap.prototype.isEqual = function (a, b) {
        if (this.useIdentity)
            return a === b;
        else
            return _.isEqual(a, b);
    };
    return HashMap;
}());
exports.HashMap = HashMap;

},{"./util":8,"underscore":19}],3:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Set_1 = require("./Set");
var OrderedSet = (function (_super) {
    __extends(OrderedSet, _super);
    function OrderedSet() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    OrderedSet.prototype.add = function (val) {
        var search = this.binarySearch(val, 0, this.array.length);
        if (search[0] === -1) {
            this.array.splice(search[1], 0, val);
        }
    };
    OrderedSet.prototype.difference = function (other) {
        var set = new OrderedSet(this);
        for (var i = 0; i < other.size(); ++i) {
            set.remove(other.get(i));
        }
        return set;
    };
    OrderedSet.prototype.indexOf = function (val) {
        return this.binarySearch(val, 0, this.array.length)[0];
    };
    OrderedSet.prototype.intersection = function (other) {
        var set = new OrderedSet();
        for (var i = 0; i < this.size(); ++i) {
            if (other.contains(this.array[i])) {
                set.add(this.array[i]);
            }
        }
        return set;
    };
    OrderedSet.prototype.union = function (other) {
        var set = new OrderedSet(this);
        for (var i = 0; i < other.size(); ++i) {
            set.add(other.get(i));
        }
        return set;
    };
    OrderedSet.prototype.binarySearch = function (val, low, high) {
        if (low > high)
            return [-1, low];
        var mid = Math.floor((low + high) / 2);
        if (this.array[mid] === val)
            return [mid, mid];
        else if (this.array[mid] < val)
            return this.binarySearch(val, mid + 1, high);
        else
            return this.binarySearch(val, low, mid - 1);
    };
    return OrderedSet;
}(Set_1.Set));
exports.OrderedSet = OrderedSet;

},{"./Set":4}],4:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Set = (function () {
    function Set(data) {
        var i;
        this.array = [];
        if (data instanceof Array) {
            for (i = 0; i < data.length; ++i) {
                this.add(data[i]);
            }
        }
        else if (data && data.toArray) {
            for (var _i = 0, _a = data.toArray(); _i < _a.length; _i++) {
                var value = _a[_i];
                this.add(value);
            }
        }
    }
    Set.prototype.add = function (val) {
        if (this.array.indexOf(val) === -1) {
            this.array.push(val);
        }
    };
    Set.prototype.clear = function () {
        this.array = [];
    };
    Set.prototype.contains = function (val) {
        return this.array.indexOf(val) >= 0;
    };
    Set.prototype.difference = function (other) {
        var set = new Set(this.toArray());
        for (var i = 0; i < other.size(); ++i) {
            set.remove(other.get(i));
        }
        return set;
    };
    Set.prototype.toArray = function () {
        return this.array;
    };
    Set.prototype.get = function (index) {
        return this.array[index];
    };
    Set.prototype.indexOf = function (val) {
        return this.array.indexOf(val);
    };
    Set.prototype.intersection = function (other) {
        var set = new Set();
        for (var i = 0; i < this.size(); ++i) {
            if (other.contains(this.array[i])) {
                set.add(this.array[i]);
            }
        }
        return set;
    };
    Set.prototype.isDisjoint = function (other) {
        for (var i = 0; i < this.size(); ++i) {
            if (other.contains(this.array[i])) {
                return false;
            }
        }
        return true;
    };
    Set.prototype.isEqual = function (other) {
        return this.isSubset(other) && this.isSuperset(other);
    };
    Set.prototype.isSubset = function (other) {
        for (var i = 0; i < this.size(); ++i) {
            if (!other.contains(this.array[i])) {
                return false;
            }
        }
        return true;
    };
    Set.prototype.isSuperset = function (other) {
        return other.isSubset(this);
    };
    Set.prototype.pop = function () {
        if (this.size() > 0) {
            var elem = this.array[0];
            this.remove(elem);
            return elem;
        }
    };
    Set.prototype.remove = function (val) {
        var index = this.indexOf(val);
        if (index >= 0) {
            this.array.splice(index, 1);
        }
    };
    Set.prototype.size = function () {
        return this.array.length;
    };
    Set.prototype.union = function (other) {
        var set = new Set(this);
        for (var i = 0; i < other.size(); ++i) {
            set.add(other.get(i));
        }
        return set;
    };
    return Set;
}());
exports.Set = Set;

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var StandardTypeEnv_1 = require("../types/StandardTypeEnv");
var Vector = (function () {
    function Vector(type, data, typeEnv) {
        if (type === void 0) { type = 'any'; }
        this.type = type;
        this.data = [];
        this.typeEnv = typeEnv || StandardTypeEnv_1.StandardTypeEnv.getInstance();
        if (data instanceof Array) {
            this.data = data;
        }
        else if (data && data.toArray) {
            this.data = data.toArray();
        }
    }
    Vector.prototype.get = function (index) {
        return this.data[index];
    };
    Vector.prototype.getType = function () {
        return this.type;
    };
    Vector.prototype.push = function (value) {
        if (this.type === 'any') {
            this.data.push(value);
        }
        else {
            var parseStrings = this.type !== 'string';
            var res = this.typeEnv.detectDataType(value, parseStrings);
            if (res.type === this.type) {
                this.data.push(res.value);
                return true;
            }
            else {
                return false;
            }
        }
        return true;
    };
    Vector.prototype.size = function () {
        return this.data.length;
    };
    Vector.prototype.toArray = function () {
        return this.data;
    };
    return Vector;
}());
exports.Vector = Vector;

},{"../types/StandardTypeEnv":16}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("underscore");
var StandardTypeEnv_1 = require("../types/StandardTypeEnv");
var vec;
(function (vec) {
    function range(vector, dataType) {
        var size = vector.length;
        if (size === 0)
            return null;
        var interval = [vector[0], vector[0]];
        for (var n = 1; n < size; ++n) {
            var value = vector[n];
            if (value < interval[0])
                interval[0] = value;
            if (value > interval[1])
                interval[1] = value;
        }
        return interval;
    }
    vec.range = range;
    function min(vector) { return range(vector)[0]; }
    vec.min = min;
    function max(vector) { return range(vector)[1]; }
    vec.max = max;
    function detectDataType(vector, parseStrings, convertTypes) {
        if (parseStrings === void 0) { parseStrings = true; }
        if (convertTypes === void 0) { convertTypes = false; }
        var env = StandardTypeEnv_1.StandardTypeEnv.getInstance();
        var typeset = [];
        for (var i = 0; i < vector.length; ++i) {
            var value = vector[i];
            var res = env.detectDataType(value, parseStrings);
            if (res.type === 'null')
                continue;
            if (typeset.indexOf(res.type) === -1)
                typeset.push(res.type);
            if (convertTypes)
                vector[i] = res.value;
        }
        if (typeset.length === 0)
            return StandardTypeEnv_1.StandardTypeEnv.kNull;
        if (typeset.length === 1)
            return typeset[0];
        else
            return 'any';
    }
    vec.detectDataType = detectDataType;
    function convertToType(vector, targetType) {
        var newVec = _.map(vector, function (value, i) {
            return StandardTypeEnv_1.StandardTypeEnv.getInstance().convert(value, targetType).result;
        });
        return newVec;
    }
    vec.convertToType = convertToType;
    function groupByPositions(vector) {
        var map = {};
        for (var i = 0; i < vector.length; ++i) {
            var value = vector[i];
            if (value in map) {
                map[value].push(i);
            }
            else {
                map[value] = [i];
            }
        }
        return map;
    }
    vec.groupByPositions = groupByPositions;
    function distinctValues(vector) {
        var values = [];
        for (var i = 0; i < vector.length; ++i) {
            if (values.indexOf(vector[i]) === -1) {
                values.push(vector[i]);
            }
        }
        return values;
    }
    vec.distinctValues = distinctValues;
})(vec = exports.vec || (exports.vec = {}));

},{"../types/StandardTypeEnv":16,"underscore":19}],7:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var VectorOperations_1 = require("./VectorOperations");
exports.vec = VectorOperations_1.vec;
var util_1 = require("./util");
exports.util = util_1.util;
var Set_1 = require("./Set");
exports.Set = Set_1.Set;
var OrderedSet_1 = require("./OrderedSet");
exports.OrderedSet = OrderedSet_1.OrderedSet;
var HashMap_1 = require("./HashMap");
exports.HashMap = HashMap_1.HashMap;
var Vector_1 = require("./Vector");
exports.Vector = Vector_1.Vector;

},{"./HashMap":2,"./OrderedSet":3,"./Set":4,"./Vector":5,"./VectorOperations":6,"./util":8}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util;
(function (util) {
    function toHex(num) {
        var ret = ((num < 0 ? 0x8 : 0) + ((num >> 28) & 0x7)).toString(16) + (num & 0xfffffff).toString(16);
        while (ret.length < 8)
            ret = "0" + ret;
        return ret;
    }
    util.toHex = toHex;
    function hashCode(o, l) {
        l = l || 2;
        var i, c, r = [];
        for (i = 0; i < l; i++)
            r.push(i * 268803292);
        function stringify(o) {
            var i, r;
            if (o === null)
                return "n";
            if (o === true)
                return "t";
            if (o === false)
                return "f";
            if (o instanceof Date)
                return "d:0" + o.toString();
            i = typeof o;
            if (i === "string")
                return "s:" + o.replace(/([\\\\;])/g, "\\$1");
            if (i === "number")
                return "n:" + o;
            if (o instanceof Function)
                return "m:" + o.toString().replace(/([\\\\;])/g, "\\$1");
            if (o instanceof Array) {
                r = [];
                for (i = 0; i < o.length; i++)
                    r.push(stringify(o[i]));
                return "a:" + r.join(";");
            }
            r = [];
            for (i in o) {
                r.push(i + ":" + stringify(o[i]));
            }
            return "o:" + r.join(";");
        }
        o = stringify(o);
        for (i = 0; i < o.length; i++) {
            for (c = 0; c < r.length; c++) {
                r[c] = (r[c] << 13) - (r[c] >> 19);
                r[c] += o.charCodeAt(i) << (r[c] % 24);
                r[c] = r[c] & r[c];
            }
        }
        for (i = 0; i < r.length; i++) {
            r[i] = toHex(r[i]);
        }
        return r.join("");
    }
    util.hashCode = hashCode;
})(util = exports.util || (exports.util = {}));

},{}],9:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Papa = require("papaparse");
var CoreColumnTable_1 = require("../table/CoreColumnTable");
var CSVParser = (function () {
    function CSVParser(options) {
        if (!options)
            options = {};
        if (typeof options.header === 'undefined')
            options.header = true;
        if (typeof options.skipEmptyLines === 'undefined')
            options.skipEmptyLines = true;
        this.options = options;
    }
    CSVParser.prototype.parseString = function (csvString) {
        var result = Papa.parse(csvString, this.options);
        var numRows = result.data.length;
        var fields = [];
        var attrVectors = [];
        if (result.meta.fields) {
            fields = result.meta.fields;
            for (var c = 0; c < fields.length; ++c) {
                var vector = [];
                for (var r = 0; r < numRows; ++r) {
                    vector.push(result.data[r][fields[c]]);
                }
                attrVectors.push(vector);
            }
        }
        else {
            var numColumns = 0;
            for (var r = 0; r < numRows; ++r) {
                numColumns = Math.max(numColumns, result.data[r].length);
            }
            for (var c = 0; c < numColumns; ++c) {
                fields.push('Column ' + (c + 1));
            }
            for (var c = 0; c < numColumns; ++c) {
                var vector = [];
                for (var r = 0; r < numRows; ++r) {
                    vector.push(result.data[r][c]);
                }
                attrVectors.push(vector);
            }
        }
        var table = new CoreColumnTable_1.CoreColumnTable({
            fields: fields,
            columns: attrVectors
        });
        table.detectTypes(true);
        return table;
    };
    CSVParser.prototype.dumpString = function (table) {
        var csv = '';
        csv += table.fields().join(this.options.delimiter);
        csv += '\n';
        for (var i = 0; i < table.count() - 1; ++i) {
            var row = table.row(i);
            csv += row.join(this.options.delimiter);
            csv += '\n';
        }
        csv += table.row(table.count() - 1).join(this.options.delimiter);
        return csv;
    };
    return CSVParser;
}());
exports.CSVParser = CSVParser;

},{"../table/CoreColumnTable":12,"papaparse":18}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var CSVParser_1 = require("./CSVParser");
exports.CSVParser = CSVParser_1.CSVParser;

},{"./CSVParser":9}],11:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var CoreColumnTable_1 = require("./CoreColumnTable");
var FieldDescriptor_1 = require("./FieldDescriptor");
var OrderedSet_1 = require("../data/OrderedSet");
var HashMap_1 = require("../data/HashMap");
var VectorOperations_1 = require("../data/VectorOperations");
var agg_1 = require("./operators/agg");
var AnalyticsTable = (function (_super) {
    __extends(AnalyticsTable, _super);
    function AnalyticsTable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.agg = agg_1.agg;
        return _this;
    }
    AnalyticsTable.prototype.groupBy = function (_groupFields, aggregations) {
        if (!aggregations)
            aggregations = [];
        if (!(_groupFields instanceof Array))
            return this.groupBy([_groupFields], aggregations);
        var fields = convertListOfFieldDescriptors(_groupFields);
        var outputFields = [];
        for (var i = 0; i < fields.length; ++i) {
            outputFields.push(fields[i].outputName);
        }
        for (var k = 0; k < aggregations.length; ++k) {
            if (aggregations[k].aggName)
                outputFields.push(aggregations[k].aggName);
            else if (aggregations[k].name)
                outputFields.push(aggregations[k].name);
            else
                outputFields.push('Aggregation ' + k);
        }
        var map = new HashMap_1.HashMap(false);
        for (var r = 0; r < this.count(); ++r) {
            var key = [];
            for (var c = 0; c < fields.length; ++c) {
                key.push(fields[c].getValue(this, r));
            }
            if (map.contains(key)) {
                map.get(key).push(this.row(r));
            }
            else {
                map.set(key, [this.row(r)]);
            }
        }
        var result = new AnalyticsTable({
            fields: outputFields
        });
        var keys = map.keys();
        for (var k = 0; k < keys.length; ++k) {
            var row = [];
            for (var c = 0; c < keys[k].length; ++c) {
                row.push(keys[k][c]);
            }
            for (var a = 0; a < aggregations.length; ++a) {
                row.push(aggregations[a](map.get(keys[k]), this));
            }
            result.insert([row]);
        }
        return result;
    };
    AnalyticsTable.prototype.filter = function (predicate) {
        var result = new AnalyticsTable({
            fields: this.fieldset.toArray(),
            types: this.types()
        });
        for (var r = 0; r < this.count(); ++r) {
            var row = this.row(r);
            if (predicate(row)) {
                result.addRow(row);
            }
        }
        return result;
    };
    AnalyticsTable.prototype.distinctValues = function (field) {
        return new OrderedSet_1.OrderedSet(this.column(field));
    };
    AnalyticsTable.prototype.select = function (_fields) {
        if (!(_fields instanceof Array))
            return this.select([_fields]);
        var inFields = convertListOfFieldDescriptors(_fields);
        var columns = [];
        var resFields = [];
        var types = [];
        for (var i = 0; i < inFields.length; ++i) {
            var field = inFields[i];
            if (field.isStatic) {
                columns.push(this.column(field.name).slice());
                types.push(this.type(field.name));
                resFields.push(field.outputName);
            }
            else {
                resFields.push(field.outputName);
                var vector = [];
                for (var j = 0; j < this.count(); ++j) {
                    var value = field.getValue(this, j);
                    vector.push(value);
                }
                types.push(VectorOperations_1.vec.detectDataType(vector));
                columns.push(vector);
            }
        }
        return new AnalyticsTable({
            fields: resFields,
            types: types,
            columns: columns
        });
    };
    AnalyticsTable.prototype.splitColumn = function (field, groupField) {
        var categories = this.distinctValues(field).toArray();
        var fields = [groupField];
        var types = [this.type(groupField)];
        var valueFields = [];
        for (var c = 0; c < this.numFields(); ++c) {
            if (this.fieldset.get(c) !== field && this.fieldset.get(c) !== groupField) {
                valueFields.push(this.fieldset.get(c));
            }
        }
        for (var cat = 0; cat < categories.length; ++cat) {
            for (var f = 0; f < valueFields.length; ++f) {
                var newField = valueFields[f] + ' (' + categories[cat] + ')';
                fields.push(newField);
                types.push(this.type(valueFields[f]));
            }
        }
        var map = new HashMap_1.HashMap(false);
        for (var r = 0; r < this.count(); ++r) {
            var key = this.value(r, groupField);
            if (!map.contains(key)) {
                map.set(key, {});
            }
            var category = this.value(r, field);
            var obj = map.get(key);
            obj[category] = [];
            for (var f = 0; f < valueFields.length; ++f) {
                obj[category].push(this.value(r, valueFields[f]));
            }
        }
        var result = new AnalyticsTable({
            fields: fields,
            types: types
        });
        var keys = map.keys();
        for (var k = 0; k < keys.length; ++k) {
            var obj = map.get(keys[k]);
            var row = [keys[k]];
            for (var c = 0; c < categories.length; ++c) {
                if (!(categories[c] in obj)) {
                    for (var f = 0; f < valueFields.length; ++f) {
                        row.push(null);
                    }
                }
                else {
                    var values = obj[categories[c]];
                    for (var f = 0; f < valueFields.length; ++f) {
                        row.push(values[f]);
                    }
                }
            }
            result.addRow(row);
        }
        return result;
    };
    AnalyticsTable.prototype.sort = function (_field, asc) {
        if (asc === void 0) { asc = false; }
        var field = convertToFieldDescriptors(_field);
        var table = new AnalyticsTable({
            fields: this.fields(),
            types: this.types()
        });
        var rows = this.rows();
        var sortedRows = this.mergeSort(rows, field, asc);
        table.insert(sortedRows);
        return table;
    };
    AnalyticsTable.prototype.mergeSort = function (rows, field, asc) {
        if (rows.length < 2) {
            return rows;
        }
        var middle = Math.floor(rows.length / 2), left = rows.slice(0, middle), right = rows.slice(middle);
        return this.merge(this.mergeSort(left, field, asc), this.mergeSort(right, field, asc), field, asc);
    };
    AnalyticsTable.prototype.merge = function (left, right, field, asc) {
        var result = [], il = 0, ir = 0;
        while (il < left.length && ir < right.length) {
            var leftValue = field.getValueFromRow(this, left[il]);
            var rightValue = field.getValueFromRow(this, right[ir]);
            var comp = false;
            if (asc)
                comp = leftValue < rightValue;
            else
                comp = leftValue > rightValue;
            if (comp) {
                result.push(left[il++]);
            }
            else {
                result.push(right[ir++]);
            }
        }
        return result.concat(left.slice(il)).concat(right.slice(ir));
    };
    return AnalyticsTable;
}(CoreColumnTable_1.CoreColumnTable));
exports.AnalyticsTable = AnalyticsTable;
function convertListOfFieldDescriptors(vals) {
    var desc = [];
    for (var i = 0; i < vals.length; ++i)
        desc.push(convertToFieldDescriptors(vals[i]));
    return desc;
}
function convertToFieldDescriptors(val) {
    if (typeof val === 'string') {
        return new FieldDescriptor_1.FieldDescriptor(val);
    }
    return val;
}

},{"../data/HashMap":2,"../data/OrderedSet":3,"../data/VectorOperations":6,"./CoreColumnTable":12,"./FieldDescriptor":13,"./operators/agg":15}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("underscore");
var HashMap_1 = require("../data/HashMap");
var Vector_1 = require("../../src/data/Vector");
var Set_1 = require("../data/Set");
var VectorOperations_1 = require("../data/VectorOperations");
var StandardTypeEnv_1 = require("../types/StandardTypeEnv");
var CoreColumnTable = (function () {
    function CoreColumnTable(def) {
        this.typeEnv = StandardTypeEnv_1.StandardTypeEnv.getInstance();
        if (def instanceof CoreColumnTable) {
            this.initWithTable(def);
        }
        else if (typeof def === 'object') {
            this.initWithTableDef(def);
        }
        else {
            throw "Couldn't initialize CoreColumnTable with the given parameters!";
        }
    }
    CoreColumnTable.prototype.insert = function (rows) {
        if (rows instanceof Array) {
            for (var r = 0; r < rows.length; ++r) {
                if (rows[r] instanceof Array) {
                    this.addRow(rows[r]);
                }
                else {
                    throw "Row was not an array! Could not insert!";
                }
            }
        }
    };
    CoreColumnTable.prototype.count = function () {
        if (this.fieldset.size() > 0) {
            return this.column(this.fieldset.get(0)).length;
        }
        else {
            return 0;
        }
    };
    CoreColumnTable.prototype.addField = function (name, type) {
        type = (typeof type === 'undefined') ? StandardTypeEnv_1.StandardTypeEnv.kAny : type;
        if (!this.fieldset.contains(name)) {
            var data = [];
            for (var r = 0; r < this.count(); ++r) {
                data.push(null);
            }
            var vector = new Vector_1.Vector(type, data, this.typeEnv);
            this.fieldset.add(name);
            this.fielddata.set(name, {
                index: this.fieldset.size() - 1,
                name: name,
                type: type,
                vector: vector
            });
        }
    };
    CoreColumnTable.prototype.fields = function () {
        return this.fieldset.toArray();
    };
    CoreColumnTable.prototype.numFields = function () {
        return this.fieldset.size();
    };
    CoreColumnTable.prototype.hasField = function (field) {
        var data = this.getFieldData(field);
        return !!data;
    };
    CoreColumnTable.prototype.types = function () {
        var _this = this;
        return _.map(this.fields(), function (name) {
            return _this.fielddata.get(name).type;
        });
    };
    CoreColumnTable.prototype.type = function (field) {
        var data = this.getFieldData(field);
        if (data) {
            return data.type;
        }
        else {
            if (field === '$rownr')
                return StandardTypeEnv_1.StandardTypeEnv.kNumber;
            throw "Could not find column with id \"" + field + "\"!";
        }
    };
    CoreColumnTable.prototype.isEmpty = function () {
        return this.count() === 0;
    };
    CoreColumnTable.prototype.rows = function () {
        var rows = [];
        for (var r = 0; r < this.count(); ++r) {
            rows.push(this.row(r));
        }
        return rows;
    };
    CoreColumnTable.prototype.row = function (r) {
        var record = [];
        for (var _i = 0, _a = this.fieldset.toArray(); _i < _a.length; _i++) {
            var fieldName = _a[_i];
            record.push(this.value(r, fieldName));
        }
        return record;
    };
    CoreColumnTable.prototype.getFieldIndex = function (field) {
        return this.getFieldData(field).index;
    };
    CoreColumnTable.prototype.value = function (row, field) {
        return this.column(field)[row];
    };
    CoreColumnTable.prototype.setValue = function (row, field, value) {
        this.column(field)[row] = value;
    };
    CoreColumnTable.prototype.reserve = function (numRows) {
        if (this.numFields() === 0)
            throw "Can't reserve rows on a table without fields!";
        while (this.count() < numRows) {
            this.addRow([]);
        }
    };
    CoreColumnTable.prototype.column = function (field) {
        var data = this.getFieldData(field);
        if (data) {
            return data.vector.toArray();
        }
        else {
            if (field === '$rownr') {
                return this.createRowNrColumn();
            }
            throw "Could not find column with id \"" + field + "\"!";
        }
    };
    CoreColumnTable.prototype.columns = function () {
        var columns = [];
        for (var i = 0; i < this.fieldset.size(); ++i) {
            columns.push(this.column(this.fieldset.get(i)).slice());
        }
        return columns;
    };
    CoreColumnTable.prototype.detectTypes = function (setTypes) {
        var _this = this;
        var types = _.map(this.fieldset.toArray(), function (name, c) {
            return VectorOperations_1.vec.detectDataType(_this.fielddata.get(name).vector.toArray());
        });
        if (setTypes) {
            for (var i = 0; i < types.length; ++i) {
                this.setType(this.fieldset.get(i), types[i]);
            }
        }
        return types;
    };
    CoreColumnTable.prototype.setType = function (field, type) {
        var data = this.getFieldData(field);
        if (type !== data.type) {
            data.type = type;
            var old = data.vector;
            var newData = VectorOperations_1.vec.convertToType(old.toArray(), type);
            var vector = new Vector_1.Vector(type, newData, this.typeEnv);
            data.vector = vector;
        }
    };
    CoreColumnTable.prototype.getFieldData = function (field) {
        var name;
        if (typeof field === 'number') {
            name = this.fieldset.get(field);
        }
        else if (typeof field === 'string') {
            name = field;
        }
        return this.fielddata.get(name);
    };
    CoreColumnTable.prototype.getVector = function (field) {
        return this.getFieldData(field).vector;
    };
    CoreColumnTable.prototype.createRowNrColumn = function () {
        var vector = [];
        for (var r = 0; r < this.count(); ++r) {
            vector.push(r);
        }
        return vector;
    };
    CoreColumnTable.prototype.initWithTableDef = function (def) {
        this.fieldset = new Set_1.Set(def.fields);
        if (def.fields.length !== this.fieldset.size()) {
            throw "No duplicate field names allowed!";
        }
        if (def.types) {
            if (def.fields.length !== def.types.length) {
                throw "Number of fields and number of types do not match!";
            }
        }
        if (def.columns) {
            if (def.fields.length !== def.columns.length) {
                throw "Number of fields and number of supplied columns do not match!";
            }
        }
        this.fielddata = new HashMap_1.HashMap();
        for (var i = 0; i < def.fields.length; ++i) {
            var name_1 = def.fields[i];
            var type = (def.types) ? def.types[i] : StandardTypeEnv_1.StandardTypeEnv.kAny;
            var data = (def.columns) ? def.columns[i] : [];
            var vector = new Vector_1.Vector(type, data, this.typeEnv);
            this.fielddata.set(name_1, {
                index: i,
                name: name_1,
                type: type,
                vector: vector
            });
        }
    };
    CoreColumnTable.prototype.initWithTable = function (table) {
        this.initWithTableDef({
            fields: table.fields(),
            types: table.types(),
            columns: table.columns()
        });
    };
    CoreColumnTable.prototype.addRow = function (row) {
        if (row.length > this.numFields())
            throw "Error when inserting! Row has too many fields!";
        for (var c = 0; c < row.length; ++c) {
            if (row[c] === undefined)
                throw "Error when inserting! Can not insert undefined!";
            var colType = this.types()[c];
            if (row[c] === null ||
                (row[c] === '' && colType !== 'string')) {
                row[c] = null;
            }
            else {
                if (colType === 'any') {
                }
                else {
                    var res = this.typeEnv.convert(row[c], colType);
                    if (res.success) {
                        row[c] = res.result;
                    }
                    else {
                        throw "Error: Types don't match! " + row[c] + " is not " + colType;
                    }
                }
            }
        }
        for (var c = 0; c < row.length; ++c) {
            this.column(this.fieldset.get(c)).push(row[c]);
        }
        for (var c = row.length; c < this.numFields(); ++c) {
            this.column(this.fieldset.get(c)).push(null);
        }
    };
    return CoreColumnTable;
}());
exports.CoreColumnTable = CoreColumnTable;

},{"../../src/data/Vector":5,"../data/HashMap":2,"../data/Set":4,"../data/VectorOperations":6,"../types/StandardTypeEnv":16,"underscore":19}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FieldDescriptor = (function () {
    function FieldDescriptor(what, as) {
        if (typeof what === 'string') {
            this.isStatic = true;
            this.name = what;
            if (as)
                this.outputName = as;
            else
                this.outputName = what;
        }
        else {
            this.isStatic = false;
            this.fn = what;
            this.outputName = as;
        }
    }
    FieldDescriptor.prototype.getValue = function (table, rowNr) {
        if (this.isStatic)
            return table.value(rowNr, this.name);
        else {
            var row = table.row(rowNr);
            row.get = function (name) {
                return table.value(rowNr, name);
            };
            var value = this.fn(row);
            return value;
        }
    };
    FieldDescriptor.prototype.getValueFromRow = function (table, row) {
        if (this.isStatic) {
            var id = table.getFieldIndex(this.name);
            return row[id];
        }
        else {
            row.get = function (name) {
                var id = table.getFieldIndex(name);
                return row[id];
            };
            var value = this.fn(row);
            return value;
        }
    };
    return FieldDescriptor;
}());
exports.FieldDescriptor = FieldDescriptor;

},{}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AnalyticsTable_1 = require("./AnalyticsTable");
exports.AnalyticsTable = AnalyticsTable_1.AnalyticsTable;
var CoreColumnTable_1 = require("./CoreColumnTable");
exports.CoreColumnTable = CoreColumnTable_1.CoreColumnTable;
var FieldDescriptor_1 = require("./FieldDescriptor");
exports.FieldDescriptor = FieldDescriptor_1.FieldDescriptor;

},{"./AnalyticsTable":11,"./CoreColumnTable":12,"./FieldDescriptor":13}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var agg;
(function (agg) {
    function sum(targetField, outputName) {
        var aggf = function (rows, table) {
            var total = 0;
            var c = table.getFieldIndex(targetField);
            for (var r = 0; r < rows.length; ++r) {
                total += rows[r][c];
            }
            return total;
        };
        if (outputName)
            aggf.aggName = outputName;
        else
            aggf.aggName = 'SUM(' + targetField + ')';
        return aggf;
    }
    agg.sum = sum;
    function avg(targetField, outputName) {
        var aggf = function (rows, table) {
            var total = 0;
            var c = table.getFieldIndex(targetField);
            for (var r = 0; r < rows.length; ++r) {
                total += rows[r][c];
            }
            return (total / rows.length);
        };
        if (outputName)
            aggf.aggName = outputName;
        else
            aggf.aggName = 'AVG(' + targetField + ')';
        return aggf;
    }
    agg.avg = avg;
    function first(targetField, outputName) {
        var aggf = function (rows, table) {
            var c = table.getFieldIndex(targetField);
            return rows[0][c];
        };
        if (outputName)
            aggf.aggName = outputName;
        else
            aggf.aggName = 'AVG(' + targetField + ')';
        return aggf;
    }
    agg.first = first;
})(agg = exports.agg || (exports.agg = {}));

},{}],16:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var TypeEnvironment_1 = require("./TypeEnvironment");
var StandardTypeEnv = (function (_super) {
    __extends(StandardTypeEnv, _super);
    function StandardTypeEnv() {
        var _this = _super.call(this) || this;
        _this.addStringConverter(StandardTypeEnv.kBoolean, {
            regex: /^[Ff][Aa][Ll][Ss][Ee]$/,
            format: function (match) { return false; }
        });
        _this.addStringConverter(StandardTypeEnv.kBoolean, {
            regex: /^[Tt][Rr][Uu][Ee]$/,
            format: function (match) { return true; }
        });
        _this.addStringConverter(StandardTypeEnv.kNumber, {
            regex: /^\s*-?[0-9]+(?:\,[0-9][0-9][0-9])*(?:\.[0-9]+)?\s*$/,
            format: function (match) {
                return parseFloat(match[0].replace(',', ''));
            }
        });
        _this.addStringConverter(StandardTypeEnv.kNumber, {
            regex: /^\s*-?[0-9]+(?:\.[0-9][0-9][0-9])*(?:\,[0-9]+)?\s*$/,
            format: function (match) {
                return parseFloat(match[0].replace('.', '').replace(',', '.'));
            }
        });
        _this.addStringConverter(StandardTypeEnv.kDate, {
            regex: /^([0-9]?[0-9])\.([0-9]?[0-9])\.([0-9][0-9][0-9][0-9])$/,
            format: function (match) {
                var month = parseInt(match[2], 10) - 1;
                return new Date(Date.UTC(parseInt(match[3], 10), month, parseInt(match[1], 10)));
            }
        });
        _this.addStringConverter(StandardTypeEnv.kDate, {
            regex: /^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$/,
            format: function (match) {
                var month = parseInt(match[2], 10) - 1;
                return new Date(Date.UTC(parseInt(match[1], 10), month, parseInt(match[3], 10)));
            }
        });
        _this.addStringConverter(StandardTypeEnv.kDate, {
            regex: /^([0-9]?[0-9])\/([0-9]?[0-9])\/([0-9][0-9][0-9][0-9])$/,
            format: function (match) {
                var month = parseInt(match[1], 10) - 1;
                return new Date(Date.UTC(parseInt(match[3], 10), month, parseInt(match[2], 10)));
            }
        });
        _this.addStringConverter(StandardTypeEnv.kDate, {
            matchAndFormat: function (str) {
                if (/^([0-9][0-9][0-9][0-9])\-([0-9][0-9])\-([0-9][0-9])/.exec(str)) {
                    var date = new Date(str);
                    if (!isNaN(date.getTime()))
                        return date;
                }
                return false;
            }
        });
        _this.addTypeDetector('undefined', function (value) {
            return {
                type: StandardTypeEnv.kNull,
                value: null
            };
        });
        _this.addTypeDetector('object', function (value) {
            if (value === null) {
                return {
                    type: StandardTypeEnv.kNull,
                    value: null
                };
            }
        });
        _this.addTypeDetector('object', function (value) {
            if (value instanceof Date) {
                return {
                    type: StandardTypeEnv.kDate,
                    value: value
                };
            }
            return null;
        });
        return _this;
    }
    StandardTypeEnv.getInstance = function () {
        if (!this._instance) {
            this._instance = new StandardTypeEnv();
        }
        return this._instance;
    };
    StandardTypeEnv.kAny = 'any';
    StandardTypeEnv.kString = 'string';
    StandardTypeEnv.kNumber = 'number';
    StandardTypeEnv.kDate = 'date';
    StandardTypeEnv.kObject = 'object';
    StandardTypeEnv.kBoolean = 'boolean';
    StandardTypeEnv.kNull = 'null';
    StandardTypeEnv.kFunction = 'function';
    return StandardTypeEnv;
}(TypeEnvironment_1.TypeEnvironment));
exports.StandardTypeEnv = StandardTypeEnv;

},{"./TypeEnvironment":17}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var TypeEnvironment = (function () {
    function TypeEnvironment() {
        this.typeConverters = {};
        this.typeDetectors = {};
    }
    TypeEnvironment.prototype.convert = function (value, toType, forceFromType) {
        if (forceFromType === void 0) { forceFromType = null; }
        var fromType = forceFromType || this.detectDataType(value, false).type;
        if (fromType === toType) {
            return {
                success: true,
                resultType: toType,
                result: value
            };
        }
        var converters = this.typeConverters[fromType] || [];
        converters = converters.sort(function (a, b) { return a.priority - b.priority; });
        converters = converters.filter(function (conv) { return conv.toType === toType; });
        for (var _i = 0, converters_1 = converters; _i < converters_1.length; _i++) {
            var conv = converters_1[_i];
            var res = conv.converter(value);
            if (res.success) {
                return res;
            }
        }
        return {
            success: false
        };
    };
    TypeEnvironment.prototype.autoConvertString = function (value) {
        var converters = this.typeConverters['string'];
        for (var _i = 0, converters_2 = converters; _i < converters_2.length; _i++) {
            var conv = converters_2[_i];
            var res = conv.converter(value);
            if (res.success) {
                return res;
            }
        }
        return {
            success: false
        };
    };
    TypeEnvironment.prototype.addTypeConverter = function (fromType, conv) {
        if (!(fromType in this.typeConverters)) {
            this.typeConverters[fromType] = [];
        }
        this.typeConverters[fromType].push(conv);
    };
    TypeEnvironment.prototype.addTypeDetector = function (jsType, detector) {
        if (!(jsType in this.typeDetectors)) {
            this.typeDetectors[jsType] = [];
        }
        this.typeDetectors[jsType].push(detector);
    };
    TypeEnvironment.prototype.addStringConverter = function (toType, conv) {
        this.addTypeConverter('string', {
            fromType: 'string',
            toType: toType,
            priority: conv.priority || 0,
            converter: function (value) {
                if (conv.regex) {
                    var match = conv.regex.exec(value);
                    if (match !== null) {
                        var newValue = conv.format(match);
                        return {
                            success: true,
                            resultType: toType,
                            result: newValue
                        };
                    }
                }
                else if (conv.matchAndFormat) {
                    var res = conv.matchAndFormat(value);
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
    };
    TypeEnvironment.prototype.detectDataType = function (value, tryParseStrings) {
        if (tryParseStrings === void 0) { tryParseStrings = true; }
        var jsType = typeof value;
        var detectors = this.typeDetectors[jsType] || [];
        for (var _i = 0, detectors_1 = detectors; _i < detectors_1.length; _i++) {
            var fn = detectors_1[_i];
            var res = fn(value);
            if (res) {
                return res;
            }
        }
        if (jsType === 'string' && tryParseStrings) {
            var res = this.autoConvertString(value);
            if (res.success) {
                return {
                    type: res.resultType,
                    value: res.result
                };
            }
        }
        return {
            type: jsType,
            value: value
        };
    };
    return TypeEnvironment;
}());
exports.TypeEnvironment = TypeEnvironment;

},{}],18:[function(require,module,exports){
/*!
	Papa Parse
	v4.3.6
	https://github.com/mholt/PapaParse
	License: MIT
*/
(function(root, factory)
{
	if (typeof define === 'function' && define.amd)
	{
		// AMD. Register as an anonymous module.
		define([], factory);
	}
	else if (typeof module === 'object' && typeof exports !== 'undefined')
	{
		// Node. Does not work with strict CommonJS, but
		// only CommonJS-like environments that support module.exports,
		// like Node.
		module.exports = factory();
	}
	else
	{
		// Browser globals (root is window)
		root.Papa = factory();
	}
}(this, function()
{
	'use strict';

	var global = (function () {
		// alternative method, similar to `Function('return this')()`
		// but without using `eval` (which is disabled when
		// using Content Security Policy).

		if (typeof self !== 'undefined') { return self; }
		if (typeof window !== 'undefined') { return window; }
		if (typeof global !== 'undefined') { return global; }

		// When running tests none of the above have been defined
		return {};
	})();


	var IS_WORKER = !global.document && !!global.postMessage,
		IS_PAPA_WORKER = IS_WORKER && /(\?|&)papaworker(=|&|$)/.test(global.location.search),
		LOADED_SYNC = false, AUTO_SCRIPT_PATH;
	var workers = {}, workerIdCounter = 0;

	var Papa = {};

	Papa.parse = CsvToJson;
	Papa.unparse = JsonToCsv;

	Papa.RECORD_SEP = String.fromCharCode(30);
	Papa.UNIT_SEP = String.fromCharCode(31);
	Papa.BYTE_ORDER_MARK = '\ufeff';
	Papa.BAD_DELIMITERS = ['\r', '\n', '"', Papa.BYTE_ORDER_MARK];
	Papa.WORKERS_SUPPORTED = !IS_WORKER && !!global.Worker;
	Papa.SCRIPT_PATH = null;	// Must be set by your code if you use workers and this lib is loaded asynchronously

	// Configurable chunk sizes for local and remote files, respectively
	Papa.LocalChunkSize = 1024 * 1024 * 10;	// 10 MB
	Papa.RemoteChunkSize = 1024 * 1024 * 5;	// 5 MB
	Papa.DefaultDelimiter = ',';			// Used if not specified and detection fails

	// Exposed for testing and development only
	Papa.Parser = Parser;
	Papa.ParserHandle = ParserHandle;
	Papa.NetworkStreamer = NetworkStreamer;
	Papa.FileStreamer = FileStreamer;
	Papa.StringStreamer = StringStreamer;
	Papa.ReadableStreamStreamer = ReadableStreamStreamer;

	if (global.jQuery)
	{
		var $ = global.jQuery;
		$.fn.parse = function(options)
		{
			var config = options.config || {};
			var queue = [];

			this.each(function(idx)
			{
				var supported = $(this).prop('tagName').toUpperCase() === 'INPUT'
								&& $(this).attr('type').toLowerCase() === 'file'
								&& global.FileReader;

				if (!supported || !this.files || this.files.length === 0)
					return true;	// continue to next input element

				for (var i = 0; i < this.files.length; i++)
				{
					queue.push({
						file: this.files[i],
						inputElem: this,
						instanceConfig: $.extend({}, config)
					});
				}
			});

			parseNextFile();	// begin parsing
			return this;		// maintains chainability


			function parseNextFile()
			{
				if (queue.length === 0)
				{
					if (isFunction(options.complete))
						options.complete();
					return;
				}

				var f = queue[0];

				if (isFunction(options.before))
				{
					var returned = options.before(f.file, f.inputElem);

					if (typeof returned === 'object')
					{
						if (returned.action === 'abort')
						{
							error('AbortError', f.file, f.inputElem, returned.reason);
							return;	// Aborts all queued files immediately
						}
						else if (returned.action === 'skip')
						{
							fileComplete();	// parse the next file in the queue, if any
							return;
						}
						else if (typeof returned.config === 'object')
							f.instanceConfig = $.extend(f.instanceConfig, returned.config);
					}
					else if (returned === 'skip')
					{
						fileComplete();	// parse the next file in the queue, if any
						return;
					}
				}

				// Wrap up the user's complete callback, if any, so that ours also gets executed
				var userCompleteFunc = f.instanceConfig.complete;
				f.instanceConfig.complete = function(results)
				{
					if (isFunction(userCompleteFunc))
						userCompleteFunc(results, f.file, f.inputElem);
					fileComplete();
				};

				Papa.parse(f.file, f.instanceConfig);
			}

			function error(name, file, elem, reason)
			{
				if (isFunction(options.error))
					options.error({name: name}, file, elem, reason);
			}

			function fileComplete()
			{
				queue.splice(0, 1);
				parseNextFile();
			}
		}
	}


	if (IS_PAPA_WORKER)
	{
		global.onmessage = workerThreadReceivedMessage;
	}
	else if (Papa.WORKERS_SUPPORTED)
	{
		AUTO_SCRIPT_PATH = getScriptPath();

		// Check if the script was loaded synchronously
		if (!document.body)
		{
			// Body doesn't exist yet, must be synchronous
			LOADED_SYNC = true;
		}
		else
		{
			document.addEventListener('DOMContentLoaded', function () {
				LOADED_SYNC = true;
			}, true);
		}
	}




	function CsvToJson(_input, _config)
	{
		_config = _config || {};
		var dynamicTyping = _config.dynamicTyping || false;
		if (isFunction(dynamicTyping)) {
			_config.dynamicTypingFunction = dynamicTyping;
			// Will be filled on first row call
			dynamicTyping = {};
		}
		_config.dynamicTyping = dynamicTyping;

		if (_config.worker && Papa.WORKERS_SUPPORTED)
		{
			var w = newWorker();

			w.userStep = _config.step;
			w.userChunk = _config.chunk;
			w.userComplete = _config.complete;
			w.userError = _config.error;

			_config.step = isFunction(_config.step);
			_config.chunk = isFunction(_config.chunk);
			_config.complete = isFunction(_config.complete);
			_config.error = isFunction(_config.error);
			delete _config.worker;	// prevent infinite loop

			w.postMessage({
				input: _input,
				config: _config,
				workerId: w.id
			});

			return;
		}

		var streamer = null;
		if (typeof _input === 'string')
		{
			if (_config.download)
				streamer = new NetworkStreamer(_config);
			else
				streamer = new StringStreamer(_config);
		}
		else if (_input.readable === true && isFunction(_input.read) && isFunction(_input.on))
		{
			streamer = new ReadableStreamStreamer(_config);
		}
		else if ((global.File && _input instanceof File) || _input instanceof Object)	// ...Safari. (see issue #106)
			streamer = new FileStreamer(_config);

		return streamer.stream(_input);
	}






	function JsonToCsv(_input, _config)
	{
		var _output = '';
		var _fields = [];

		// Default configuration

		/** whether to surround every datum with quotes */
		var _quotes = false;

		/** whether to write headers */
		var _writeHeader = true;

		/** delimiting character */
		var _delimiter = ',';

		/** newline character(s) */
		var _newline = '\r\n';

		/** quote character */
		var _quoteChar = '"';

		unpackConfig();

		var quoteCharRegex = new RegExp(_quoteChar, 'g');

		if (typeof _input === 'string')
			_input = JSON.parse(_input);

		if (_input instanceof Array)
		{
			if (!_input.length || _input[0] instanceof Array)
				return serialize(null, _input);
			else if (typeof _input[0] === 'object')
				return serialize(objectKeys(_input[0]), _input);
		}
		else if (typeof _input === 'object')
		{
			if (typeof _input.data === 'string')
				_input.data = JSON.parse(_input.data);

			if (_input.data instanceof Array)
			{
				if (!_input.fields)
					_input.fields =  _input.meta && _input.meta.fields;

				if (!_input.fields)
					_input.fields =  _input.data[0] instanceof Array
									? _input.fields
									: objectKeys(_input.data[0]);

				if (!(_input.data[0] instanceof Array) && typeof _input.data[0] !== 'object')
					_input.data = [_input.data];	// handles input like [1,2,3] or ['asdf']
			}

			return serialize(_input.fields || [], _input.data || []);
		}

		// Default (any valid paths should return before this)
		throw 'exception: Unable to serialize unrecognized input';


		function unpackConfig()
		{
			if (typeof _config !== 'object')
				return;

			if (typeof _config.delimiter === 'string'
				&& _config.delimiter.length === 1
				&& Papa.BAD_DELIMITERS.indexOf(_config.delimiter) === -1)
			{
				_delimiter = _config.delimiter;
			}

			if (typeof _config.quotes === 'boolean'
				|| _config.quotes instanceof Array)
				_quotes = _config.quotes;

			if (typeof _config.newline === 'string')
				_newline = _config.newline;

			if (typeof _config.quoteChar === 'string')
				_quoteChar = _config.quoteChar;

			if (typeof _config.header === 'boolean')
				_writeHeader = _config.header;
		}


		/** Turns an object's keys into an array */
		function objectKeys(obj)
		{
			if (typeof obj !== 'object')
				return [];
			var keys = [];
			for (var key in obj)
				keys.push(key);
			return keys;
		}

		/** The double for loop that iterates the data and writes out a CSV string including header row */
		function serialize(fields, data)
		{
			var csv = '';

			if (typeof fields === 'string')
				fields = JSON.parse(fields);
			if (typeof data === 'string')
				data = JSON.parse(data);

			var hasHeader = fields instanceof Array && fields.length > 0;
			var dataKeyedByField = !(data[0] instanceof Array);

			// If there a header row, write it first
			if (hasHeader && _writeHeader)
			{
				for (var i = 0; i < fields.length; i++)
				{
					if (i > 0)
						csv += _delimiter;
					csv += safe(fields[i], i);
				}
				if (data.length > 0)
					csv += _newline;
			}

			// Then write out the data
			for (var row = 0; row < data.length; row++)
			{
				var maxCol = hasHeader ? fields.length : data[row].length;

				for (var col = 0; col < maxCol; col++)
				{
					if (col > 0)
						csv += _delimiter;
					var colIdx = hasHeader && dataKeyedByField ? fields[col] : col;
					csv += safe(data[row][colIdx], col);
				}

				if (row < data.length - 1)
					csv += _newline;
			}

			return csv;
		}

		/** Encloses a value around quotes if needed (makes a value safe for CSV insertion) */
		function safe(str, col)
		{
			if (typeof str === 'undefined' || str === null)
				return '';

			str = str.toString().replace(quoteCharRegex, _quoteChar+_quoteChar);

			var needsQuotes = (typeof _quotes === 'boolean' && _quotes)
							|| (_quotes instanceof Array && _quotes[col])
							|| hasAny(str, Papa.BAD_DELIMITERS)
							|| str.indexOf(_delimiter) > -1
							|| str.charAt(0) === ' '
							|| str.charAt(str.length - 1) === ' ';

			return needsQuotes ? _quoteChar + str + _quoteChar : str;
		}

		function hasAny(str, substrings)
		{
			for (var i = 0; i < substrings.length; i++)
				if (str.indexOf(substrings[i]) > -1)
					return true;
			return false;
		}
	}

	/** ChunkStreamer is the base prototype for various streamer implementations. */
	function ChunkStreamer(config)
	{
		this._handle = null;
		this._paused = false;
		this._finished = false;
		this._input = null;
		this._baseIndex = 0;
		this._partialLine = '';
		this._rowCount = 0;
		this._start = 0;
		this._nextChunk = null;
		this.isFirstChunk = true;
		this._completeResults = {
			data: [],
			errors: [],
			meta: {}
		};
		replaceConfig.call(this, config);

		this.parseChunk = function(chunk)
		{
			// First chunk pre-processing
			if (this.isFirstChunk && isFunction(this._config.beforeFirstChunk))
			{
				var modifiedChunk = this._config.beforeFirstChunk(chunk);
				if (modifiedChunk !== undefined)
					chunk = modifiedChunk;
			}
			this.isFirstChunk = false;

			// Rejoin the line we likely just split in two by chunking the file
			var aggregate = this._partialLine + chunk;
			this._partialLine = '';

			var results = this._handle.parse(aggregate, this._baseIndex, !this._finished);

			if (this._handle.paused() || this._handle.aborted())
				return;

			var lastIndex = results.meta.cursor;

			if (!this._finished)
			{
				this._partialLine = aggregate.substring(lastIndex - this._baseIndex);
				this._baseIndex = lastIndex;
			}

			if (results && results.data)
				this._rowCount += results.data.length;

			var finishedIncludingPreview = this._finished || (this._config.preview && this._rowCount >= this._config.preview);

			if (IS_PAPA_WORKER)
			{
				global.postMessage({
					results: results,
					workerId: Papa.WORKER_ID,
					finished: finishedIncludingPreview
				});
			}
			else if (isFunction(this._config.chunk))
			{
				this._config.chunk(results, this._handle);
				if (this._paused)
					return;
				results = undefined;
				this._completeResults = undefined;
			}

			if (!this._config.step && !this._config.chunk) {
				this._completeResults.data = this._completeResults.data.concat(results.data);
				this._completeResults.errors = this._completeResults.errors.concat(results.errors);
				this._completeResults.meta = results.meta;
			}

			if (finishedIncludingPreview && isFunction(this._config.complete) && (!results || !results.meta.aborted))
				this._config.complete(this._completeResults, this._input);

			if (!finishedIncludingPreview && (!results || !results.meta.paused))
				this._nextChunk();

			return results;
		};

		this._sendError = function(error)
		{
			if (isFunction(this._config.error))
				this._config.error(error);
			else if (IS_PAPA_WORKER && this._config.error)
			{
				global.postMessage({
					workerId: Papa.WORKER_ID,
					error: error,
					finished: false
				});
			}
		};

		function replaceConfig(config)
		{
			// Deep-copy the config so we can edit it
			var configCopy = copy(config);
			configCopy.chunkSize = parseInt(configCopy.chunkSize);	// parseInt VERY important so we don't concatenate strings!
			if (!config.step && !config.chunk)
				configCopy.chunkSize = null;  // disable Range header if not streaming; bad values break IIS - see issue #196
			this._handle = new ParserHandle(configCopy);
			this._handle.streamer = this;
			this._config = configCopy;	// persist the copy to the caller
		}
	}


	function NetworkStreamer(config)
	{
		config = config || {};
		if (!config.chunkSize)
			config.chunkSize = Papa.RemoteChunkSize;
		ChunkStreamer.call(this, config);

		var xhr;

		if (IS_WORKER)
		{
			this._nextChunk = function()
			{
				this._readChunk();
				this._chunkLoaded();
			};
		}
		else
		{
			this._nextChunk = function()
			{
				this._readChunk();
			};
		}

		this.stream = function(url)
		{
			this._input = url;
			this._nextChunk();	// Starts streaming
		};

		this._readChunk = function()
		{
			if (this._finished)
			{
				this._chunkLoaded();
				return;
			}

			xhr = new XMLHttpRequest();

			if (this._config.withCredentials)
			{
				xhr.withCredentials = this._config.withCredentials;
			}

			if (!IS_WORKER)
			{
				xhr.onload = bindFunction(this._chunkLoaded, this);
				xhr.onerror = bindFunction(this._chunkError, this);
			}

			xhr.open('GET', this._input, !IS_WORKER);
			// Headers can only be set when once the request state is OPENED
			if (this._config.downloadRequestHeaders)
			{
				var headers = this._config.downloadRequestHeaders;

				for (var headerName in headers)
				{
					xhr.setRequestHeader(headerName, headers[headerName]);
				}
			}

			if (this._config.chunkSize)
			{
				var end = this._start + this._config.chunkSize - 1;	// minus one because byte range is inclusive
				xhr.setRequestHeader('Range', 'bytes='+this._start+'-'+end);
				xhr.setRequestHeader('If-None-Match', 'webkit-no-cache'); // https://bugs.webkit.org/show_bug.cgi?id=82672
			}

			try {
				xhr.send();
			}
			catch (err) {
				this._chunkError(err.message);
			}

			if (IS_WORKER && xhr.status === 0)
				this._chunkError();
			else
				this._start += this._config.chunkSize;
		}

		this._chunkLoaded = function()
		{
			if (xhr.readyState != 4)
				return;

			if (xhr.status < 200 || xhr.status >= 400)
			{
				this._chunkError();
				return;
			}

			this._finished = !this._config.chunkSize || this._start > getFileSize(xhr);
			this.parseChunk(xhr.responseText);
		}

		this._chunkError = function(errorMessage)
		{
			var errorText = xhr.statusText || errorMessage;
			this._sendError(errorText);
		}

		function getFileSize(xhr)
		{
			var contentRange = xhr.getResponseHeader('Content-Range');
			if (contentRange === null) { // no content range, then finish!
					return -1;
					}
			return parseInt(contentRange.substr(contentRange.lastIndexOf('/') + 1));
		}
	}
	NetworkStreamer.prototype = Object.create(ChunkStreamer.prototype);
	NetworkStreamer.prototype.constructor = NetworkStreamer;


	function FileStreamer(config)
	{
		config = config || {};
		if (!config.chunkSize)
			config.chunkSize = Papa.LocalChunkSize;
		ChunkStreamer.call(this, config);

		var reader, slice;

		// FileReader is better than FileReaderSync (even in worker) - see http://stackoverflow.com/q/24708649/1048862
		// But Firefox is a pill, too - see issue #76: https://github.com/mholt/PapaParse/issues/76
		var usingAsyncReader = typeof FileReader !== 'undefined';	// Safari doesn't consider it a function - see issue #105

		this.stream = function(file)
		{
			this._input = file;
			slice = file.slice || file.webkitSlice || file.mozSlice;

			if (usingAsyncReader)
			{
				reader = new FileReader();		// Preferred method of reading files, even in workers
				reader.onload = bindFunction(this._chunkLoaded, this);
				reader.onerror = bindFunction(this._chunkError, this);
			}
			else
				reader = new FileReaderSync();	// Hack for running in a web worker in Firefox

			this._nextChunk();	// Starts streaming
		};

		this._nextChunk = function()
		{
			if (!this._finished && (!this._config.preview || this._rowCount < this._config.preview))
				this._readChunk();
		}

		this._readChunk = function()
		{
			var input = this._input;
			if (this._config.chunkSize)
			{
				var end = Math.min(this._start + this._config.chunkSize, this._input.size);
				input = slice.call(input, this._start, end);
			}
			var txt = reader.readAsText(input, this._config.encoding);
			if (!usingAsyncReader)
				this._chunkLoaded({ target: { result: txt } });	// mimic the async signature
		}

		this._chunkLoaded = function(event)
		{
			// Very important to increment start each time before handling results
			this._start += this._config.chunkSize;
			this._finished = !this._config.chunkSize || this._start >= this._input.size;
			this.parseChunk(event.target.result);
		}

		this._chunkError = function()
		{
			this._sendError(reader.error);
		}

	}
	FileStreamer.prototype = Object.create(ChunkStreamer.prototype);
	FileStreamer.prototype.constructor = FileStreamer;


	function StringStreamer(config)
	{
		config = config || {};
		ChunkStreamer.call(this, config);

		var string;
		var remaining;
		this.stream = function(s)
		{
			string = s;
			remaining = s;
			return this._nextChunk();
		}
		this._nextChunk = function()
		{
			if (this._finished) return;
			var size = this._config.chunkSize;
			var chunk = size ? remaining.substr(0, size) : remaining;
			remaining = size ? remaining.substr(size) : '';
			this._finished = !remaining;
			return this.parseChunk(chunk);
		}
	}
	StringStreamer.prototype = Object.create(StringStreamer.prototype);
	StringStreamer.prototype.constructor = StringStreamer;


	function ReadableStreamStreamer(config)
	{
		config = config || {};

		ChunkStreamer.call(this, config);

		var queue = [];
		var parseOnData = true;

		this.stream = function(stream)
		{
			this._input = stream;

			this._input.on('data', this._streamData);
			this._input.on('end', this._streamEnd);
			this._input.on('error', this._streamError);
		}

		this._nextChunk = function()
		{
			if (queue.length)
			{
				this.parseChunk(queue.shift());
			}
			else
			{
				parseOnData = true;
			}
		}

		this._streamData = bindFunction(function(chunk)
		{
			try
			{
				queue.push(typeof chunk === 'string' ? chunk : chunk.toString(this._config.encoding));

				if (parseOnData)
				{
					parseOnData = false;
					this.parseChunk(queue.shift());
				}
			}
			catch (error)
			{
				this._streamError(error);
			}
		}, this);

		this._streamError = bindFunction(function(error)
		{
			this._streamCleanUp();
			this._sendError(error.message);
		}, this);

		this._streamEnd = bindFunction(function()
		{
			this._streamCleanUp();
			this._finished = true;
			this._streamData('');
		}, this);

		this._streamCleanUp = bindFunction(function()
		{
			this._input.removeListener('data', this._streamData);
			this._input.removeListener('end', this._streamEnd);
			this._input.removeListener('error', this._streamError);
		}, this);
	}
	ReadableStreamStreamer.prototype = Object.create(ChunkStreamer.prototype);
	ReadableStreamStreamer.prototype.constructor = ReadableStreamStreamer;


	// Use one ParserHandle per entire CSV file or string
	function ParserHandle(_config)
	{
		// One goal is to minimize the use of regular expressions...
		var FLOAT = /^\s*-?(\d*\.?\d+|\d+\.?\d*)(e[-+]?\d+)?\s*$/i;

		var self = this;
		var _stepCounter = 0;	// Number of times step was called (number of rows parsed)
		var _input;				// The input being parsed
		var _parser;			// The core parser being used
		var _paused = false;	// Whether we are paused or not
		var _aborted = false;	// Whether the parser has aborted or not
		var _delimiterError;	// Temporary state between delimiter detection and processing results
		var _fields = [];		// Fields are from the header row of the input, if there is one
		var _results = {		// The last results returned from the parser
			data: [],
			errors: [],
			meta: {}
		};

		if (isFunction(_config.step))
		{
			var userStep = _config.step;
			_config.step = function(results)
			{
				_results = results;

				if (needsHeaderRow())
					processResults();
				else	// only call user's step function after header row
				{
					processResults();

					// It's possbile that this line was empty and there's no row here after all
					if (_results.data.length === 0)
						return;

					_stepCounter += results.data.length;
					if (_config.preview && _stepCounter > _config.preview)
						_parser.abort();
					else
						userStep(_results, self);
				}
			};
		}

		/**
		 * Parses input. Most users won't need, and shouldn't mess with, the baseIndex
		 * and ignoreLastRow parameters. They are used by streamers (wrapper functions)
		 * when an input comes in multiple chunks, like from a file.
		 */
		this.parse = function(input, baseIndex, ignoreLastRow)
		{
			if (!_config.newline)
				_config.newline = guessLineEndings(input);

			_delimiterError = false;
			if (!_config.delimiter)
			{
				var delimGuess = guessDelimiter(input, _config.newline, _config.skipEmptyLines);
				if (delimGuess.successful)
					_config.delimiter = delimGuess.bestDelimiter;
				else
				{
					_delimiterError = true;	// add error after parsing (otherwise it would be overwritten)
					_config.delimiter = Papa.DefaultDelimiter;
				}
				_results.meta.delimiter = _config.delimiter;
			}
			else if(isFunction(_config.delimiter))
			{
				_config.delimiter = _config.delimiter(input);
				_results.meta.delimiter = _config.delimiter;
			}

			var parserConfig = copy(_config);
			if (_config.preview && _config.header)
				parserConfig.preview++;	// to compensate for header row

			_input = input;
			_parser = new Parser(parserConfig);
			_results = _parser.parse(_input, baseIndex, ignoreLastRow);
			processResults();
			return _paused ? { meta: { paused: true } } : (_results || { meta: { paused: false } });
		};

		this.paused = function()
		{
			return _paused;
		};

		this.pause = function()
		{
			_paused = true;
			_parser.abort();
			_input = _input.substr(_parser.getCharIndex());
		};

		this.resume = function()
		{
			_paused = false;
			self.streamer.parseChunk(_input);
		};

		this.aborted = function ()
		{
			return _aborted;
		};

		this.abort = function()
		{
			_aborted = true;
			_parser.abort();
			_results.meta.aborted = true;
			if (isFunction(_config.complete))
				_config.complete(_results);
			_input = '';
		};

		function processResults()
		{
			if (_results && _delimiterError)
			{
				addError('Delimiter', 'UndetectableDelimiter', 'Unable to auto-detect delimiting character; defaulted to \''+Papa.DefaultDelimiter+'\'');
				_delimiterError = false;
			}

			if (_config.skipEmptyLines)
			{
				for (var i = 0; i < _results.data.length; i++)
					if (_results.data[i].length === 1 && _results.data[i][0] === '')
						_results.data.splice(i--, 1);
			}

			if (needsHeaderRow())
				fillHeaderFields();

			return applyHeaderAndDynamicTyping();
		}

		function needsHeaderRow()
		{
			return _config.header && _fields.length === 0;
		}

		function fillHeaderFields()
		{
			if (!_results)
				return;
			for (var i = 0; needsHeaderRow() && i < _results.data.length; i++)
				for (var j = 0; j < _results.data[i].length; j++)
					_fields.push(_results.data[i][j]);
			_results.data.splice(0, 1);
		}

		function shouldApplyDynamicTyping(field) {
			// Cache function values to avoid calling it for each row
			if (_config.dynamicTypingFunction && _config.dynamicTyping[field] === undefined) {
				_config.dynamicTyping[field] = _config.dynamicTypingFunction(field);
			}
			return (_config.dynamicTyping[field] || _config.dynamicTyping) === true
		}

		function parseDynamic(field, value)
		{
			if (shouldApplyDynamicTyping(field))
			{
				if (value === 'true' || value === 'TRUE')
					return true;
				else if (value === 'false' || value === 'FALSE')
					return false;
				else
					return tryParseFloat(value);
			}
			return value;
		}

		function applyHeaderAndDynamicTyping()
		{
			if (!_results || (!_config.header && !_config.dynamicTyping))
				return _results;

			for (var i = 0; i < _results.data.length; i++)
			{
				var row = _config.header ? {} : [];

				for (var j = 0; j < _results.data[i].length; j++)
				{
					var field = j;
					var value = _results.data[i][j];

					if (_config.header)
						field = j >= _fields.length ? '__parsed_extra' : _fields[j];

					value = parseDynamic(field, value);

					if (field === '__parsed_extra')
					{
						row[field] = row[field] || [];
						row[field].push(value);
					}
					else
						row[field] = value;
				}

				_results.data[i] = row;

				if (_config.header)
				{
					if (j > _fields.length)
						addError('FieldMismatch', 'TooManyFields', 'Too many fields: expected ' + _fields.length + ' fields but parsed ' + j, i);
					else if (j < _fields.length)
						addError('FieldMismatch', 'TooFewFields', 'Too few fields: expected ' + _fields.length + ' fields but parsed ' + j, i);
				}
			}

			if (_config.header && _results.meta)
				_results.meta.fields = _fields;
			return _results;
		}

		function guessDelimiter(input, newline, skipEmptyLines)
		{
			var delimChoices = [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP];
			var bestDelim, bestDelta, fieldCountPrevRow;

			for (var i = 0; i < delimChoices.length; i++)
			{
				var delim = delimChoices[i];
				var delta = 0, avgFieldCount = 0, emptyLinesCount = 0;
				fieldCountPrevRow = undefined;

				var preview = new Parser({
					delimiter: delim,
					newline: newline,
					preview: 10
				}).parse(input);

				for (var j = 0; j < preview.data.length; j++)
				{
					if (skipEmptyLines && preview.data[j].length === 1 && preview.data[j][0].length === 0) {
						emptyLinesCount++
						continue
					}
					var fieldCount = preview.data[j].length;
					avgFieldCount += fieldCount;

					if (typeof fieldCountPrevRow === 'undefined')
					{
						fieldCountPrevRow = fieldCount;
						continue;
					}
					else if (fieldCount > 1)
					{
						delta += Math.abs(fieldCount - fieldCountPrevRow);
						fieldCountPrevRow = fieldCount;
					}
				}

				if (preview.data.length > 0)
					avgFieldCount /= (preview.data.length - emptyLinesCount);

				if ((typeof bestDelta === 'undefined' || delta < bestDelta)
					&& avgFieldCount > 1.99)
				{
					bestDelta = delta;
					bestDelim = delim;
				}
			}

			_config.delimiter = bestDelim;

			return {
				successful: !!bestDelim,
				bestDelimiter: bestDelim
			}
		}

		function guessLineEndings(input)
		{
			input = input.substr(0, 1024*1024);	// max length 1 MB

			var r = input.split('\r');

			var n = input.split('\n');

			var nAppearsFirst = (n.length > 1 && n[0].length < r[0].length);

			if (r.length === 1 || nAppearsFirst)
				return '\n';

			var numWithN = 0;
			for (var i = 0; i < r.length; i++)
			{
				if (r[i][0] === '\n')
					numWithN++;
			}

			return numWithN >= r.length / 2 ? '\r\n' : '\r';
		}

		function tryParseFloat(val)
		{
			var isNumber = FLOAT.test(val);
			return isNumber ? parseFloat(val) : val;
		}

		function addError(type, code, msg, row)
		{
			_results.errors.push({
				type: type,
				code: code,
				message: msg,
				row: row
			});
		}
	}





	/** The core parser implements speedy and correct CSV parsing */
	function Parser(config)
	{
		// Unpack the config object
		config = config || {};
		var delim = config.delimiter;
		var newline = config.newline;
		var comments = config.comments;
		var step = config.step;
		var preview = config.preview;
		var fastMode = config.fastMode;
		var quoteChar = config.quoteChar || '"';

		// Delimiter must be valid
		if (typeof delim !== 'string'
			|| Papa.BAD_DELIMITERS.indexOf(delim) > -1)
			delim = ',';

		// Comment character must be valid
		if (comments === delim)
			throw 'Comment character same as delimiter';
		else if (comments === true)
			comments = '#';
		else if (typeof comments !== 'string'
			|| Papa.BAD_DELIMITERS.indexOf(comments) > -1)
			comments = false;

		// Newline must be valid: \r, \n, or \r\n
		if (newline != '\n' && newline != '\r' && newline != '\r\n')
			newline = '\n';

		// We're gonna need these at the Parser scope
		var cursor = 0;
		var aborted = false;

		this.parse = function(input, baseIndex, ignoreLastRow)
		{
			// For some reason, in Chrome, this speeds things up (!?)
			if (typeof input !== 'string')
				throw 'Input must be a string';

			// We don't need to compute some of these every time parse() is called,
			// but having them in a more local scope seems to perform better
			var inputLen = input.length,
				delimLen = delim.length,
				newlineLen = newline.length,
				commentsLen = comments.length;
			var stepIsFunction = isFunction(step);

			// Establish starting state
			cursor = 0;
			var data = [], errors = [], row = [], lastCursor = 0;

			if (!input)
				return returnable();

			if (fastMode || (fastMode !== false && input.indexOf(quoteChar) === -1))
			{
				var rows = input.split(newline);
				for (var i = 0; i < rows.length; i++)
				{
					var row = rows[i];
					cursor += row.length;
					if (i !== rows.length - 1)
						cursor += newline.length;
					else if (ignoreLastRow)
						return returnable();
					if (comments && row.substr(0, commentsLen) === comments)
						continue;
					if (stepIsFunction)
					{
						data = [];
						pushRow(row.split(delim));
						doStep();
						if (aborted)
							return returnable();
					}
					else
						pushRow(row.split(delim));
					if (preview && i >= preview)
					{
						data = data.slice(0, preview);
						return returnable(true);
					}
				}
				return returnable();
			}

			var nextDelim = input.indexOf(delim, cursor);
			var nextNewline = input.indexOf(newline, cursor);
			var quoteCharRegex = new RegExp(quoteChar+quoteChar, 'g');

			// Parser loop
			for (;;)
			{
				// Field has opening quote
				if (input[cursor] === quoteChar)
				{
					// Start our search for the closing quote where the cursor is
					var quoteSearch = cursor;

					// Skip the opening quote
					cursor++;

					for (;;)
					{
						// Find closing quote
						var quoteSearch = input.indexOf(quoteChar, quoteSearch+1);

						//No other quotes are found - no other delimiters
						if (quoteSearch === -1)
						{
							if (!ignoreLastRow) {
								// No closing quote... what a pity
								errors.push({
									type: 'Quotes',
									code: 'MissingQuotes',
									message: 'Quoted field unterminated',
									row: data.length,	// row has yet to be inserted
									index: cursor
								});
							}
							return finish();
						}

						// Closing quote at EOF
						if (quoteSearch === inputLen-1)
						{
							var value = input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar);
							return finish(value);
						}

						// If this quote is escaped, it's part of the data; skip it
						if (input[quoteSearch+1] === quoteChar)
						{
							quoteSearch++;
							continue;
						}

						// Closing quote followed by delimiter
						if (input[quoteSearch+1] === delim)
						{
							row.push(input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar));
							cursor = quoteSearch + 1 + delimLen;
							nextDelim = input.indexOf(delim, cursor);
							nextNewline = input.indexOf(newline, cursor);
							break;
						}

						// Closing quote followed by newline
						if (input.substr(quoteSearch+1, newlineLen) === newline)
						{
							row.push(input.substring(cursor, quoteSearch).replace(quoteCharRegex, quoteChar));
							saveRow(quoteSearch + 1 + newlineLen);
							nextDelim = input.indexOf(delim, cursor);	// because we may have skipped the nextDelim in the quoted field

							if (stepIsFunction)
							{
								doStep();
								if (aborted)
									return returnable();
							}

							if (preview && data.length >= preview)
								return returnable(true);

							break;
						}


						// Checks for valid closing quotes are complete (escaped quotes or quote followed by EOF/delimiter/newline) -- assume these quotes are part of an invalid text string
						errors.push({
							type: 'Quotes',
							code: 'InvalidQuotes',
							message: 'Trailing quote on quoted field is malformed',
							row: data.length,	// row has yet to be inserted
							index: cursor
						});

						quoteSearch++;
						continue;

					}

					continue;
				}

				// Comment found at start of new line
				if (comments && row.length === 0 && input.substr(cursor, commentsLen) === comments)
				{
					if (nextNewline === -1)	// Comment ends at EOF
						return returnable();
					cursor = nextNewline + newlineLen;
					nextNewline = input.indexOf(newline, cursor);
					nextDelim = input.indexOf(delim, cursor);
					continue;
				}

				// Next delimiter comes before next newline, so we've reached end of field
				if (nextDelim !== -1 && (nextDelim < nextNewline || nextNewline === -1))
				{
					row.push(input.substring(cursor, nextDelim));
					cursor = nextDelim + delimLen;
					nextDelim = input.indexOf(delim, cursor);
					continue;
				}

				// End of row
				if (nextNewline !== -1)
				{
					row.push(input.substring(cursor, nextNewline));
					saveRow(nextNewline + newlineLen);

					if (stepIsFunction)
					{
						doStep();
						if (aborted)
							return returnable();
					}

					if (preview && data.length >= preview)
						return returnable(true);

					continue;
				}

				break;
			}


			return finish();


			function pushRow(row)
			{
				data.push(row);
				lastCursor = cursor;
			}

			/**
			 * Appends the remaining input from cursor to the end into
			 * row, saves the row, calls step, and returns the results.
			 */
			function finish(value)
			{
				if (ignoreLastRow)
					return returnable();
				if (typeof value === 'undefined')
					value = input.substr(cursor);
				row.push(value);
				cursor = inputLen;	// important in case parsing is paused
				pushRow(row);
				if (stepIsFunction)
					doStep();
				return returnable();
			}

			/**
			 * Appends the current row to the results. It sets the cursor
			 * to newCursor and finds the nextNewline. The caller should
			 * take care to execute user's step function and check for
			 * preview and end parsing if necessary.
			 */
			function saveRow(newCursor)
			{
				cursor = newCursor;
				pushRow(row);
				row = [];
				nextNewline = input.indexOf(newline, cursor);
			}

			/** Returns an object with the results, errors, and meta. */
			function returnable(stopped)
			{
				return {
					data: data,
					errors: errors,
					meta: {
						delimiter: delim,
						linebreak: newline,
						aborted: aborted,
						truncated: !!stopped,
						cursor: lastCursor + (baseIndex || 0)
					}
				};
			}

			/** Executes the user's step function and resets data & errors. */
			function doStep()
			{
				step(returnable());
				data = [], errors = [];
			}
		};

		/** Sets the abort flag */
		this.abort = function()
		{
			aborted = true;
		};

		/** Gets the cursor position */
		this.getCharIndex = function()
		{
			return cursor;
		};
	}


	// If you need to load Papa Parse asynchronously and you also need worker threads, hard-code
	// the script path here. See: https://github.com/mholt/PapaParse/issues/87#issuecomment-57885358
	function getScriptPath()
	{
		var scripts = document.getElementsByTagName('script');
		return scripts.length ? scripts[scripts.length - 1].src : '';
	}

	function newWorker()
	{
		if (!Papa.WORKERS_SUPPORTED)
			return false;
		if (!LOADED_SYNC && Papa.SCRIPT_PATH === null)
			throw new Error(
				'Script path cannot be determined automatically when Papa Parse is loaded asynchronously. ' +
				'You need to set Papa.SCRIPT_PATH manually.'
			);
		var workerUrl = Papa.SCRIPT_PATH || AUTO_SCRIPT_PATH;
		// Append 'papaworker' to the search string to tell papaparse that this is our worker.
		workerUrl += (workerUrl.indexOf('?') !== -1 ? '&' : '?') + 'papaworker';
		var w = new global.Worker(workerUrl);
		w.onmessage = mainThreadReceivedMessage;
		w.id = workerIdCounter++;
		workers[w.id] = w;
		return w;
	}

	/** Callback when main thread receives a message */
	function mainThreadReceivedMessage(e)
	{
		var msg = e.data;
		var worker = workers[msg.workerId];
		var aborted = false;

		if (msg.error)
			worker.userError(msg.error, msg.file);
		else if (msg.results && msg.results.data)
		{
			var abort = function() {
				aborted = true;
				completeWorker(msg.workerId, { data: [], errors: [], meta: { aborted: true } });
			};

			var handle = {
				abort: abort,
				pause: notImplemented,
				resume: notImplemented
			};

			if (isFunction(worker.userStep))
			{
				for (var i = 0; i < msg.results.data.length; i++)
				{
					worker.userStep({
						data: [msg.results.data[i]],
						errors: msg.results.errors,
						meta: msg.results.meta
					}, handle);
					if (aborted)
						break;
				}
				delete msg.results;	// free memory ASAP
			}
			else if (isFunction(worker.userChunk))
			{
				worker.userChunk(msg.results, handle, msg.file);
				delete msg.results;
			}
		}

		if (msg.finished && !aborted)
			completeWorker(msg.workerId, msg.results);
	}

	function completeWorker(workerId, results) {
		var worker = workers[workerId];
		if (isFunction(worker.userComplete))
			worker.userComplete(results);
		worker.terminate();
		delete workers[workerId];
	}

	function notImplemented() {
		throw 'Not implemented.';
	}

	/** Callback when worker thread receives a message */
	function workerThreadReceivedMessage(e)
	{
		var msg = e.data;

		if (typeof Papa.WORKER_ID === 'undefined' && msg)
			Papa.WORKER_ID = msg.workerId;

		if (typeof msg.input === 'string')
		{
			global.postMessage({
				workerId: Papa.WORKER_ID,
				results: Papa.parse(msg.input, msg.config),
				finished: true
			});
		}
		else if ((global.File && msg.input instanceof File) || msg.input instanceof Object)	// thank you, Safari (see issue #106)
		{
			var results = Papa.parse(msg.input, msg.config);
			if (results)
				global.postMessage({
					workerId: Papa.WORKER_ID,
					results: results,
					finished: true
				});
		}
	}

	/** Makes a deep copy of an array or object (mostly) */
	function copy(obj)
	{
		if (typeof obj !== 'object')
			return obj;
		var cpy = obj instanceof Array ? [] : {};
		for (var key in obj)
			cpy[key] = copy(obj[key]);
		return cpy;
	}

	function bindFunction(f, self)
	{
		return function() { f.apply(self, arguments); };
	}

	function isFunction(func)
	{
		return typeof func === 'function';
	}

	return Papa;
}));

},{}],19:[function(require,module,exports){
//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind,
    nativeCreate       = Object.create;

  // Naked function reference for surrogate-prototype-swapping.
  var Ctor = function(){};

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.8.3';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var optimizeCb = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  var cb = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return optimizeCb(value, context, argCount);
    if (_.isObject(value)) return _.matcher(value);
    return _.property(value);
  };
  _.iteratee = function(value, context) {
    return cb(value, context, Infinity);
  };

  // An internal function for creating assigner functions.
  var createAssigner = function(keysFunc, undefinedOnly) {
    return function(obj) {
      var length = arguments.length;
      if (length < 2 || obj == null) return obj;
      for (var index = 1; index < length; index++) {
        var source = arguments[index],
            keys = keysFunc(source),
            l = keys.length;
        for (var i = 0; i < l; i++) {
          var key = keys[i];
          if (!undefinedOnly || obj[key] === void 0) obj[key] = source[key];
        }
      }
      return obj;
    };
  };

  // An internal function for creating a new object that inherits from another.
  var baseCreate = function(prototype) {
    if (!_.isObject(prototype)) return {};
    if (nativeCreate) return nativeCreate(prototype);
    Ctor.prototype = prototype;
    var result = new Ctor;
    Ctor.prototype = null;
    return result;
  };

  var property = function(key) {
    return function(obj) {
      return obj == null ? void 0 : obj[key];
    };
  };

  // Helper for collection methods to determine whether a collection
  // should be iterated as an array or as an object
  // Related: http://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength
  // Avoids a very nasty iOS 8 JIT bug on ARM-64. #2094
  var MAX_ARRAY_INDEX = Math.pow(2, 53) - 1;
  var getLength = property('length');
  var isArrayLike = function(collection) {
    var length = getLength(collection);
    return typeof length == 'number' && length >= 0 && length <= MAX_ARRAY_INDEX;
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    iteratee = optimizeCb(iteratee, context);
    var i, length;
    if (isArrayLike(obj)) {
      for (i = 0, length = obj.length; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length);
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  // Create a reducing function iterating left or right.
  function createReduce(dir) {
    // Optimized iterator function as using arguments.length
    // in the main function will deoptimize the, see #1991.
    function iterator(obj, iteratee, memo, keys, index, length) {
      for (; index >= 0 && index < length; index += dir) {
        var currentKey = keys ? keys[index] : index;
        memo = iteratee(memo, obj[currentKey], currentKey, obj);
      }
      return memo;
    }

    return function(obj, iteratee, memo, context) {
      iteratee = optimizeCb(iteratee, context, 4);
      var keys = !isArrayLike(obj) && _.keys(obj),
          length = (keys || obj).length,
          index = dir > 0 ? 0 : length - 1;
      // Determine the initial value if none is provided.
      if (arguments.length < 3) {
        memo = obj[keys ? keys[index] : index];
        index += dir;
      }
      return iterator(obj, iteratee, memo, keys, index, length);
    };
  }

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = createReduce(1);

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = createReduce(-1);

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var key;
    if (isArrayLike(obj)) {
      key = _.findIndex(obj, predicate, context);
    } else {
      key = _.findKey(obj, predicate, context);
    }
    if (key !== void 0 && key !== -1) return obj[key];
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    predicate = cb(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(cb(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = !isArrayLike(obj) && _.keys(obj),
        length = (keys || obj).length;
    for (var index = 0; index < length; index++) {
      var currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given item (using `===`).
  // Aliased as `includes` and `include`.
  _.contains = _.includes = _.include = function(obj, item, fromIndex, guard) {
    if (!isArrayLike(obj)) obj = _.values(obj);
    if (typeof fromIndex != 'number' || guard) fromIndex = 0;
    return _.indexOf(obj, item, fromIndex) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      var func = isFunc ? method : value[method];
      return func == null ? func : func.apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matcher(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matcher(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = isArrayLike(obj) ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = isArrayLike(obj) ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (!isArrayLike(obj)) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = cb(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (isArrayLike(obj)) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return isArrayLike(obj) ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    return _.initial(array, array.length - n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return _.rest(array, Math.max(0, array.length - n));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, startIndex) {
    var output = [], idx = 0;
    for (var i = startIndex || 0, length = getLength(input); i < length; i++) {
      var value = input[i];
      if (isArrayLike(value) && (_.isArray(value) || _.isArguments(value))) {
        //flatten current level of array or arguments object
        if (!shallow) value = flatten(value, shallow, strict);
        var j = 0, len = value.length;
        output.length += len;
        while (j < len) {
          output[idx++] = value[j++];
        }
      } else if (!strict) {
        output[idx++] = value;
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = cb(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = getLength(array); i < length; i++) {
      var value = array[i],
          computed = iteratee ? iteratee(value, i, array) : value;
      if (isSorted) {
        if (!i || seen !== computed) result.push(value);
        seen = computed;
      } else if (iteratee) {
        if (!_.contains(seen, computed)) {
          seen.push(computed);
          result.push(value);
        }
      } else if (!_.contains(result, value)) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = getLength(array); i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(arguments, true, true, 1);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    return _.unzip(arguments);
  };

  // Complement of _.zip. Unzip accepts an array of arrays and groups
  // each array's elements on shared indices
  _.unzip = function(array) {
    var length = array && _.max(array, getLength).length || 0;
    var result = Array(length);

    for (var index = 0; index < length; index++) {
      result[index] = _.pluck(array, index);
    }
    return result;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    var result = {};
    for (var i = 0, length = getLength(list); i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Generator function to create the findIndex and findLastIndex functions
  function createPredicateIndexFinder(dir) {
    return function(array, predicate, context) {
      predicate = cb(predicate, context);
      var length = getLength(array);
      var index = dir > 0 ? 0 : length - 1;
      for (; index >= 0 && index < length; index += dir) {
        if (predicate(array[index], index, array)) return index;
      }
      return -1;
    };
  }

  // Returns the first index on an array-like that passes a predicate test
  _.findIndex = createPredicateIndexFinder(1);
  _.findLastIndex = createPredicateIndexFinder(-1);

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = cb(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = getLength(array);
    while (low < high) {
      var mid = Math.floor((low + high) / 2);
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Generator function to create the indexOf and lastIndexOf functions
  function createIndexFinder(dir, predicateFind, sortedIndex) {
    return function(array, item, idx) {
      var i = 0, length = getLength(array);
      if (typeof idx == 'number') {
        if (dir > 0) {
            i = idx >= 0 ? idx : Math.max(idx + length, i);
        } else {
            length = idx >= 0 ? Math.min(idx + 1, length) : idx + length + 1;
        }
      } else if (sortedIndex && idx && length) {
        idx = sortedIndex(array, item);
        return array[idx] === item ? idx : -1;
      }
      if (item !== item) {
        idx = predicateFind(slice.call(array, i, length), _.isNaN);
        return idx >= 0 ? idx + i : -1;
      }
      for (idx = dir > 0 ? i : length - 1; idx >= 0 && idx < length; idx += dir) {
        if (array[idx] === item) return idx;
      }
      return -1;
    };
  }

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = createIndexFinder(1, _.findIndex, _.sortedIndex);
  _.lastIndexOf = createIndexFinder(-1, _.findLastIndex);

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (stop == null) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Determines whether to execute a function as a constructor
  // or a normal function with the provided arguments
  var executeBound = function(sourceFunc, boundFunc, context, callingContext, args) {
    if (!(callingContext instanceof boundFunc)) return sourceFunc.apply(context, args);
    var self = baseCreate(sourceFunc.prototype);
    var result = sourceFunc.apply(self, args);
    if (_.isObject(result)) return result;
    return self;
  };

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    var args = slice.call(arguments, 2);
    var bound = function() {
      return executeBound(func, bound, context, this, args.concat(slice.call(arguments)));
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    var bound = function() {
      var position = 0, length = boundArgs.length;
      var args = Array(length);
      for (var i = 0; i < length; i++) {
        args[i] = boundArgs[i] === _ ? arguments[position++] : boundArgs[i];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return executeBound(func, bound, this, this, args);
    };
    return bound;
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = '' + (hasher ? hasher.apply(this, arguments) : key);
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = _.partial(_.delay, _, 1);

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last >= 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed on and after the Nth call.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed up to (but not including) the Nth call.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      }
      if (times <= 1) func = null;
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Keys in IE < 9 that won't be iterated by `for key in ...` and thus missed.
  var hasEnumBug = !{toString: null}.propertyIsEnumerable('toString');
  var nonEnumerableProps = ['valueOf', 'isPrototypeOf', 'toString',
                      'propertyIsEnumerable', 'hasOwnProperty', 'toLocaleString'];

  function collectNonEnumProps(obj, keys) {
    var nonEnumIdx = nonEnumerableProps.length;
    var constructor = obj.constructor;
    var proto = (_.isFunction(constructor) && constructor.prototype) || ObjProto;

    // Constructor is a special case.
    var prop = 'constructor';
    if (_.has(obj, prop) && !_.contains(keys, prop)) keys.push(prop);

    while (nonEnumIdx--) {
      prop = nonEnumerableProps[nonEnumIdx];
      if (prop in obj && obj[prop] !== proto[prop] && !_.contains(keys, prop)) {
        keys.push(prop);
      }
    }
  }

  // Retrieve the names of an object's own properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve all the property names of an object.
  _.allKeys = function(obj) {
    if (!_.isObject(obj)) return [];
    var keys = [];
    for (var key in obj) keys.push(key);
    // Ahem, IE < 9.
    if (hasEnumBug) collectNonEnumProps(obj, keys);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Returns the results of applying the iteratee to each element of the object
  // In contrast to _.map it returns an object
  _.mapObject = function(obj, iteratee, context) {
    iteratee = cb(iteratee, context);
    var keys =  _.keys(obj),
          length = keys.length,
          results = {},
          currentKey;
      for (var index = 0; index < length; index++) {
        currentKey = keys[index];
        results[currentKey] = iteratee(obj[currentKey], currentKey, obj);
      }
      return results;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = createAssigner(_.allKeys);

  // Assigns a given object with all the own properties in the passed-in object(s)
  // (https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/assign)
  _.extendOwn = _.assign = createAssigner(_.keys);

  // Returns the first key on an object that passes a predicate test
  _.findKey = function(obj, predicate, context) {
    predicate = cb(predicate, context);
    var keys = _.keys(obj), key;
    for (var i = 0, length = keys.length; i < length; i++) {
      key = keys[i];
      if (predicate(obj[key], key, obj)) return key;
    }
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(object, oiteratee, context) {
    var result = {}, obj = object, iteratee, keys;
    if (obj == null) return result;
    if (_.isFunction(oiteratee)) {
      keys = _.allKeys(obj);
      iteratee = optimizeCb(oiteratee, context);
    } else {
      keys = flatten(arguments, false, false, 1);
      iteratee = function(value, key, obj) { return key in obj; };
      obj = Object(obj);
    }
    for (var i = 0, length = keys.length; i < length; i++) {
      var key = keys[i];
      var value = obj[key];
      if (iteratee(value, key, obj)) result[key] = value;
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(flatten(arguments, false, false, 1), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = createAssigner(_.allKeys, true);

  // Creates an object that inherits from the given prototype object.
  // If additional properties are provided then they will be added to the
  // created object.
  _.create = function(prototype, props) {
    var result = baseCreate(prototype);
    if (props) _.extendOwn(result, props);
    return result;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Returns whether an object has a given set of `key:value` pairs.
  _.isMatch = function(object, attrs) {
    var keys = _.keys(attrs), length = keys.length;
    if (object == null) return !length;
    var obj = Object(object);
    for (var i = 0; i < length; i++) {
      var key = keys[i];
      if (attrs[key] !== obj[key] || !(key in obj)) return false;
    }
    return true;
  };


  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }

    var areArrays = className === '[object Array]';
    if (!areArrays) {
      if (typeof a != 'object' || typeof b != 'object') return false;

      // Objects with different constructors are not equivalent, but `Object`s or `Array`s
      // from different frames are.
      var aCtor = a.constructor, bCtor = b.constructor;
      if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
                               _.isFunction(bCtor) && bCtor instanceof bCtor)
                          && ('constructor' in a && 'constructor' in b)) {
        return false;
      }
    }
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.

    // Initializing stack of traversed objects.
    // It's done here since we only need them for objects and arrays comparison.
    aStack = aStack || [];
    bStack = bStack || [];
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }

    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);

    // Recursively compare objects and arrays.
    if (areArrays) {
      // Compare array lengths to determine if a deep comparison is necessary.
      length = a.length;
      if (length !== b.length) return false;
      // Deep compare the contents, ignoring non-numeric properties.
      while (length--) {
        if (!eq(a[length], b[length], aStack, bStack)) return false;
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      length = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      if (_.keys(b).length !== length) return false;
      while (length--) {
        // Deep compare each member
        key = keys[length];
        if (!(_.has(b, key) && eq(a[key], b[key], aStack, bStack))) return false;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return true;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (isArrayLike(obj) && (_.isArray(obj) || _.isString(obj) || _.isArguments(obj))) return obj.length === 0;
    return _.keys(obj).length === 0;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp, isError.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE < 9), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around some typeof bugs in old v8,
  // IE 11 (#1621), and in Safari 8 (#1929).
  if (typeof /./ != 'function' && typeof Int8Array != 'object') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  // Predicate-generating functions. Often useful outside of Underscore.
  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = property;

  // Generates a function for a given object that returns a given property.
  _.propertyOf = function(obj) {
    return obj == null ? function(){} : function(key) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of
  // `key:value` pairs.
  _.matcher = _.matches = function(attrs) {
    attrs = _.extendOwn({}, attrs);
    return function(obj) {
      return _.isMatch(obj, attrs);
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = optimizeCb(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property, fallback) {
    var value = object == null ? void 0 : object[property];
    if (value === void 0) {
      value = fallback;
    }
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(instance, obj) {
    return instance._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // Provide unwrapping proxy for some methods used in engine operations
  // such as arithmetic and JSON stringification.
  _.prototype.valueOf = _.prototype.toJSON = _.prototype.value;

  _.prototype.toString = function() {
    return '' + this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}]},{},[1])(1)
});