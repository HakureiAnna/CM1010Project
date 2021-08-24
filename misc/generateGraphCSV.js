/**************************************************************
 * File: misc/generateGraphCSV.js
 * Description: Utility program used to generate dummy data for 
 * testing the graph visualization feature.
 * Author: Liu Anna
 **************************************************************/

var fs = require('fs');

// settings
var cols = 2;           // no. of columns to generate
var inRows = 10;        // no. of rows in the input file to use
var rows = 20;          // no. of random rows to generate in the output file
var maxWeight = 100;    // maximum weight associated with each 'edge'

// read input file to get usable values for node key.
var data = fs.readFileSync('in.csv').toString().split('\r\n');
var n = data.length > inRows? inRows: data.length;

// create output file
var out = fs.createWriteStream('out.csv');

// randomly create graph visualization data based on settings
for (var i=0; i<rows; ++i) {
    var used = {};
    for (var j=0; j<cols; ++j) {
        var x = Math.round(Math.random() * n);
        while (x in used) {
            x = Math.round(Math.random() * n);
        }
        out.write('"' + data[x] + '"');
        used[x] = 1;
        out.write(',');
        if (j == cols-1) {
            out.write(parseInt(Math.round(Math.random() * maxWeight)).toString());
        }
    }
    out.write('\r\n');
}

 out.end();