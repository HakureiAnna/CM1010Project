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
    var nodeSizeFactor = 0.6;
    var diameter = 0;
    var strokeWidth = 8;
    var fontSize = 10;
    var textSizeFactor = 0.9;
    var colors = null;

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
        diameter = (d > tmp? tmp: d);
      
        for (var k=0; k< selectedKeys.length; ++k) {
            var shakeX = (Math.random()-0.5) * (1-nodeSizeFactor) * xStep;
            var shakeY = (Math.random()-0.5) * (1-nodeSizeFactor) * yStep;
            nodes[selectedKeys[k]].x = xPos + shakeX;
            nodes[selectedKeys[k]].y = yPos + shakeY;
            xPos += xStep;
            if (xPos >= margin.right) {
                yPos += yStep;
                xPos = margin.left + xStep/2;
            }
        }

    };

    var draw = function() {
        background(255);
        
        // draw edges
        strokeWeight(strokeWidth);
        for (var i=0; i<graph.length; ++i) {
            for (var j=i+1; j<graph[i].length; ++j) {
                if (graph[i][j] > 0) {
                    if (colors) {
                        if (colors[i][j] === '#0') {
                            stroke(0);
                        } else {
                            stroke(colors[i][j]);
                        }
                    }
                    line(nodes[selectedKeys[i]].x, nodes[selectedKeys[i]].y, nodes[selectedKeys[j]].x, nodes[selectedKeys[j]].y);
                }
            }
        }

        // draw nodes
        strokeWeight(1);
        stroke(0);
        textSize(fontSize);
        for (var i=0; i<selectedKeys.length; ++i) {
            var node = nodes[selectedKeys[i]];
            var tW = textWidth(node.node);
            ellipse(node.x, node.y, diameter, diameter);
            text(node.node, node.x-tW/2, node.y+fontSize/3);
        }
    };

    var computeMinDistance = function(distances, nodeUsed) {
        var m = Number.MAX_VALUE;
        var mIndex = -1;
        for (var i=0; i<selectedKeys.length; ++i) {
            if (!nodeUsed[i] && distances[i] <= m) {
                m = distances[i];
                mIndex = i;
            }            
        }
        return mIndex;
    };

    var computePaths = function(data) {
        var paths = [];
        for (var i=0; i<data.length; ++i) {   
            var path = computePath(data[i][0], data[i][1]);
            if (path.length > 0) {
                paths.push({
                    path: path,
                    color: data[i][2]
                });
            }
        }

        colors = [];
        var count = [];
        var tmp = [];
        for (var i=0; i<selectedKeys.length; ++i) {
            tmp.push(0);
        }
        for (var i=0; i<selectedKeys.length; ++i) {
            colors.push(tmp.slice());
            count.push(tmp.slice());
        }
        
        for (var i=0; i<paths.length; ++i) {
            for (var j=0; j<paths[i].path.length-1; ++j) {
                var a = paths[i].path[j];
                var b = paths[i].path[j+1];
                if (a > b) {
                    var tmp = a;
                    a = b;
                    b = tmp;
                }
                var color = parseInt(paths[i].color.substring(1),16);
                colors[a][b] = (colors[a][b] * count[a][b] + color)/(count[a][b]+1);
                count[a][b]++;
            }
        }
        for (var i=0; i<colors.length; ++i) {
            for (var j=0; j<colors[i].length; ++j) {
                colors[i][j] = '#' + Math.round(colors[i][j]).toString(16);
            }
        }
    }

    var computePath = function(src, dst) {
        var distances = [];
        var nodeUsed = [];
        var prevNodes = [];

        for (var i=0; i<selectedKeys.length; ++i) {
            distances.push(Number.MAX_VALUE);
            nodeUsed.push(false);
            prevNodes.push(-1);
        }
        distances[nodes[src].index] = 0;

        for (var i=0; i<selectedKeys.length-1; ++i) {
            var nextNode = computeMinDistance(distances, nodeUsed);

            nodeUsed[nextNode] = true;


            for (var j=0; j<selectedKeys.length; ++j) {
                if (!nodeUsed[j] && graph[nextNode][j] &&
                    distances[nextNode] + graph[nextNode][j] < distances[j]) {
                    prevNodes[j] = nextNode;
                    distances[j] = distances[nextNode] + graph[nextNode][j];
                }
            }
        }
        var path = [];
        var curr = nodes[dst].index;
        while (1) {
            if (curr == -1) {
                path = [];
                break;
            }
            path.push(curr);
            if (curr == nodes[src].index) {
                break;
            }
            curr = prevNodes[curr];
        }
        return path;
    };


    var computeFontSize = function() {
        var maxLen = 0;
        var maxIndex = 0;
        for (var i=0; i<selectedKeys.length; ++i) {
            if (selectedKeys[i].length > maxLen) {
                maxLen = selectedKeys[i].length;
                maxIndex = i;
            }
        }

        fontSize = 10;
        var prevFontSize = fontSize-1;

        textSize(fontSize);
        while (textWidth(selectedKeys[maxIndex]) < diameter * textSizeFactor) {
            prevFontSize = fontSize;
            fontSize++;
            textSize(fontSize);
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
                            computePlotData(marginSize);
                            computeFontSize();

                            var options = [];
                            for (var i=0; i<selectedKeys.length; ++i) {
                                options.push({
                                    value: selectedKeys[i],
                                    text: selectedKeys[i],
                                });
                            }
                            plot.dataSeriesTemplate[0].options = options;
                            plot.dataSeriesTemplate[1].options = options;
                            colors = null;
                            parent.dataSeriesMenu.reset();

                            draw();
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
            var data = plot.getData(templateMenuId);
            computePaths(data);     
            draw(); 
        },
        // dataSet
        function() {
            ComponentGenerator.modifyDropdown(settingsMenuId + this.settings[0].id, parent.data, 1);
            ComponentGenerator.modifyDropdown(settingsMenuId + this.settings[1].id, parent.data, 1);
            ComponentGenerator.modifyDropdown(settingsMenuId + this.settings[2].id, parent.data, 1);
        });

    return plot;
}
