/*
    concrete line plot class.
*/
function Barchart(parent, settingsMenuId, templateMenuId) {
    /* 
        list of possible plot settings currently set statically
    */
    // plot margins    
    var marginSize = 10;
    var textSpace = 50;
    var barSpace = 10;
    var axisSpace = 30;
    var tickSize = 5;
    var tickIntervals = 4;
    var textOffset = 12;
    var selectedCol = '';

    var self = this;

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
        text(data, margin.left, margin.top + (margin.bottom - margin.top)/2);
        var currX = 0;

        for (var i=0; i<dataset.length; ++i) {
            var x1 = map(currX, 0, total, margin.left + textSpace, margin.right);
            currX += dataset[i];
            var x2 = map(currX, 0, total, margin.left + textSpace, margin.right);
            fill(settings[i+2]);
            rect(x1, margin.top, x2-x1, margin.bottom-margin.top);
        }
    };
  
    // initialize based plot object
    var plot = Plot(
        parent,
        'Bar Chart',
        // settings
        [
            {
                type: 'dropDown',
                label: 'Data Row/ Column:',
                id: 'DataRowColumn',
                default: 'Select row containing data',
                options: [],
                handlers: [
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
            {
                type: 'dropDown',
                label: 'Proportions:',
                id: 'Proportions',
                default: null,
                multi: true,
                options: [],
                handlers: [
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
        function() {
            background(255);

            var settings = this.getSettings(settingsMenuId);
            var data = this.getData(templateMenuId);
            var margin = this.computeMargin(marginSize);
            
            drawAxis(margin);

            margin.bottom -= axisSpace;

            var h = margin.bottom - margin.top;
            var barH = (h - barSpace * (data.length - 1))/data.length;
            var currY = margin.top;
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
        // dataSet
        function() {
            ComponentGenerator.modifyDropdown(settingsMenuId + 'DataRowColumn', parent.data, 1);
            ComponentGenerator.modifyDropdown(settingsMenuId + 'Proportions', parent.data, 1);
        });


        return plot;
}
