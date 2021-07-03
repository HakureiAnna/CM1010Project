function DataSeriesMenu(parent, menuId) {
    var count = 0;

    var update = function() {
        ComponentGenerator.updateTextBox(menuId + 'DataSeriesCounter', count);
    }

    var menu = Menu(parent, menuId, [
        {
            type: 'button',
            text: 'Plot',
            id: 'Plot',
            handlers: [
                {
                    type: 'click',
                    target: 'btn' + menuId + 'Plot',
                    handler: function() {
                        if (parent.currentPlot != '') {
                            parent.plots[parent.currentPlot].plot();
                        }
                    }
                }
            ],
        },
        {
            type: 'counter',
            label: 'Data Series Count: ',
            id: 'DataSeriesCounter',  
            handlers: [
                {
                    type: 'click',
                    target: 'btn' + menuId + 'DataSeriesCounterUp',
                    handler: function() {  
                        parent.gallery.reset();          
                        
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
                    target: 'btn' + menuId + 'DataSeriesCounterDown',
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

    menu.reset = function() {
        var container = document.getElementById(menuId + 'Container');
        while (count > 0) {
            container.removeChild(container.children[container.children.length-1]);
            count--;
        }
        update();
    };

    update();

    return menu;
}