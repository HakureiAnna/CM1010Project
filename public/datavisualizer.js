function DataVisualizer() {
    var self = null;

    /*
        if data is loaded by rows, choosable data series will either have
        first row header or column number as name
     */
    var loadRows = function(data) {
        if (self.withHeaders) {
            self.data = data.columns;
            return;
        }
        // no header NOT IMPLEMENTED YET
    };
    
    /*
        if data is loaded by columns, choosable data series will either have
        first column header or row number as names
        NOT IMPLEMENTED YET
     */
    var loadColumns = function(data) {
        if (withHeaders) {
            
        }
    };

    return {
        sideBars: {},
        plotWindow: null,
        dataSourceMenu: null,
        dataSeriesMenu: null,
        plotSettingsMenu: null,
        plots: {},
        data: [],
        rawData: null,
        dataSeries: [],
        plot: null,
        toolBar: null,
        infoBar: null,
        withHeaders: false,
        rowOrColumn: null,
        currentPlot: '',
        /*
            initialization function
        */
        setup: function() {
            self = this;
            
            this.plotWindow.setup();

            this.infoBar.setup();
            
            for (key in this.sideBars) {
                this.sideBars[key].setup();
            }
        },
        addSideBar: function(name, sidebar) {
            this.sideBars[name] = sidebar;
        },
        setInfoBar: function(infoBar) {
            this.infoBar = infoBar;
        },
        setPlotWindow: function(plotWindow) {
            this.plotWindow = plotWindow;
        },
        /*
            function to be called from sidebar to resize the plot window
            using updated dimensions of the calling sidebar
            delta: refers to the amount of resizing
            isCollapsing: if the sidebar is being collapsed, use to determine
                          if to subtract/ add the delta from the plot window
                          dimensions
        */
        resizePlotWindow: function(delta, isCollapsing) {            
            var d = {
                width: isCollapsing? delta.width: -delta.width,
                height: isCollapsing? delta.height: -delta.height
            };
            this.plotWindow.resize(d, false);
        },
        addPlot: function(plot) {
            this.plots[plot.name] = plot;
        },
        /*
            function called during a browser window resize event
        */
        resize: function() {
            for (key in this.sideBars) {
                if (this.sideBars[key].collapsed) {
                    this.sideBars[key].collapse();
                }
            }
            // fit the plot window to new window size so that
            // left sidebar can be resized based on this
            // (if plot window size is not changed first, 
            // left sidebar) cannot be resized
            this.plotWindow.resize({
                width: window.innerWidth * 0.75,
                height: window.innerHeight * 0.90
            }, true);
            // resize left sidebar and get its dimensions
            this.sideBars.left.resize();
            var left = getDimensions(this.sideBars.left.sideBarId);
            // now resize plot window again to make sure it is a snap fit
            this.plotWindow.resize({
                width: window.innerWidth * 0.75,
                height: left.height
            }, true);
            // resize the remaining components
            this.sideBars.top.resize();
            this.sideBars.bottom.resize();
        },
        loadData: function(uri, rowOrColumn, withHeaders) {
            self.rowOrColumn = rowOrColumn;
            self.withHeaders = withHeaders;

            loadTable(uri, withHeaders?'header':'', this.dataLoaded, this.dataLoadError);            
        },
        dataLoaded: function(data) {
            if (data.rows.length == 0) {
                self.infoBar.error('No data retrieved. Please try another data source.');
                return;
            }

            self.rowOrColumn == 'row'? loadRows(data): loadColumns(data);

            for (var p in self.plots) {
                self.plots[p].updateData();
            }

            if (parent.currentPlot != undefined) {
                self.plots[self.currentPlot].dataSet();
            }

            self.rawData = data;
        },
        dataLoadError: function() {
            self.infoBar.error('Loading data failed. please try another data source.');
        }
    };
}