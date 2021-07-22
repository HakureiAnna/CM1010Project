/*
 Base Plot type class. This is used to provide a frame of reference for easier development of further plot types.
 */
function Plot(parent, name, settings, dataSeriesTemplate, types, plot, dataSet) {    
    var self = this;
    // used to add variations of the plot (types) to the array for dropdown of sub types
    var loadTypes= function() {
        for (var type in types) {
            dataSeriesTemplate[1].options.push({
                text: type,
                value: type,
            });
        }
    };
    
    var plot = {
        // reference to data visualizer
        parent: parent,
        // name of plot
        name: name,
        // settings for the plot settings menu
        settings: settings,
        // template for data series in data series menu
        dataSeriesTemplate: dataSeriesTemplate,
        // list of subtypes for the plot type
        types: types,
        // function used to perform actual plotting
        plot: plot,
        // function used to repopulate plot settings menu when a new plot type is set
        dataSet: dataSet,
        // get list of selected data series names
        updateData: function() {
            var data = [];
            for (var i=0; i<parent.data.length; ++i) {
                data.push({
                    text: parent.data[i],
                    value: parent.data[i],
                });
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
                if (i==2) {
                    ct = this.parent.data.indexOf(ct);
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
                    if (v == '') {
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
    };

    // initialize sub types in template
    loadTypes();

    return plot;
}