/**************************************************************
 * File: public/plots/xyplot.js
 * Description: Concrete implementation of the xy (line) plot types.
 * Author: Liu Anna
 **************************************************************/
function XYPlot(parent) {
    /* 
        list of possible plot settings currently set statically
    */ 
    var tick = 5;               // length of tick mark
    var subDivisions = 5;       // no. of sub divisions per division
    var tickerThreshold = 0.05; // ticker threshold to determine whether to output tick text at edges

    // get the numerical value from a hexadecimal string
    var getRGBHex = (s) => parseInt(s.substring(1), 16);
    // break a numerical value into separate hexadecimal RGB values
    var getRGBComponents = (hex) => {
        return {
            r: int(hex/256/256%256),
            g: int(hex/256%256),
            b: int(hex%256)
        }
    };

    // list of sub types
    var types = {
        // simple line plot
        line: {
            // plotting function for a data series with type set to line
            plot: function(data, settings, margin, xMaxMin, maxMin) {
                var xData = settings[2];
                var d = parent.rawData;
                var n = d.getRowCount();
                var row = d.getRow(0);
                var prevX = map(row.getNum(xData), 
                    xMaxMin.min, xMaxMin.max, margin.left, margin.right);;
                var prevY = map(row.getNum(parent.data.indexOf(data[0])), 
                    maxMin.min, maxMin.max, margin.bottom, margin.top);
                stroke(data[2]);
                for (var i=1; i<n; ++i) {
                    row = d.getRow(i);
                    var currX = map(row.getNum(xData), 
                        xMaxMin.min, xMaxMin.max, margin.left, margin.right);
                    var currY = map(row.getNum(parent.data.indexOf(data[0])),    
                        maxMin.min, maxMin.max, margin.bottom, margin.top);
                    line(prevX, prevY, currX, currY);
                    prevX = currX;
                    prevY = currY;
                }
            },
            // template of options for a data series with type set to line
            template: [
                // color picker for the line color
                {
                    type: 'colorPicker',
                    id: 'LineColor',
                    label: 'Line Color:',
                },
            ]
        },
        // scatter plot type
        scatter: {
            // plotting function for a data series with type set to scatter type
            plot: function(data, settings, margin, xMaxMin, maxMin) {

                var xData = settings[2];
                var d = parent.rawData;
                var n = d.getRowCount();
                var row = d.getRow(0);
                stroke(data[2]);
                for (var i=0; i<n; ++i) {
                    row = d.getRow(i);
                    var currX = map(row.getNum(xData), 
                        xMaxMin.min, xMaxMin.max, margin.left, margin.right);
                    var currY = map(row.getNum(parent.data.indexOf(data[0])),    
                        maxMin.min, maxMin.max, margin.bottom, margin.top);
                    var diameter = parseInt(data[3]);
                    ellipse(currX, currY, diameter, diameter);
                }
            },
            // template of options for a data series with type set to line
            template: [
                // color picker for the each 'dot' of the scatter plot
                {
                    type: 'colorPicker',
                    id: 'PointColor',
                    label: 'Point Color:',
                },
                // slider used to determine the 'dot' size of the scatter plot
                {
                    type: 'slider',
                    id: 'PointSize',
                    label: 'Point Size:',
                    options: {
                        min: 5,
                        max: 20,
                    },
                    handlers: [

                    ]
                },
            ]
        },
        // horizontal 'gradient plot' for the xy plot
        gradient: {
            // plotting function for a data series with type set to horizontal gradient plot
            plot: function(data, settings, margin, xMaxMin, maxMin) {
                var minColor = getRGBComponents(getRGBHex(data[2]));
                var maxColor = getRGBComponents(getRGBHex(data[3]));
                var alpha = map(parseInt(data[4]), 0, 100, 0, 255);
                
                var xData = settings[2];
                var d = parent.rawData;
                var n = d.getRowCount();
                var row = d.getRow(0);
                var prevX = map(row.getNum(xData), 
                    xMaxMin.min, xMaxMin.max, margin.left, margin.right);
                noStroke();
                var h = margin.bottom - margin.top;
                for (var i=0; i<n; ++i) {
                    row = d.getRow(i);
                    var currX = map(row.getNum(xData), 
                        xMaxMin.min, xMaxMin.max, margin.left, margin.right);
                    var delta = map(row.getNum(parent.data.indexOf(data[0])),
                        maxMin.min, maxMin.max, 0, 100);
                    // compute the color based on the current value point and
                    // from a gradient computed as split R, G, B values for a
                    // more gradual change in color from min. to max. value colors
                    var c = {
                        r: map(delta, 0, 100, minColor.r, maxColor.r),
                        g: map(delta, 0, 100, minColor.g, maxColor.g),
                        b: map(delta, 0, 100, minColor.b, maxColor.b),
                    };
                    fill(c.r, c.g, c.b, alpha);
                    rect(prevX, margin.top, currX - prevX, h);
                    prevX = currX;
                }
            },
            // template of options for a data series with type set to line
            template: [
                // color picker for the color of the minimum value
                {
                    type: 'colorPicker',
                    id: 'MinColor',
                    label: 'Min Color:',
                },
                // color picker for the color of the maximum value
                {
                    type: 'colorPicker',
                    id: 'MaxColor',
                    label: 'Max Color:',
                },
                // slider used to select an alpha for the current gradient, this
                // allows a no. of gradient plots to be placed over each other 
                {
                    type: 'slider',
                    id: 'Alpha',
                    label: 'Alpha:',
                    options: {
                        min: 0,
                        max: 100,
                    },
                },
            ]
        },
    };

    // compute the plot window x-axis limits
    var getXMaxMin = function(xData) {
        var min = Number.MAX_VALUE;
        var max = Number.MIN_VALUE;
        var n = parent.rawData.getRowCount();
        for (var i=0; i<n; ++i) {
            var row = parent.rawData.getRow(i);
            var x = row.getNum(xData);
            if (x > max) {
                max = x;
            }
            if (x < min) {
                min = x;
            }
        }
        return {
            max: max,
            min: min
        };
    };

    // compute the plot window y-axis limits
    var getMaxMin = function(data) {
        var min = Number.MAX_VALUE;
        var max = Number.MIN_VALUE;
        var n = parent.rawData.getRowCount();
        for (var i=0; i<n; ++i) {
            var row = parent.rawData.getRow(i);
            for (var j=0; j<data.length; ++j) {   
                var x = row.getNum(parent.data.indexOf(data[j][0]));
                if (x > max) {
                    max = x;
                }
                if (x < min) {
                    min = x;
                }
            }
        }

        return {
            max: max,
            min: min,
        };
    };

    // compute plotting data (units and subunits)
    var computeRange = function(maxMin) {
        var range = maxMin.max - maxMin.min + 1;
        var unit = Math.pow(10, Math.floor(Math.log10(range)));
        maxMin.unit = unit;
        maxMin.subUnit = unit / subDivisions;

        return maxMin;
    };

    /*
        draw axis function that dynamically determines if to draw the tick text at the
        edge of the axes. This is determined based on how close the edges are to drawn tickers at unit divides.
    */
    var drawAxis = function(xMaxMin, maxMin, margin) { 
        stroke(0);
        textSize(12);
        textStyle(NORMAL);

        line(margin.left, margin.bottom, margin.right, margin.bottom);
        
        var xStart = xMaxMin.min;
        var x = Math.ceil(xMaxMin.min/xMaxMin.unit) * xMaxMin.unit;
        var pos = 0;
        var str = '';
        var xOffset = 0;
        var yOffset;
        fill(0);
        stroke(0);
        if ((x - xStart)/xMaxMin.unit > tickerThreshold) {
            line(pos, margin.bottom, pos, margin.bottom + tick);
            pos = map(xStart, xMaxMin.min, xMaxMin.max, margin.left, margin.right);
            str = parseInt(xStart).toString();
            xOffset = -textWidth(str)/2;
            yOffset = tick * 2 + textAscent(str);
            text(str, pos + xOffset, margin.bottom + yOffset);
        }
  

        while (x <= xMaxMin.max) {
            pos = map(x, xMaxMin.min, xMaxMin.max, margin.left, margin.right);
            line(pos, margin.bottom, pos, margin.bottom + tick);
            str = parseInt(x).toString();
            xOffset = -textWidth(str)/2;
            yOffset = tick * 2 + textAscent(str);
            text(str, pos + xOffset, margin.bottom + yOffset);
            x += xMaxMin.unit;
        }

        var xEnd = xMaxMin.max;
        x -= xMaxMin.unit;
        if ((xEnd - x) /xMaxMin.unit > tickerThreshold) {
            pos = map(xEnd, xMaxMin.min, xMaxMin.max, margin.left, margin.right);
            line(pos, margin.bottom, pos, margin.bottom + tick);
            str = parseInt(xEnd).toString();
            xOffset = -textWidth(str)/2;
            yOffset = tick * 2 + textAscent(str);
            text(str, pos + xOffset, margin.bottom + yOffset);
        }

        line(margin.left, margin.top, margin.left, margin.bottom);

        var yStart = maxMin.min;
        var y = Math.ceil(maxMin.min/maxMin.unit) * maxMin.unit;
        if ((y - yStart)/maxMin.unit > tickerThreshold) {
            pos = map(yStart, maxMin.min, maxMin.max, margin.bottom, margin.top);
            line(margin.left - tick, pos, margin.left, pos);
            str = parseInt(yStart).toString();
            xOffset = -textWidth(str) - tick * 2;
            yOffset = textAscent(str)/2;
            text(str, margin.left + xOffset, pos + yOffset);
        }

        y = Math.ceil(maxMin.min/maxMin.unit) * maxMin.unit;
        while (y <= maxMin.max) {
            pos = map(y, maxMin.min, maxMin.max, margin.bottom, margin.top);
            line(margin.left - tick, pos, margin.left, pos);
            str = parseInt(y).toString();
            xOffset = -textWidth(str) - tick * 2;
            yOffset = textAscent(str)/2;
            text(str, margin.left + xOffset, pos + yOffset);
            y += maxMin.unit;
        }   

        yEnd  = maxMin.max;
        y -= maxMin.unit;
        if ((yEnd - y) /maxMin.unit > tickerThreshold) {
            pos = map(yEnd, maxMin.min, maxMin.max, margin.bottom, margin.top);
            line(margin.left - tick, pos, margin.left, pos);
            str = parseInt(yEnd).toString();
            xOffset = -textWidth(str) - tick * 2;
            yOffset = textAscent(str)/2;
            text(str, margin.left + xOffset, pos + yOffset);
        }


    };

    /*
        function used to draw the grid
    */
    var drawGrid = function(xMaxMin, maxMin, margin) {
        stroke(128);
        
        var x = Math.ceil(xMaxMin.min/xMaxMin.subUnit) * xMaxMin.subUnit;
        var pos;
        while (x <= xMaxMin.max) {
            pos = map(x, xMaxMin.min, xMaxMin.max, margin.left, margin.right);
            line(pos, margin.top, pos, margin.bottom);
            x += xMaxMin.subUnit;
        }
        x = xMaxMin.max;
        pos = map(x, xMaxMin.min, xMaxMin.max, margin.left, margin.right);
        line(pos, margin.top, pos, margin.bottom);
        
        var y = Math.ceil(maxMin.min/maxMin.subUnit) * maxMin.subUnit;
        while (y <= maxMin.max) {
            pos = map(y, maxMin.min, maxMin.max, margin.bottom, margin.top);
            line(margin.left, pos, margin.right, pos);
            y += maxMin.subUnit;
        }
        y = maxMin.max;
        pos = map(y, maxMin.min, maxMin.max, margin.bottom, margin.top);
        line(margin.left, pos, margin.right, pos);
    };
  
    // initialize based plot object
    return Plot(
        parent,
        'XY Plot',
        35, // marginSize
        // settings
        [
            // drop down to select the row/ column that represents data for the horizontal axis
            {
                type: 'dropDown',
                label: 'X-Axis Data Series:',
                id: 'XAxisDataSeries',
                default: 'Select data series for x-axis',
                options: [],
                handlers: [
                ]                
            },
            // checkbox to determine if to draw a ggrid
            {
                type: 'checkbox',
                label: 'Show Grid',
                id: 'Grid'
            }
        ],
        // data series template (in addition to specifc setting of each sub plot type)
        [
            // drop down to select data series
            {
                type: 'dropDown',
                label: 'Data Series:',
                id: 'DataSeries',
                default: 'Select Data Series',
                options: null,
            },
            // drop down used to select the sub plot type
            {
                type: 'dropDown',
                label: 'Type:',
                id: 'Type',
                default: 'Select Type',
                options: [],
                handlers: [
                    // when the sub plot type is changed, repopulate the data series 
                    // with settings relevant the sub plot type
                    {
                        type: 'change',
                        target: 1,
                        handler: function(e) {
                            var container = e.target.parentNode.parentNode;
                            var cName = container.id.substring(0,container.id.length-9);
                            
                            ComponentGenerator.clearContainer(container, 2);
                            var t = e.target.value;
                            if (t == '') {
                                return;
                            }
                            var type = types[t];
                            for (var i=0; i<type.template.length; ++i) {
                                var c = ComponentGenerator.generateComponent(cName, type.template[i]);
                                container.appendChild(c);
                            }
                        },
                    },
                ]
            },
        ],
        // types
        types,
        // plot function
        function(settings, data, margin, rowsNCols) { 
            // setup and initialization
            var xMaxMin = computeRange(getXMaxMin(settings[2]));
            var maxMin = computeRange(getMaxMin(data));

            // draw (or not) the grid based on settings
            if (settings[3]) {
                drawGrid(xMaxMin, maxMin, margin);
            }
            drawAxis(xMaxMin, maxMin, margin);

            // iterate over the selected data series and call their sub plot type plot function for
            // actual plotting
            for (var i=0; i<data.length; ++i) {
                types[data[i][1]].plot(data[i], settings, margin, xMaxMin, maxMin);
            }
        },
        // dataSet function to update relevant drop downs based on newly loaded data
        function() {
            ComponentGenerator.modifyDropdown(parent.plotSettingsMenu.id + 'XAxisDataSeries', parent.data, 1);
        });
}
