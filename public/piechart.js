/*
    concrete line plot class.
*/
function Piechart(parent, settingsMenuId, templateMenuId) {
    /* 
        list of possible plot settings currently set statically
    */
    // plot margins    
    var marginSize = 35;
    var subMargin = 10;

    var self = this;

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

            fill(settings[i+1]);
            var next = (start + rad) % (2 * Math.PI);
            arc(midX, midY, d, d, start, next);
            start = next;
        }
    };
 
  
    // initialize based plot object
    var plot = Plot(
        parent,
        'Pie Chart',
        // settings
        [
            {
                type: 'dropDown',
                label: 'Partition By:',
                id: 'PartitionBy',
                default: 'Select Row/ Column to partition by.',
                options: [],
                handlers: [
                    {
                        type: 'change',
                        target: 1,
                        handler: function(e) {
                            // remove all except first component in template
                            var n = plot.settings.length;
                            plot.settings.splice(1, n-1);

                            // add colorpickers for each in partition by
                            var partitionBy = document.getElementById('drp' + settingsMenuId + plot.settings[0].id).value;
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

            var rowsNCols = this.computeRowsAndColumns(data.length);
            var w = margin.right - margin.left;
            var h = margin.bottom - margin.top; 
            var wPie = w / rowsNCols.cols;
            var hPie = h / rowsNCols.rows;

            var xStart = margin.left;
            var yStart = margin.top;
            
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
        // dataSet
        function() {
            ComponentGenerator.modifyDropdown(settingsMenuId + 'PartitionBy', parent.data, 1);
        });

    return plot;
}
