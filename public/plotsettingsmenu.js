/*
    Plot Settings Menu used for placing settings related to the entire plot
*/
function PlotSettingsMenu(parent, menuId) {
    // list of plot types
    var options = [];
    for (var p in parent.plots) {
        options.push(
            {
                value: parent.plots[p].name,
                text: parent.plots[p].name
            }
        );
    }
    // used to reset this menu to default  settings
    var resetSettings = function(start) {
        var cont = document.getElementById(menuId + 'Container');    
        var n = cont.childNodes.length;
        while (n > start) {
            cont.removeChild(cont.childNodes[n-1]);
            n = cont.childNodes.length;
        }
    }
    // used to load plot specific settings
    var loadSettings = function(plot, start) {
        var settings = parent.plots[plot].settings;
        var cont = document.getElementById(menuId + 'Container');   
        for (var i=start; i<settings.length; ++i) {
            cont.appendChild(ComponentGenerator.generateComponent(menuId, settings[i]));
        }
    }

    // initialize base menu
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
                    // handler for when a new plot is selcted
                    handler: function() {
                        var selection = getDropdownValue(menuId+ 'Plot');
                        resetSettings(2);
                        if (selection == '') {
                            return;
                        }
                        parent.currentPlot = selection;
                        loadSettings(selection, 0);
                        parent.plots[parent.currentPlot].dataSet();
                          
                        parent.dataSeriesMenu.reset();         
                        parent.gallery.reset();          
                    }
                }
            ]
        },
    ]);

    menu.reset = function() {
        var dropdown = document.getElementById('drp' + menuId + 'Plot');
        dropdown.value = '';
        resetSettings(2);
    };

    menu.load = function(start) {
        resetSettings(start+2);
        loadSettings(parent.currentPlot, start);
    }
    
    return menu;
}
