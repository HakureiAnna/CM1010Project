var dataVisualizer = null;

function setup() {

  dataVisualizer = DataVisualizer();

  dataVisualizer.setInfoBar(InfoBar(parent, 'infoBar'));

  dataVisualizer.addSideBar('left', SideBar(dataVisualizer, false, 'LeftSideBar', 'h-100 w-25', 'h-100', 'h-100 flex-fill', 'collapse', '&lt;', '&gt;'));
  dataVisualizer.addSideBar('top', SideBar(dataVisualizer, true, 'TopSideBar', 'w-100', 'w-100', 'flex-fill', 'collapse', '^', 'v'));
  dataVisualizer.addSideBar('bottom', SideBar(dataVisualizer, true, 'BottomSideBar', 'w-100', 'w-100', 'flex-fill', 'collapse', 'v', '^'));

  dataVisualizer.setPlotWindow (PlotWindow(dataVisualizer, 'PlotWindow'));

  dataVisualizer.addPlot(XYPlot(dataVisualizer, 'GraphSettingsMenu'));


  dataVisualizer.dataSourceMenu = DataSourceMenu(dataVisualizer, 'DataSourceMenu');
  dataVisualizer.plotSettingsMenu = PlotSettingsMenu(dataVisualizer, 'GraphSettingsMenu');
  dataVisualizer.dataSeriesMenu = DataSeriesMenu(dataVisualizer, 'DataSeriesMenu');

  dataVisualizer.setup();

  // link the resize event handler to the window resize event
  window.onresize = function(e) {    
    dataVisualizer.resize();
  };

}

function draw() {
  background(125);
}

