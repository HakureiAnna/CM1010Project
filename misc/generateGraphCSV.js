var fs = require('fs');

var cols = 2;
var inRows = 10;
var rows = 20;
var maxWeight = 100;

var data = fs.readFileSync('in.csv').toString().split('\r\n');
var n = data.length > inRows? inRows: data.length;

var out = fs.createWriteStream('out.csv');

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