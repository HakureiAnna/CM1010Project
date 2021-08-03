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
    var nodeKeys = null;
    var nodes = null;
    var selectedKeys = null;
    var graph = null;
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

        nodeKeys = Array.from(intermediate);

        plot.settings[3].options = [];
        for (var i=0; i<nodeKeys.length; ++i) {
            plot.settings[3].options.push({
                value: nodeKeys[i],
                text: nodeKeys[i]
            });
        }
        parent.plotSettingsMenu.load(3);
    };

    var computePlotData = function(marginSize) {        
        var drp = document.getElementById('drp' + settingsMenuId + plot.settings[3].id);
        var tmp = ComponentGenerator.getMultiselectValue(drp);
        nodes = {};
        for (var i=0; i<tmp.length; ++i) {
            nodes[tmp[i]] = {
                index: i,
                x: 0,
                y: 0,
                node: tmp[i]
            };
        }
        selectedKeys = Object.keys(nodes);


        // create new graph
        graph = [];
        var row = [];
        for (var i=0; i<tmp.length; ++i) {
            row.push(0);
        }
        for (var i=0; i<tmp.length; ++i) {
            graph.push(row.slice());
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
            if (key in nodes && link in nodes) {
                graph[nodes[key].index][nodes[link].index] = cost;
                graph[nodes[link].index][nodes[key].index] = cost;
            }
        }

        // fill graph with plot window positions
        margin = plot.computeMargin(marginSize);
        var rnc = plot.computeRowsAndColumns(graph.length);

        var xStep = (margin.right - margin.left)/rnc.cols;
        var yStep = (margin.bottom - margin.top)/rnc.rows;        
        var xPos = margin.left + xStep/2;
        var yPos = margin.top + yStep/2;
        var d = xStep * nodeSizeFactor;
        tmp = yStep * nodeSizeFactor;        
        d = (d > tmp? tmp: d);
      
        for (var k=0; k< selectedKeys.length; ++k) {
            nodes[selectedKeys[k]].x = xPos;
            nodes[selectedKeys[k]].y = yPos;
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
        
        // draw edges
        for (var i=0; i<graph.length; ++i) {
            for (var j=i+1; j<graph[i].length; ++j) {
                if (graph[i][j] > 0) {
                    line(nodes[selectedKeys[i]].x, nodes[selectedKeys[i]].y, nodes[selectedKeys[j]].x, nodes[selectedKeys[j]].y);
                }
            }
        }

        // draw nodes
        for (var i=0; i<selectedKeys.length; ++i) {
            var node = nodes[selectedKeys[i]];
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
