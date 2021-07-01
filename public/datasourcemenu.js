function DataSourceMenu(parent, menuId) {
    var menu = Menu(parent, menuId, [
        {
            type: 'radioButtons',
            label: 'Source Type:', 
            group: 'SourceType',
            name: 'SourceType', 
            options: [
                {
                    label: 'External',
                    value: 'external'
                },
                {
                    label: 'Internal',
                    value: 'internal'
                }
            ]
        },
        {
            type: 'textBox',
            id: 'Path',
            label: 'Path:'
        },
        {
            type: 'button',
            id: 'GetData',
            text: 'Get Data',
            handlers: [
                {
                    type: 'click',
                    handler: function() {
                        var sourceType = getRadioButtonValue(menuId + 'SourceType');
                        if (sourceType == null) {
                            parent.infoBar.warn('Please choose a source type and retry.');
                            return;
                        }
                        var uri = '';
                        if (sourceType == 'external') {
                            uri = 'load?uri=';
                        }
                        uri += getTextBoxValue(menuId + 'Path');
                        parent.loadData(uri);
                    }
                }
            ]
        },
        {
            type: 'radioButtons',
            label: 'Data Orientation:',
            group: 'DataOrientation',
            name: 'DataOrientation',
            options: [
                {
                    label: 'Column',
                    value: 'column',
                },
                {
                    label: 'Row',
                    value: 'row'
                },
            ]
        }
    ]);
    
    return menu;
}
