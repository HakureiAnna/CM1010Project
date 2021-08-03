/*
    concrete line plot class.
*/
function GraphPlot(parent, settingsMenuId, templateMenuId) {
    /* 
        list of possible plot settings currently set statically
    */
    // plot margins    
    var marginSize = 35;
    var destination = '';
    var source = '';
    var weight = '';
    var nodes = null;
    var graph = null;
    var edges = null;
    var margin = null;
    var nodeSizeFactor = 0.8;

    var self = this;

    var updateNodesList = function() {
        if (destination === '' || source === '' || weight === '') {
            return;
        }

        var intermediate = new Set();
        var data = parent.getColumn(source);
        data.forEach((d) => {
            intermediate.add(d);
        });
        var data = parent.getColumn(destination);
        data.forEach((d) => {
            intermediate.add(d);
        });

        nodes = Array.from(intermediate);
        plot.settings[3].options = [];
        for (var i=0; i<nodes.length; ++i) {
            plot.settings[3].options.push({
                value: nodes[i],
                text: nodes[i]
            });
        }
        parent.plotSettingsMenu.load(3);
    };

    var computePlotData = function(marginSize) {        
        var drp = document.getElementById('drp' + settingsMenuId + plot.settings[3].id);
        var selected = ComponentGenerator.getMultiselectValue(drp);
        // create new graph
        graph = {};
        for (var i=0; i<selected.length; ++i) {
            graph[selected[i]] = {
                node: selected[i],
                x: 0,
                y: 0,
                links: []
            };
        }

        // fill links
        var src = parent.normalizeColumn(source);
        var dst = parent.normalizeColumn(destination);
        var wgt = parent.normalizeColumn(weight);
        var n = parent.rawData.getRowCount();
        for (var i=0; i<n; ++i) {

            var row = parent.rawData.getRow(i);
            var key = row.get(src);
            var link = row.get(dst);
            var cost = row.getNum(wgt);
            if (key in graph && link in graph) {
                graph[key].links.push({
                    link: link,
                    weight: cost,
                    color: 'black'
                });
            }
        }

        console.log(graph);

        // fill graph with plot window positions
        margin = plot.computeMargin(marginSize);
        var keys = Object.keys(graph);
        var n = keys.length;
        var rnc = plot.computeRowsAndColumns(n);

        var xStep = (margin.right - margin.left)/rnc.cols;
        var yStep = (margin.bottom - margin.top)/rnc.rows;        
        var xPos = margin.left + xStep/2;
        var yPos = margin.top + yStep/2;
        var d = xStep * nodeSizeFactor;
        var tmp = yStep * nodeSizeFactor;        
        d = (d > tmp? tmp: d);
      
        for (var k=0; k<n; ++k) {
            graph[keys[k]].x = xPos;
            graph[keys[k]].y = yPos;
            xPos += xStep;
            if (xPos >= margin.right) {
                yPos += yStep;
                xPos = margin.left + xStep/2;
            }
        }

        return {
            diameter: d,
        };
    };

    var drawNodes = function(plotData) {
        background(255);
        
        var keys = Object.keys(graph);
        for (var i=0; i<keys.length; ++i) {
            var a = graph[keys[i]];
            for (var j=0; j<graph[keys[i]].links.length; ++j) {
                var link = graph[keys[i]].links[j];
                var b = graph[link.link];
                stroke(link.color);
                line(a.x, a.y, b.x, b.y);
            }
        }


        for (var i=0; i<keys.length; ++i) {
            var node = graph[keys[i]];
            var tW = textWidth(node.node);
            ellipse(node.x, node.y, plotData.diameter, plotData.diameter);
            text(node.node, node.x-tW/2, node.y);
        }
    };

  
    // initialize based plot object
    var plot = Plot(
        parent,
        'Graph Plot',
        // settings
        [
            {
                type: 'dropDown',
                label: 'Source:',
                id: 'Source',
                default: 'Select row/ column containing the source.',
                options: [],
                handlers: [
                    {
                        type: 'change',
                        target: 1,
                        handler: function(e) {
                            source = e.target.value;
                            updateNodesList();
                        }
                    }
                ]                
            },
            {
                type: 'dropDown',
                label: 'Destination:',
                id: 'Destination',
                default: 'Select row/ column containing the destination.',
                options: [],
                handlers: [
                    {
                        type: 'change',
                        target: 1,
                        handler: function(e) {
                            destination = e.target.value;
                            updateNodesList();
                        },
                    },
                ]                
            },
            {
                type: 'dropDown',
                label: 'Weight:',
                id: 'Weight',
                default: 'Select row/ column containing the weight.',
                options: [],
                handlers: [
                    {
                        type: 'change',
                        target: 1,
                        handler: function(e) {
                             weight = e.target.value;
                            updateNodesList();
                        }
                    }
                ]
            },
            {
                type: 'dropDown',
                label: 'Nodes to Display:',
                id: 'NodesToDisplay',
                multi: true,
                options: [],
                handlers: [
                    {
                        type: 'change',
                        target: 1,
                        handler: function(e) {
                            drawNodes(
                                computePlotData(marginSize));
                        }
                    }
                ]
            }
        ],
        // data series template
        [
            {
                type: 'dropDown',
                label: 'Source:',
                id: 'Source',
                default: 'Select source node.',
                options: [],
                handlers: [
                ]
            },
            {
                type: 'dropDown',
                label: 'Destination:',
                id: 'Destination',
                default: 'Select destination node.',
                options: [],
                handlers: [
                ]
            },{
                type: 'colorPicker',
                label: 'Highlight Color:',
                id: 'HighlightColor',
            },
        ],
        // types
        null,
        // plot
        function() {
        },
        // dataSet
        function() {
            ComponentGenerator.modifyDropdown(settingsMenuId + this.settings[0].id, parent.data, 1);
            ComponentGenerator.modifyDropdown(settingsMenuId + this.settings[1].id, parent.data, 1);
            ComponentGenerator.modifyDropdown(settingsMenuId + this.settings[2].id, parent.data, 1);
        });

    return plot;
}
