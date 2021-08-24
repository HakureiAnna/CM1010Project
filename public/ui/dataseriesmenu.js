/**************************************************************
 * File: public/ui/dataseriesmenu.js
 * Description: Data series menu class, in charge of maintaining 
 * the list of data series to be ploted.
 * Author: Liu Anna
 **************************************************************/

function DataSeriesMenu(parent, menuId) {
    // no. of data series
    var count = 0;

    // used to update counter display
    var update = function() {
        ComponentGenerator.updateTextBox(menuId + 'DataSeriesCounter', count);
    }

    // initialize base class
    var menu = Menu(parent, menuId, [
        // plotting button
        {
            type: 'button',
            text: 'Plot',
            id: 'Plot',
            handlers: [
                {
                    type: 'click',
                    target: 0,
                    handler: function() {
                        if (parent.currentPlot != '') {
                            parent.gallery.reset();   
                            parent.plots[parent.currentPlot].plot();
                        }
                    }
                }
            ],
        },
        // counter component used to display no. of plotted data series
        {
            type: 'counter',
            label: 'Data Series Count: ',
            id: 'DataSeriesCounter',  
            handlers: [
                {
                    type: 'click',
                    target: 2,
                    // handler for when the add button is pressed                    
                    handler: function() {  
                        // guard to check if current plot is set
                        if (parent.currentPlot == '') {
                            return;
                        }
                        var container = document.getElementById(menuId + 'Container');                        
                        container.appendChild(ComponentGenerator.generateCard(menuId + 'DataSeries' + count, 'Data Series ' + count));
                        var template = parent.plots[parent.currentPlot].dataSeriesTemplate;
                        var cardContainer = document.getElementById(menuId + 'DataSeries' + count + 'Container');
                        for (var i=0; i<template.length; ++i) {
                            var component = ComponentGenerator.generateComponent(menuId + 'DataSeries' + count, template[i]);
                            cardContainer.appendChild(component);
                        }

                        count++;
                        update();
                    }
                },
                {
                    type: 'click',
                    target: 3,
                    // handler for when the remove button is pressed
                    handler: function() {
                        if (count > 0) {
                            var container = document.getElementById('DataSeriesMenuContainer');
                            var n = container.children.length;
                            container.removeChild(container.children[n-1]);
                            count--;
                            update();
                        }
                    }
                },
            ]          
        },
    ]);

    // used to reset the selected data series when earlier stages (data source and plot settings are reconfigured)
    menu.reset = function() {
        var container = document.getElementById(menuId + 'Container');
        while (count > 0) {
            container.removeChild(container.children[container.children.length-1]);
            count--;
        }
        update();
    };

    // initial update call to display counter as 0
    update();

    return menu;
}