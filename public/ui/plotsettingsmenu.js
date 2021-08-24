/**************************************************************
 * File: public/ui/plotsettingsmenu.js
 * Description: Plot Settings Menu used for placing settings 
 * related to the entire plot.
 * Author: Liu Anna
 **************************************************************/

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
                    target: 1,
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

    // function used for resetting the plot settings menu. Removing all extra options
    // except the graph type drop down which is required for any customized plot
    // settings menu
    menu.reset = function() {
        var dropdown = document.getElementById('drp' + menuId + 'Plot');
        dropdown.value = '';
        resetSettings(2);
    };

    // function used to load settings from the currently selected plot type
    // using the parameter start to determine the no. of default settings (unique)
    // to each plot types to remain in the menu before loading the new settings.
    menu.load = function(start) {
        resetSettings(start+2);
        loadSettings(parent.currentPlot, start);
    }
    
    return menu;
}
