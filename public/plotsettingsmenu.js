function PlotSettingsMenu(parent, menuId) {
    var options = [];
    for (var p in parent.plots) {
        options.push(
            {
                value: parent.plots[p].name,
                text: parent.plots[p].name
            }
        );
    }
    var resetSettings = function() {
        var cont = document.getElementById(menuId + 'Container');    
        var keys = Object.keys(menu.components);
        var n = keys.length;
        for (var i=1; i<n; ++i) {
            menu.removeComponent(keys[i]);
        }
    }
    var loadSettings = function(plot) {
        var settings = parent.plots[plot].settings;
        for (var i=0; i<settings.length; ++i) {
            menu.addComponent(settings[i]);
        }
    }

    var menu = Menu(parent, menuId, [
        {
            type: 'dropDown',
            label: 'Graph Type:',
            id: 'Plot',
            default: 'Select graph type',
            options: options,
            handlers: [
                {
                    type: 'change',
                    target: 'drp' + menuId + 'Plot',
                    handler: function() {
                        var selection = getDropdownValue(menuId+ 'Plot');
                        resetSettings();
                        if (selection == 'Select graph type') {
                            return;
                        }
                        parent.currentPlot = selection;
                        loadSettings(selection);
                        parent.plots[parent.currentPlot].dataSet();
                          
                        parent.dataSeriesMenu.reset();       
                    }
                }
            ]
        },
    ]);

    menu.reset = function() {
        var dropdown = document.getElementById('drp' + menuId + 'Plot');
        dropdown.value = 'Select graph type';
        resetSettings();
    };
    
    return menu;
}
