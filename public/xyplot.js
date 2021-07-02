function XYPlot(parent, settingsMenuId, templateMenuId) {
    var margin = 35;
    var tick = 5;
    var subDivisions = 5;

    var types = {
        line: {
            selected: function() {

            },
            plot: function(data, xData, margin, xMaxMin, maxMin) {
                console.log(data);
                var d = parent.rawData;
                var n = d.getRowCount();
                var row = d.getRow(0);
                var prevX = map(row.getNum(xData), 
                    xMaxMin.min, xMaxMin.max, margin.left, margin.right);;
                var prevY = map(row.getNum(data[0]), 
                    maxMin.min, maxMin.max, margin.bottom, margin.top);

                stroke(data[2]);
                for (var i=1; i<n; ++i) {
                    row = d.getRow(i);
                    var currX = map(row.getNum(xData), 
                        xMaxMin.min, xMaxMin.max, margin.left, margin.right);
                    var currY = map(row.getNum(data[0]),    
                        maxMin.min, maxMin.max, margin.bottom, margin.top);
                    line(prevX, prevY, currX, currY);
                    prevX = currX;
                    prevY = currY;
                }
            },
            template: [
                {
                    type: 'colorPicker',
                    id: 'LineColor',
                    label: 'Line Color:',
                },
            ]
        }
    };

    var xAxisOptions = [];    
    var self = this;

    var getSettings = function() {
        var settings = [];
        var c = document.getElementById(settingsMenuId + 'Container');
        console.log(c.childNodes.length);
        for (var i=2; i<c.childNodes.length; ++i) {
            var ct = c.childNodes[i].childNodes[1];
            settings.push(ct.value);
        }
        return settings;
    };

    var getData = function() {        
        var data = [];
        var c = document.getElementById(templateMenuId + 'Container');
        for (var i = 3; i<c.childNodes.length; ++i) {
            // each data series's container
            var ct = c.childNodes[i].childNodes[1].childNodes[0];
            var datum = [];
            for (var j=0; j<ct.childNodes.length; ++j) {
                var v = ct.childNodes[j].childNodes[1].value;
                if (v == '') {
                    datum = null;
                    break;
                }
                datum.push(v);
            }
            if (datum != null) {
                data.push(datum);
            }
        }
        return data;
    };

    var getXMaxMin = function(xData) {
        var min = Number.MAX_VALUE;
        var max = Number.MIN_VALUE;
        if (parent.rowOrColumn == 'row') {
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
        }
        return {
            max: max,
            min: min
        };
    };

    var getMaxMin = function(data) {
        var min = Number.MAX_VALUE;
        var max = Number.MIN_VALUE;
        if (parent.rowOrColumn == 'row') {
            var n = parent.rawData.getRowCount();
            for (var i=0; i<n; ++i) {
                var row = parent.rawData.getRow(i);
                for (var j=0; j<data.length; ++j) {
                    var x = row.getNum(data[j][0]);
                    if (x > max) {
                        max = x;
                    }
                    if (x < min) {
                        min = x;
                    }
                }
            }
        }


        return {
            max: max,
            min: min,
        };
    };

    var computeRange = function(maxMin, max, min) {
        var range = maxMin.max - maxMin.min + 1;
        var unit = Math.pow(10, Math.floor(Math.log10(range)));
        maxMin.max = Math.floor((maxMin.max + unit * 0.5) / unit) * unit;
        maxMin.min = Math.floor((maxMin.min) / unit) * unit;
        maxMin.unit = unit;
        var n = (maxMin.max - maxMin.min) / maxMin.unit;
        var subN = n * subDivisions;
        var step = (max - min)/n;
        var subStep = step / subDivisions;
        maxMin.n = n;
        maxMin.step = step;
        maxMin.subN = subN;
        maxMin.subStep = subStep;

        return maxMin;
    };

    var computeMargin = function() {
        var left = margin * 2;
        var right = width - margin * 2;
        var bottom = height - margin * 2;
        var top = margin * 2;

        return {
            left: left,
            right: right,
            bottom: bottom,
            top: top
        };
    };

    var drawAxis = function(xMaxMin, maxMin, margin) { 
        stroke(0);
        textSize(12);
        textStyle(NORMAL);
        line(margin.left, margin.bottom, margin.right, margin.bottom);
        for (var i=0; i<=xMaxMin.n; ++i) {
            line(margin.left + i * xMaxMin.step, margin.bottom, 
                margin.left + i * xMaxMin.step, margin.bottom + tick);
            var t = (xMaxMin.min + i * xMaxMin.unit).toString();
            var xOffset = -textWidth(t)/2;
            var yOffset = textAscent(t) + tick * 2;
            text(t, margin.left + i * xMaxMin.step + xOffset, margin.bottom + yOffset);
        }

        line(margin.left, margin.top, margin.left, margin.bottom);
        for (var i=0; i<=maxMin.n; ++i) {
            line(margin.left - tick, margin.top + i * maxMin.step, 
                margin.left, margin.top + i * maxMin.step);
            var t = (maxMin.max - i * maxMin.unit).toString();
            var xOffset = -textWidth(t) - tick * 2;
            var yOffset = textAscent(t)/2;
            text(t, margin.left + xOffset, margin.top + i * maxMin.step + yOffset);
        }
    };

    var drawGrid = function(xMaxMin, maxMin, margin) {
        stroke(128);
        for (var i = 0; i<=xMaxMin.subN; ++i) {
            line(margin.left + i * xMaxMin.subStep, margin.top, 
                margin.left + i * xMaxMin.subStep, margin.bottom);
        }
        for (var i = 0; i<=maxMin.subN; ++i) {
            line(margin.left, margin.top + i * maxMin.subStep, margin.right, margin.top + i * maxMin.subStep);
        }
    }
  
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
                options: xAxisOptions,
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
            var settings = getSettings();
            var data = getData();
            var margin = computeMargin();
            var xMaxMin = computeRange(getXMaxMin(settings[0]), margin.right, margin.left);
            var maxMin = computeRange(getMaxMin(data), margin.bottom, margin.top);

            console.log(xMaxMin, maxMin, margin);

            background(255);
            drawAxis(xMaxMin, maxMin, margin);

            if (settings[1] == 'on') {
                drawGrid(xMaxMin, maxMin, margin);
            }

            for (var i=0; i<data.length; ++i) {
                types[data[i][1]].plot(data[i], settings[0], margin, xMaxMin, maxMin);
            }
        },
        // dataSet
        function() {
            ComponentGenerator.modifyDropdown(settingsMenuId + 'XAxisDataSeries', parent.data, 1);
        });
}
