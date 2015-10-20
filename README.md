[![Build Status](https://api.travis-ci.org/torpedro/datasci.js.svg?branch=master)](http://travis-ci.org/torpedro/datasci.js)
[![npm version](https://badge.fury.io/js/datasci.js.svg)](https://badge.fury.io/js/datasci.js)

# datasci.js - The JavaScript Data Library

**datasci.js** is a analytics library for JavaScript. The library contains sophisticated implementations of a Table and useful statistical functionality to interact with data. The Table implementation allows **SQL-like** interaction. **datasci.js** also holds functionality to turn Tables directly into **charts**.



# Usage

## Installation

**node.js**: Install the package and import the library.

    npm install datasci.js
    
    var sci = require("datasci.js")

**Browser**: Include the JavaScript library in your HTML page.

    <script src="build/datasci.js-full-min.js"></script>

## Classes

This is a list of all currently usable classes and modules in the library.

* sci.table
  * CoreColumnTable
  * AnalyticsTable
* sci.data
  * Set
  * OrderedSet
  * HashMap
  * vec (module, contains various functions to work on arrays/vectors)
* sci.io
  * CSVParser
* sci.smooth
  * ma (module, contains moving average smoothing functionality)
  * es (module, contains exponential smoothing functionality)

## Examples

Creating a table and adding rows to it.

```typescript
var table = new sci.table.AnalyticsTable({
    fields: ["id", "name", "city", "age"],
    types: ["number", "string", "string", "number"]
});

table.addRow([1, "Max", "Mustermann", 23]); // works
table.addRow([2, "John", "Doe", 26]); // works
table.addRow([3, "John", "Doe", "blank"]); // throws type-mismatch error

console.log(table.rows()); // prints an array containing all rows
```

---

Calculate a average age of persons from a city.

```typescript
var table = new sci.table.AnalyticsTable({
    fields: ["id", "name", "city", "age"],
    types: ["number", "string", "string", "number"]
});

// fill some data...

var result = table.groupBy("city", table.agg.avg("age", "average_age");
console.log(result.rows());
```


# Contributing / Development

```bash
# install dependencies
npm install

# build the library
grunt build

# run mocha tests
grunt test

# run linter
grunt test-and-lint

# create minified sources
grunt release
```
