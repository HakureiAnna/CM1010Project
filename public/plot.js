function Plot(parent, name, settings, dataSeriesTemplate, plot, dataSet) {    
    var self = this;

    return {
        parent: parent,
        name: name,
        settings: settings,
        dataSeriesTemplate: dataSeriesTemplate,
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
        }
    };
}