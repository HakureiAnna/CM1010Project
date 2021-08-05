/*
    Data Source Menu that is used to choose between external/ internal data, configure the way the data is imported
 */
function DataSourceMenu(parent, menuId) {
    // initialize base class
    var menu = Menu(parent, menuId, [
        // radio button set to select between internal and external data sets
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
        // radio button set to select between row-based or column-based data
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
        // checkbox to set if imported data has header row/ column
        {
            type: 'checkbox',
            id: 'WithHeaders',
            label: 'With Headers'
        },
        // textbox to enter path (URI) to dataset
        {
            type: 'textBox',
            id: 'Path',
            label: 'Path:'
        },
        // button to load data
        {
            type: 'button',
            id: 'GetData',
            text: 'Get Data',
            // handler for when load data is pressed
            handlers: [
                {
                    type: 'click',
                    target: 0,
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
