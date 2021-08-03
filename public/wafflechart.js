/*
    concrete line plot class.
*/
function Wafflechart(parent, settingsMenuId, templateMenuId) {
    /* 
        list of possible plot settings currently set statically
    */
    // plot margins    
    var marginSize = 10;
    var categories = null;
    var rows = 10;
    var cols = 10;
    var epsilon = 0.1;
    var waffleSpace = 10;

    var self = this;


    var wafflify = function(data, margin, settings) {
        var dataSet = [];
        
        var raw = parent.getColumn(data);
        for (var i=0; i<categories.length; ++i) {
            dataSet.push(0);
        }
        for (var i=0; i<raw.length; ++i) {
            for (var j=0; j<categories.length; ++j) {
                if (categories[j] == raw[i]) {
                    dataSet[j]++;
                    break;
                }
            }
        }
        var total = raw.length;
        var k = 0;
        var currVal = dataSet[k]/total;
        var currCell = 0;
        var currX = margin.left;
        var currY = margin.top;
        var xStep = (margin.right - margin.left)/cols;
        var yStep = (margin.bottom - margin.top)/rows;
        var max = rows * cols;
        var step = 1/max;

        stroke(0);
        for (var i=0; i<rows; ++i) {            
            for (var j=0; j<cols; ++j) {
                while (currVal < currCell) {                        
                    currVal += dataSet[k]/total;
                    k++;
                }
                fill(settings[k+1]);
                rect(currX, currY, xStep, yStep);
                currCell += step;
                currX += xStep;
                if (Math.abs(margin.right - step - currX) < epsilon) {
                    currX = margin.left;
                    currY += yStep;
                }
            }
        }

    };
  
    // initialize based plot object
    var plot = Plot(
        parent,
        'Waffle Chart',
        // settings
        [
            {
                type: 'dropDown',
                label: 'Reference(s):',
                id: 'References',
                default: null,
                multi: true,
                options: [],
                handlers: [
                    {
                        type: 'change',
                        target: 1,
                        handler: function(e) {
                            var references = ComponentGenerator.getMultiselectValue(e.target);
                            
                            categories = new Set();
                            for (var i=0; i<references.length; ++i) {
                                var d = parent.getColumn(references[i]);
                                for (var j=0; j<d.length; ++j) {
                                    categories.add(d[j]);
                                }
                            }

                            var n = plot.settings.length;
                            plot.settings.splice(1, n-1);
                            categories = Array.from(categories);

                            for (var i=0; i<categories.length; ++i) {
                                plot.settings.push(
                                    {
                                        type: 'colorPicker',
                                        label: categories[i] + ':',
                                        id: categories[i]
                                    }
                                );
                            }
                            parent.plotSettingsMenu.load(1);
                        },
                    },
                ],                
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
            var rowsAndColumns = this.computeRowsAndColumns(data.length);    

            var xStep = (margin.right - margin.left - waffleSpace * (rowsAndColumns.cols - 1))/rowsAndColumns.cols;
            var yStep = (margin.bottom - margin.top - waffleSpace * (rowsAndColumns.rows - 1))/rowsAndColumns.rows;
            var currX = margin.left;
            var currY = margin.top;
            for (var i=0; i<data.length; ++i) {
                wafflify(data[i][0], {
                    left: currX,
                    right: currX + xStep,
                    top: currY,
                    bottom: currY + yStep
                }, settings);
                currX += xStep + waffleSpace;
                if (Math.abs(margin.right + waffleSpace - currX) < epsilon) {
                    currX = margin.left;
                    currY += yStep + waffleSpace;
                }
            }

        },
        // dataSet
        function() {
            ComponentGenerator.modifyDropdown(settingsMenuId + this.settings[0].id, parent.data, 1);
        });


        return plot;
}
