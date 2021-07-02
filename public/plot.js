function Plot(parent, name, settings, dataSeriesTemplate, types, plot, dataSet) {    
    var self = this;
    var loadTypes= function() {
        for (var type in types) {
            dataSeriesTemplate[1].options.push({
                text: type,
                value: type,
            });
        }
    };

    var plot = {
        parent: parent,
        name: name,
        settings: settings,
        dataSeriesTemplate: dataSeriesTemplate,
        types: types,
        plot: plot,
        dataSet: dataSet,
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

    loadTypes();

    return plot;
}