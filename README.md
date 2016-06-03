[![Build Status](https://api.travis-ci.org/torpedro/datasci.js.svg?branch=master)](http://travis-ci.org/torpedro/datasci.js)
[![npm version](https://badge.fury.io/js/datatable.js.svg)](https://badge.fury.io/js/datatable.js)

# datatable.js - The JavaScript Data Library

**datatable.js** is an analytics library for JavaScript. The library contains sophisticated implementations of a Table and useful statistical functionality to interact with data. The Table implementation allows **SQL-like** interaction. **datatable.js** also holds functionality to turn Tables directly into **charts**.



# Usage

## Installation

**node.js**: Install the package and import the library.

    npm install datatable.js

    var dt = require("datatable.js")

**Browser**: Include the JavaScript library in your HTML page.

    <script src="dist/datatable.js.min.js"></script>

## Classes & Modules

This is a list of all currently usable classes and modules in the library.
It also contains some features that are planned in the near future (marked with "todo").

* dt.table
  * CoreColumnTable
  * AnalyticsTable
* dt.data
  * Set
  * OrderedSet
  * HashMap
  * vec (module, contains various functions to work on arrays/vectors)
* dt.io
  * CSVParser
  * *AjaxLoader (todo)*
* dt.plot
  * *LinePlot (todo)*
  * *BarChart (todo)*
* dt.smooth
  * ma (module, contains moving average smoothing functionality)
  * es (module, contains exponential smoothing functionality)

## Examples

Creating a table and adding rows to it.

```typescript
var table = new dt.table.AnalyticsTable({
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
var table = new dt.table.AnalyticsTable({
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
