/*
    concrete line plot class.
*/
function XYPlot(parent, settingsMenuId, templateMenuId) {
    /* 
        list of possible plot settings currently set statically
    */
    // plot margins    
    var marginSize = 35;
    // length of tick mark
    var tick = 5;
    // no. of sub divisions per division
    var subDivisions = 5;
    // ticker threshold to determine whether to output tick text at edges
    var tickerThreshold = 0.05;

    var getRGBHex = (s) => parseInt(s.substring(1), 16);
    var getRGBComponents = (hex) => {
        return {
            r: int(hex/256/256%256),
            g: int(hex/256%256),
            b: int(hex%256)
        }
    };

    // list of sub types
    var types = {
        line: {
            // plotting function for a data series with type set to line
            plot: function(data, settings, margin, xMaxMin, maxMin) {
                var xData = settings[0];
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
                {
                    type: 'colorPicker',
                    id: 'LineColor',
                    label: 'Line Color:',
                },
            ]
        },
        scatter: {
            // plotting function for a data series with type set to line
            plot: function(data, settings, margin, xMaxMin, maxMin) {

                var xData = settings[0];
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
                {
                    type: 'colorPicker',
                    id: 'PointColor',
                    label: 'Point Color:',
                },
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
        gradient: {
            // plotting function for a data series with type set to line
            plot: function(data, settings, margin, xMaxMin, maxMin) {
                var minColor = getRGBComponents(getRGBHex(data[2]));
                var maxColor = getRGBComponents(getRGBHex(data[3]));
                var alpha = parseInt(data[4]);
                
                var xData = settings[0];
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
                {
                    type: 'colorPicker',
                    id: 'MinColor',
                    label: 'Min Color:',
                },
                {
                    type: 'colorPicker',
                    id: 'MaxColor',
                    label: 'Max Color:',
                },
                {
                    type: 'slider',
                    id: 'Alpha',
                    label: 'Alpha:',
                    options: {
                        min: 0,
                        max: 255,
                    },
                },
            ]
        },
    };

    var self = this;

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
    var computeRange = function(maxMin, max, min) {
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
        // settings
        [
            {
                type: 'dropDown',
                label: 'X-Axis Data Series:',
                id: 'XAxisDataSeries',
                default: 'Select data series for x-axis',
                options: [],
                handlers: [
                ]                
            },
            {
                type: 'checkbox',
                label: 'Show Grid',
                id: 'Grid'
            }
        ],
        // data series template
        [
            {
                type: 'dropDown',
                label: 'Data Series:',
                id: 'DataSeries',
                default: 'Select Data Series',
                options: null,
            },
            {
                type: 'dropDown',
                label: 'Type:',
                id: 'Type',
                default: 'Select Type',
                options: [],
                handlers: [
                    {
                        type: 'change',
                        target: 1,
                        handler: function(e) {
                            var container = e.target.parentNode.parentNode;
                            var cName = container.id.substring(0,container.id.length-9);
                            
                            //var cId = cName.substring(templateMenuId.length + 10);

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
        // plot
        function() {
            var settings = this.getSettings(settingsMenuId);
            var data = this.getData(templateMenuId);
            var margin = this.computeMargin(marginSize);
            var xMaxMin = computeRange(getXMaxMin(settings[0]), margin.right, margin.left);
            var maxMin = computeRange(getMaxMin(data), margin.bottom, margin.top);

            background(255);

            if (settings[1]) {
                drawGrid(xMaxMin, maxMin, margin);
            }
            drawAxis(xMaxMin, maxMin, margin);

            for (var i=0; i<data.length; ++i) {
                types[data[i][1]].plot(data[i], settings, margin, xMaxMin, maxMin);
            }
        },
        // dataSet
        function() {
            ComponentGenerator.modifyDropdown(settingsMenuId + 'XAxisDataSeries', parent.data, 1);
        });
}
