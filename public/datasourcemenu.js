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
        },,
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
        },
        {
            type: 'checkbox',
            id: 'WithHeaders',
            label: 'With Headers'
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
                    target: 'btn' + menuId + 'GetData',
                    handler: function() {
                        var sourceType = getRadioButtonValue(menuId + 'SourceType');
                        if (sourceType == null) {
                            parent.infoBar.warn('Please choose a source type and retry.');
                            return;
                        }

                        var orientation = getRadioButtonValue(menuId + 'DataOrientation');
                        if (orientation == null) {
                            parent.infoBar.warn('Please choose a data orientation and retry.');
                            return;
                        }

                        var withHeaders = getCheckboxValue(menuId + 'WithHeaders');

                        var tmp = getTextBoxValue(menuId + 'Path');
                        if (tmp == '') {
                            parent.infoBar.warn('Please enter a data source and retry.');
                            return;
                        }
                        var uri = '';
                        if (sourceType == 'external') {
                            uri = 'load?uri=';
                        }
                        uri += tmp;

                        parent.loadData(uri, orientation, withHeaders);
                        parent.plotSettingsMenu.reset();        
                        parent.dataSeriesMenu.reset();     
                        parent.gallery.reset();           
                    }
                },
            ]
        }
    ]);
    
    return menu;
}
