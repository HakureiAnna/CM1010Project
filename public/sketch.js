var dataVisualizer = null;
var gallery = null;

function setup() {
  // after thought (static)

  dataVisualizer = DataVisualizer();

  dataVisualizer.setInfoBar(InfoBar(parent, 'infoBar'));

  dataVisualizer.addSideBar('left', SideBar(dataVisualizer, false, 'LeftSideBar', 'h-100 w-25', 'h-100', 'h-100 flex-fill', 'collapse', '&lt;', '&gt;'));
  dataVisualizer.addSideBar('top', SideBar(dataVisualizer, true, 'TopSideBar', 'w-100', 'w-100', 'flex-fill', 'collapse', '^', 'v'));
  dataVisualizer.addSideBar('bottom', SideBar(dataVisualizer, true, 'BottomSideBar', 'w-100', 'w-100', 'flex-fill', 'collapse', 'v', '^'));

  dataVisualizer.setPlotWindow (PlotWindow(dataVisualizer, 'PlotWindow'));

  dataVisualizer.addPlot(XYPlot(dataVisualizer, 'GraphSettingsMenu', 'DataSeriesMenu'));


  dataVisualizer.dataSourceMenu = DataSourceMenu(dataVisualizer, 'DataSourceMenu');
  dataVisualizer.plotSettingsMenu = PlotSettingsMenu(dataVisualizer, 'GraphSettingsMenu');
  dataVisualizer.dataSeriesMenu = DataSeriesMenu(dataVisualizer, 'DataSeriesMenu');

  dataVisualizer.setup();

  gallery = new Gallery('StaticMenu', 'Visuals');
  gallery.addVisual(new TechDiversityRace());
  gallery.addVisual(new TechDiversityGender());
  gallery.addVisual(new PayGapByJob2017());
  gallery.addVisual(new PayGapTimeSeries());
  gallery.addVisual(new ClimateChange());
  gallery.addVisual(new UKFoodAttitudes());
  gallery.addVisual(new NutrientsTimeSeries());
  gallery.addVisual(new Waffles());  

  dataVisualizer.setGallery(gallery);

  // link the resize event handler to the window resize event
  window.onresize = function(e) {    
    dataVisualizer.resize();
  };

  background(125);

}

function draw() {
  if (gallery.selectedVisual) {
    gallery.selectedVisual.draw();
    if (gallery.selectedVisual.id == 'waffles') {    
      gallery.selectedVisual.check();
    }
  }
}