/**************************************************************
 * File: public/ui/plotwindow.js
 * Description: Plot Window class, used for auto resizing of
 * the plot window (canvas).
 * Author: Liu Anna
 **************************************************************/

function PlotWindow(parent, id) {
    return {
        // canvas reference
        canvas: null,
        // current dimensions of the plot window
        dimensions: null,
        /*
            initialization function
        */
        setup: function() {            
            this.dimensions = getDimensions(id);
            
            this.canvas = createCanvas(this.dimensions.width, this.dimensions.height);
            this.canvas.parent(id);
            this.canvas.class('flex-grow-1');

        },
        /*
            function used to resize the plot window
            abs: determines the mode of operation
            delta: abs = true, refers to the dimension to resize to 
                   abs = false, refers to the amount to resize by
        */
        resize: function(delta, abs) {            
            resizeCanvas((abs? 0: this.dimensions.width) + delta.width, (abs? 0: this.dimensions.height) + delta.height);
            this.dimensions = getDimensions(id);
        }, 
        save: function() {
            saveCanvas(this.canvas, 'plot', 'png');
        }
    };
}