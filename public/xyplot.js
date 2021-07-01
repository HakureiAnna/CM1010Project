function XYPlot(parent, menuId) {
    var typeOptions = [
        {
            value: 'line',
            text: 'Line',
        }
    ];
    var xAxisOptions = [];    
    var self = this;

    return Plot(
        parent,
        'XY Plot',
        // settings
        [
            {
                type: 'dropDown',
                label: 'X-Axis Data Series:',
                id: 'XAxisDataSeries',
                default: 'Select data series for x-axis',
                options: xAxisOptions,
                handlers: [
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
            {
                type: 'dropDown',
                label: 'Data Series:',
                id: 'DataSeries',
                default: 'Select Data Series',
                options: null,
            },
            {
                type: 'dropDown',
                label: 'Type:',
                id: 'Type',
                default: 'Select Type',
                options: typeOptions,
            },
        ],
        // plot
        function() {

        },
        // dataSet
        function() {
            ComponentGenerator.modifyDropdown(menuId + 'XAxisDataSeries', parent.data, 1);
        });
}
