/*
    concrete line plot class.
*/
function Barchart(parent, settingsMenuId, templateMenuId) {
    /* 
        list of possible plot settings currently set statically
    */
    // plot margins    
    var margin = 35;
    var textSpace = 40;
    // length of tick mark
    var tick = 5;
    // no. of sub divisions per division
    var subDivisions = 5;
    // ticker threshold to determine whether to output tick text at edges
    var tickerThreshold = 0.05;
    var selectedCol = '';

    var self = this;

    var barify = function(data, margin, settings) {
        var total = 0;
        var row = null;
        var dataset = [];
        for (var i=0; i<parent.rawData.getRowCount(); ++i) {
            var r = parent.rawData.getRow(i);
            if (r.get(selectedCol) == data) {
                row = r;
                break;
            }
        }
        for (var i=0; i<parent.rawData.getColumnCount(); ++i) {
            var c = row.get(i);
            if (c != data) {    
                var val = row.getNum(i); 
                dataset.push(val);
                total += val;
            }
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
            var margin = this.computeMargin();

            for (var i=0; i<data.length; ++i) {
                barify(data[i][0], margin, settings);
            }            
        },
        // dataSet
        function() {
            ComponentGenerator.modifyDropdown(settingsMenuId + 'DataRowColumn', parent.data, 1);
            ComponentGenerator.modifyDropdown(settingsMenuId + 'Proportions', parent.data, 1);
        });


        return plot;
}
