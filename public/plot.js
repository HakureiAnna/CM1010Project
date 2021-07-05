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
    };

    // initialize sub types in template
    loadTypes();

    return plot;
}