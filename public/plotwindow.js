function PlotWindow(parent, id) {
    var plotWindow = document.getElementById(id);

    return {
        canvas: null,
        dimensions: null,
        /*
            initialization function
        */
        setup: function() {
            var canvasContainer = select(id);
            
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
    };
}