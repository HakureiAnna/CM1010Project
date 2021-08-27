/**************************************************************
 * File: public/plots/barchart.js
 * Description: Barchart plot type implementation file.
 * Author: Liu Anna
 **************************************************************/

function Barchart(parent) {
    /* 
        list of possible plot settings currently set statically
    */
    var textSpace = 50;     // left most position for text drawing
    var barSpace = 10;      // interval between each drawn 'bar'
    var axisSpace = 30;     // space used for axis drawing
    var tickSize = 5;       // size of a tick line
    var tickIntervals = 4;  // no. of ticks to draw
    var textOffset = 12;    // vertical text offset for prper text placement
    var selectedCol = '';   // selected column 

    // function used to draw the axis and ticks
    var drawAxis = function(margin) {
        stroke(0);
        var left = margin.left + textSpace;
        var base = margin.bottom - axisSpace;
        line(left, base, margin.right, base);
        for (var i=0; i<=tickIntervals; ++i) {
            var v = parseInt(i/tickIntervals * 100);
            var vStr = v.toString() + '%';
            var x = map(v, 0, 100, left, margin.right);
            line(x, base, x, base+tickSize);
            var offset = -textWidth(vStr)/2;
            text(vStr, x+offset, base+tickSize + textOffset);
        }
    };

    // actual drawing function used to the bars
    var barify = function(data, margin, settings) {
        var total = 0;
        var row = null;
        var dataset = [];
        
        // extract relevant row
        for (var i=0; i<parent.rawData.getRowCount(); ++i) {
            var r = parent.rawData.getRow(i);
            if (r.get(selectedCol) == data) {
                row = r;
                break;
            }
        }
        // extract relevant proportions and compute total
        for (var i=0; i<parent.rawData.getColumnCount(); ++i) {
            var c = row.get(i);
            if (c != data) {    
                var val = row.getNum(i); 
                dataset.push(val);
                total += val;
            }
        }

        
        fill(0);
        // write the bar heading to the left of the graph
        text(data, margin.left, margin.top + (margin.bottom - margin.top)/2);
        var currX = 0;

        // drawing the actual bar
        for (var i=0; i<dataset.length; ++i) {
            var x1 = map(currX, 0, total, margin.left + textSpace, margin.right);
            currX += dataset[i];
            var x2 = map(currX, 0, total, margin.left + textSpace, margin.right);
            fill(settings[i+4]);
            rect(x1, margin.top, x2-x1, margin.bottom-margin.top);
        }
    };
  
    // initialize based plot object
    var plot = Plot(
        parent,
        'Bar Chart',
        10, // marginSize
        // settings
        [
            // drop down used to select the row/ column containing the data for
            // the selectable data series
            {
                type: 'dropDown',
                label: 'Data Row/ Column:',
                id: 'DataRowColumn',
                default: 'Select row containing data',
                options: [],
                handlers: [
                    // when drop down selection changed, update the selectable data series
                    {
                        type: 'change',
                        target: 1,
                        handler: function(e) {
                            var v = e.target.value;
                            
                            if (v == 'default') {
                                return;
                            }
                            selectedCol = v;
                            
                            var options = parent.getColumn(selectedCol);
                            plot.updateData(options);

                            parent.dataSeriesMenu.reset();         
                            parent.gallery.reset();      
                        }
                    }
                ]                
            },
            // drop down used to represent the actual proportions to divide the selected data series by
            {
                type: 'dropDown',
                label: 'Proportions:',
                id: 'Proportions',
                default: null,
                multi: true,
                options: [],
                handlers: [
                    // when drop down selection changed, repopulate the plot settings to allow setting
                    // of color for each proportion type
                    {
                        type: 'change',
                        target: 1,
                        handler: function(e) {
                            // remove all except the first 2 settings
                            var n = plot.settings.length;
                            plot.settings.splice(2, n-2);

                            // add colorpickers for each proportion
                            var proportions = ComponentGenerator.getMultiselectValue(e.target);
                            for (var i=0; i<proportions.length; ++i) {
                                plot.settings.push(
                                    {
                                        type: 'colorPicker',
                                        label: proportions[i] + ':',
                                        id: proportions[i]
                                    },
                                );
                            }
                            parent.plotSettingsMenu.load(2);
                        },
                    },
                ]                
            },
        ],
        // data series template
        [
            // drop down for selection of a bar to visualize
            {
                type: 'dropDown',
                label: 'Data Series:',
                id: 'DataSeries',
                default: 'Select Data Series',
                options: null,
            },
        ],
        // types
        null,
        // plot
        function(settings, data, margin, rowsNCols) {
            
            // draw the axis
            drawAxis(margin);

            // set aside more space for drawing the horizontal axis
            // reducing the usable visualization area
            margin.bottom -= axisSpace;

            // actual height of plottable area
            var h = margin.bottom - margin.top;
            var barH = (h - barSpace * (data.length - 1))/data.length;
            var currY = margin.top;
            // for loop to iterate over each data series and plot them
            // using the barify function
            for (var i=0; i<data.length; ++i) {

                barify(data[i][0], 
                    {
                        left: margin.left,
                        right: margin.right,
                        top: currY,
                        bottom: currY + barH
                    }, settings);
                currY += barH + barSpace;
            }            

        },
        // dataSet function to update the UI when new data is laoded
        function() {
            ComponentGenerator.modifyDropdown(parent.plotSettingsMenu.id + 'DataRowColumn', parent.data, 1);
            ComponentGenerator.modifyDropdown(parent.plotSettingsMenu.id + 'Proportions', parent.data, 1);
        });


        return plot;
}
