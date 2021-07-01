function XYPlot() {
    var xAxisOptions = [];
    return Plot('XY Plot',
        // settings
        [
            {
                type: 'dropDown',
                label: 'X-Axis Data Series:',
                id: 'XAxisDataSeries',
                default: 'Select data series for x-axis',
                options: xAxisOptions,
                handlers: [
                    {

                    }
                ]                
            },
            {
                type: 'checkbox',
                label: 'Show Grid',
                id: 'grid'
            }
        ],
        // data series template
        [

        ],
        // plot
        function() {

        });
}

/*

            type: 'dropDown',
            label: 'Graph Type:',
            id: 'Plot',
            default: 'Select graph type',
            options: options,
            handlers: [
                {
                    type: 'change',
                    handler: function() {
                        var selection = getDropdownValue(menuId+ 'Plot');
                        resetSettings();
                        loadSettings(selection);
                    }
                }
            ]
*/