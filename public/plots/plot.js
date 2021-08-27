/**************************************************************
 * File: public/plots/plot.js
 * Description:  Base Plot type class. This is used to provide a frame of reference for easier development of further plot types.
 * Author: Liu Anna
 **************************************************************/

function Plot(parent, name, marginSize, settings, dataSeriesTemplate, types, drawPlot, dataSet) {    
    var titleSpace = 40;
    var titleTextSize = 20;
    var legendSpace = 10;
    var legendWidth = 100;
    var legendTextSize = 12;

    // used to add variations of the plot (types) to the array for dropdown of sub types
    // currently only truly used in xyplot as for the other plot types, no real 'subtype' 
    // has been found to be useful and thus not implemented.
    var loadTypes= function() {
        for (var type in types) {
            dataSeriesTemplate[1].options.push({
                text: type,
                value: type,
            });
        }
    };

    var drawTitle = function(margin) {
        var w = textWidth(parent.title);
        var x = (margin.right - margin.left - w)/2;
        textSize(titleTextSize);
        textAlign(LEFT, TOP);
        stroke(255);
        fill(0);
        text(parent.title, x, plot.marginSize);
    };
    
    var drawLegends = function(data, margin) {
        var x = margin.right - legendWidth - legendSpace;
        var y = margin.top + legendSpace;
        var h = (legendTextSize + legendSpace)* data.length + legendSpace;
        stroke(0);
        fill(255);
        rect(x, y, legendWidth, h);
        x += legendSpace;
        y += legendSpace;
        textSize(legendTextSize);
        textAlign(LEFT, TOP);
        console.log(data);
        var colorId = -1;
        for (var i=0; i<data[0].length; ++i) {
            if (data[0][i][0] == '#') {
                colorId = i;
                break;
            }
        }
        stroke(255);
        for (var i=0; i<data.length; ++i) {
            if (colorId < 0) {
                fill(0);
            } else {
                fill(data[i][colorId]);
            }
            text(data[i][0], x, y);
            y += legendSpace + legendTextSize;
        } 
    };
    
    var plot = {
        // reference to data visualizer
        parent: parent,
        // name of plot
        name: name,
        marginSize: marginSize,
        // settings for the plot settings menu
        settings: settings,
        // template for data series in data series menu
        dataSeriesTemplate: dataSeriesTemplate,
        // list of subtypes for the plot type
        types: types,
        // function used to perform actual plotting
        drawPlot: drawPlot,
        plot: function() {
            background(255);
            textAlign(LEFT, BASELINE);

            // setup and initialization
            var settings = this.getSettings(parent.plotSettingsMenu.id);
            var data = this.getData(parent.dataSeriesMenu.id);
            var margin = this.computeMargin(marginSize, settings[0]);
            var rowsNCols = this.computeRowsAndColumns(data.length);

            drawPlot(settings, data, margin, rowsNCols);

            if (settings[0]) {
                drawTitle(margin);
            }

            if (settings[1]) {
                drawLegends(data, margin);
            }
        },
        // function used to repopulate plot settings menu when a new plot type is set
        dataSet: dataSet,
        // get list of selected data series names
        updateData: function(altData=null) {
            var data = [];
            if (altData) {                
                for (var i=0; i<altData.length; ++i) {
                    data.push({
                        text: altData[i],
                        value: altData[i],
                    });
                }
            } else {
                for (var i=0; i<parent.data.length; ++i) {
                    data.push({
                        text: parent.data[i],
                        value: parent.data[i],
                    });
                }
            }
            this.dataSeriesTemplate[0].options = data;
        },     
        
        // function used to get plot setitngs menu settings
        getSettings: function(settingsMenuId) {
            var settings = [];
            var c = document.getElementById(settingsMenuId + 'Container');
            //var prefix = parent.rowOrColumn=='row'? 'Row ': 'Column ';
            for (var i=2; i<c.childNodes.length; ++i) {
                var ct = c.childNodes[i].childNodes[1].value;
                if (i==4) {
                    ct = this.parent.data.indexOf(ct);
                } else if (c.childNodes[i].childNodes[1].multiple) {
                    ct = [];
                    for (var j=0; j<c.childNodes[i].childNodes[1].options.length; ++j) {
                        if (c.childNodes[i].childNodes[1].options[j].selected) {
                            ct.push(c.childNodes[i].childNodes[1].options[j].value);
                        }
                    }
                } else if (c.childNodes[i].childNodes[1].type == 'checkbox') {
                    ct = c.childNodes[i].childNodes[1].checked;
                }
                settings.push(ct);
            }
            return settings;
        },
        // function used to get list of data series names
        getData: function(templateMenuId) {        
            var data = [];
            var c = document.getElementById(templateMenuId + 'Container');
            for (var i = 3; i<c.childNodes.length; ++i) {
                // each data series's container
                var ct = c.childNodes[i].childNodes[1].childNodes[0];
                var datum = [];
                for (var j=0; j<ct.childNodes.length; ++j) {
                    var v = ct.childNodes[j].childNodes[1].value;
                    if (v == 'default') {
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
        },
        // compute margin based on current plot windows dimensions
        computeMargin: function(margin, drawTitle) {
            var left = margin * 2;
            var right = width - margin * 2;
            var bottom = height - margin * 2;
            var top = margin * 2;
            if (drawTitle) {
                top += titleSpace;
            }
    
            return {
                left: left,
                right: right,
                bottom: bottom,
                top: top
            };
        },
        // utility function used to compute the no. of rows and columns 
        // necessary for producing the visualization based on the number
        // of data series, n, selected
        computeRowsAndColumns: function(n) {
            var elements = Math.ceil(Math.sqrt(n));
            var cols = elements;
            var rows = 1;
            while (cols * rows < n) {
                rows += 1;
            }
            return {
                rows: rows,
                cols: cols
            };
        },
    };

    if (types) {
        // initialize sub types in template
        loadTypes();
    }

    return plot;
}