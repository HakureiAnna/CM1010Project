/*
    this is the main class for the new application.
 */
function DataVisualizer() {
    // self pointer
    var self = null;
    
    /*
        if data is loaded by rows, choosable data series will either have
        first row header or column number as name
     */
    var loadRows = function(data) {
        if (self.withHeaders) {
            self.data = data.columns;
            return data;
        }
        var cols = [];
        for (var i=0; i<data.columns.length; ++i) {
            cols.push('Column ' + (i+1));
        };
        data.columns = cols;
        self.data = cols;
        return data;
    };
    
    /*
        if data is loaded by columns, choosable data series will either have
        first column header or row number as names
     */
    var loadColumns = function(data) {
        if (self.withHeaders) {
            var rows = [];
            var cols = [];
            var rowN = data.getRowCount();
            var colN = data.getColumnCount();
        
            for (var i=0; i<colN-1; ++i) {
                rows.push('');
            }
            for (var i=0; i<rowN; ++i) {
                var r = data.rows[i];
                for (var j=0; j<colN; ++j) {	
                    if (j==0)  {
                        cols.push(r.get(j));
                    } else {
                        rows[j-1] += r.get(j);
                        if (i<rowN-1) {
                            rows[j-1]+=',';
                        }
                    }
                }
            }	
            var data_t = new p5.Table();	
            for (var i=0; i<colN-1; ++i) {
                data_t.addRow( new p5.TableRow(rows[i]));
            }
            data_t.columns = cols;      
            self.data = cols;
            return data_t;
        }
        var rows = [];
        var  cols = [];
        var rowN = data.getRowCount();
        var colN = data.getColumnCount();
    
        for (var i=0; i<colN; ++i) {
            rows.push('');
        }
        for (var i=0; i<rowN; ++i) {
            var r = data.rows[i];
            cols.push('Row ' + (i+1));
            for (var j=0; j<colN; ++j) {	
                rows[j] += r.get(j);
                if (i<rowN-1) {
                    rows[j]+=',';
                }
            }
        }	
        var data_tnh = new p5.Table();	
        for (var i=0; i<colN; ++i) {
            data_tnh.addRow( new p5.TableRow(rows[i]));
        }
        data_tnh.columns = cols;
        self.data = cols;
        return data_tnh;
    };

    return {
        // dict of side bars
        sideBars: {},
        // plot window reference
        plotWindow: null,
        // data source menu reference
        dataSourceMenu: null,
        // data series menu reference
        dataSeriesMenu: null,
        // plot settings menu reference
        plotSettingsMenu: null,
        // dict of plot types
        plots: {},
        // selected data series
        data: [],
        // holds the P5.Table reference
        rawData: null,
        // toolbar refernce
        toolBar: null,
        // info bar reference
        infoBar: null,
        // flag indicating if loaded data has headers
        withHeaders: false,
        // indicates if row-based or column-based data
        rowOrColumn: null,
        // currently selected plot
        currentPlot: '',
        // reference to original template
        setGallery: function(gallery) {
            this.gallery = gallery;
        },
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
        /*
            add new sidebar to data visualizer
         */
        addSideBar: function(name, sidebar) {
            this.sideBars[name] = sidebar;            
        },
        /*
            set info bar
         */
        setInfoBar: function(infoBar) {
            this.infoBar = infoBar;
        },
        /* 
            set the plot window
         */
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
            
            if (this.currentPlot != '') {
                this.plots[this.currentPlot].plot();
            }
        },
        /*
            add additional plot type to data visualizer
         */
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
            
            if (this.currentPlot != '') {
                this.plots[this.currentPlot].plot();
            }
        },
        /*
            called upon data source menu get data button click
         */
        loadData: function(uri, rowOrColumn, withHeaders) {
            self.rowOrColumn = rowOrColumn;
            self.withHeaders = withHeaders;
            var header = withHeaders? (rowOrColumn=='row'? 'header':''): '';
            loadTable(uri, header, this.dataLoaded, this.dataLoadError);            
        },
        /*
            callback on successful data loading
        */
        dataLoaded: function(data) {
            // if loaded data is empty, update info bar and return
            if (data.rows.length == 0) {
                self.infoBar.error('No data retrieved. Please try another data source.');
                return;
            }

            data = (self.rowOrColumn == 'row'? loadRows(data): loadColumns(data));

            for (var p in self.plots) {
                self.plots[p].updateData();
            }

            if (parent.currentPlot != undefined) {
                self.plots[self.currentPlot].dataSet();
            }

            self.rawData = data;
        },
        /*
            callback on data loading erro
         */
        dataLoadError: function() {
            self.infoBar.error('Loading data failed. please try another data source.');
        }
    };
}