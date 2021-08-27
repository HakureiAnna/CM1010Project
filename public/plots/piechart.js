/**************************************************************
 * File: public/plots/piechart.js
 * Description: Concrete implementation of the pie chart plot type.
 * Author: Liu Anna
 **************************************************************/

function Piechart(parent) {
    /* 
        list of possible plot settings currently set statically
    */
    var subMargin = 10;     // margin size between each pie plot

    // function used to plot a pie chart for a particular selected data series
    var piefy = function(datum, margin, settings) {
        var dataset = [];
        var total = 0;
        // obtain dataset and compute sum
        for (var i=0; i<parent.rawData.getRowCount(); ++i) {
            var r = parent.rawData.getRow(i);            
            dataset.push(parseFloat(r.getNum(datum)));
            total += dataset[i];
        }
        var midX = (margin.right - margin.left);
        var midY = (margin.bottom - margin.top);
        var d = midX > midY? midY: midX;
        midX = midX/2 + margin.left;
        midY = midY/2 + margin.top;

        var start = 3 * Math.PI/2;
        for (var i=0; i<parent.rawData.getRowCount(); ++i) {            
            var rad = dataset[i] / total * 2 * Math.PI;

            fill(settings[i+3]);
            var next = (start + rad) % (2 * Math.PI);
            arc(midX, midY, d, d, start, next);
            start = next;
        }
    };
 
  
    // initialize based plot object
    var plot = Plot(
        parent,
        'Pie Chart',        
        35,    // margin size for from the visualization area to the extreme
        // settings
        [
            // drop down for selecting the row/ column that provides the partitioning data
            {
                type: 'dropDown',
                label: 'Partition By:',
                id: 'PartitionBy',
                default: 'Select Row/ Column to partition by.',
                options: [],
                handlers: [
                    // when the drop down selection changes, repopulate the plot settings menu with color 
                    // pickers for each partition from the selected column
                    {
                        type: 'change',
                        target: 1,
                        handler: function(e) {
                            // remove all except first component in template
                            var n = plot.settings.length;
                            plot.settings.splice(1, n-1);

                            // add colorpickers for each in partition by
                            var partitionBy = document.getElementById('drp' + parent.plotSettingsMenu.id + plot.settings[0].id).value;
                            var partitions = parent.getColumn(partitionBy);
                            for (var i=0; i<partitions.length; ++i) {
                                plot.settings.push(
                                    {
                                        type: 'colorPicker',
                                        label: partitions[i] + ':',
                                        id: partitions[i]
                                    },
                                );
                            }
                            parent.plotSettingsMenu.load(1);
                        }
                    }
                ]                
            },
        ],
        // data series template
        [
            // drop down for selecting a data series to draw a pie chart from
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
        // plot function used draw pie charts for each selected data series
        function(settings, data, margin, rowsNCols) {
            // computation of values necessary for  positioning and sizing each piechart
            var w = margin.right - margin.left;
            var h = margin.bottom - margin.top; 
            var wPie = w / rowsNCols.cols;
            var hPie = h / rowsNCols.rows;

            var xStart = margin.left;
            var yStart = margin.top;
            
            // iterate over selected data series to plot pie charts in each 'cell' within the
            // formerly computed no. of rows and columns
            for (var i=0; i<data.length; ++i) {
                piefy(data[i][0], 
                    {
                        left: xStart + subMargin,
                        right: xStart + wPie - subMargin,
                        top: yStart + subMargin,
                        bottom: yStart + hPie - subMargin,
                    },
                    settings);
                xStart += wPie;
                if (xStart >= margin.right) {
                    xStart = margin.left;
                    yStart += hPie;
                }
            }
        },
        // dataSet function to update related dropdown lists when new data is loaded
        function() {
            ComponentGenerator.modifyDropdown(parent.plotSettingsMenu.id + 'PartitionBy', parent.data, 1);
        });

    return plot;
}
