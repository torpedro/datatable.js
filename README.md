# datasci.js - The JavaScript Data Library

[![Build Status](https://api.travis-ci.org/torpedro/datasci.js.svg?branch=master)](http://travis-ci.org/torpedro/datasci.js)

**datasci.js** is a analytics library for JavaScript. The library contains sophisticated implementations of a Table and useful statistical functionality to interact with data. The Table implementation allows **SQL-like** interaction. **datasci.js** also holds functionality to turn Tables directly into **charts**.



# Usage

Include the JavaScript library in your HTML page.

    <script src="build/datasci.js-full-min.js"></script>
	
# Modules

The library is separated into several modules. All modules are accessible through on global namespace `sci`. I.e. if you want to access the `data` module you will call `sci.data`.

**data**

This module contains the core features of **datasci.js**. It contains our implementation of a DataTable, HashMap, Sets and other functionality.

**csv**

`sci.csv` handles all CSV interoperability. Such as parsing CSV strings into a Table or writing a table to a CSV string.

**smooth**

`sci.smooth` contains statistical methods to smooth data series. I.e. exponential smoothing and moving average implementations can be found here.

**chart**

The charting module `sci.chart` contains functionality to plot tables into charts.

# Functionality

Planned:

* **Soon**
  * Data Table Structure
  * Advanced Data Structures (Set, Tree, ...)
  * Smoothing Algorithms (SES, DES, MA, ...)
  * Charting (Line charts, ...)
  * CSV interop (Load and Save)
  
* **Future**
  * Table Compression (Dict, RLE)
  * Forecasting Algorithms (Regression)
  * Classification (Bayes, SVM, DT)


# Development

Install the dependencies:

    npm install


## Build the library

    grunt build


## Testing

We use Mocha for testing. Run with:

    grunt test
	
	
## Create the minified sources

    grunt release
	
	
	
