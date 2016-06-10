[![Build Status](https://api.travis-ci.org/torpedro/datatable.js.svg?branch=master)](http://travis-ci.org/torpedro/datatable.js)
[![npm version](https://badge.fury.io/js/datatable.js.svg)](https://badge.fury.io/js/datatable.js)

# datatable.js - Easy Data Handling

**datatable.js** is an analytics library for JavaScript. The library contains sophisticated implementations of a Table and useful statistical functionality to interact with data. The Table implementation allows **SQL-like** functionality.

# Usage

## Installation

**node.js**: Install the package and import the library.

    npm install datatable.js

    var dt = require("datatable.js")

**Browser**: Include the JavaScript library in your HTML page.

    <script src="dist/datatable.js.min.js"></script>

## Classes

This is a list of all currently publicly usable classes and modules in the library:

 * Table
 * Set
 * HashMap
 * Vector
 * CSVParser

## Examples

Example 1: Creating a table and adding rows to it.

```typescript
var table = new dt.Table({
    fields: ["id", "name", "city", "age"],
    types: ["number", "string", "string", "number"]
});

table.insert([[1, "Max", "Mustermann", 23]]); // works
table.insert([[2, "John", "Doe", 26]]); // works

// throws type-mismatch error
table.insert([[3, "John", "Doe", "blank"]]); 

console.log(table.rows()); // prints an array containing all rows
```

Example 2: Calculate a average age of persons from a city.

```typescript
var table = new dt.Table({
    fields: ["id", "name", "city", "age"],
    types: ["number", "string", "string", "number"]
});

// fill with some data...

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
