// new app
var dataVisualizer = null;
// original template
var gallery = null;

function setup() {
  // initialization for new app
  // data visualizer setup
  dataVisualizer = DataVisualizer();

  // infobar setup
  dataVisualizer.setInfoBar(InfoBar(parent, 'infoBar'));

  // sidebars setup
  dataVisualizer.addSideBar('left', SideBar(dataVisualizer, false, 'LeftSideBar', 'h-100 w-25', 'h-100', 'h-100 flex-fill', 'collapse', '&lt;', '&gt;'));
  dataVisualizer.addSideBar('top', SideBar(dataVisualizer, true, 'TopSideBar', 'w-100', 'w-100', 'flex-fill', 'collapse', '^', 'v'));
  dataVisualizer.addSideBar('bottom', SideBar(dataVisualizer, true, 'BottomSideBar', 'w-100', 'w-100', 'flex-fill', 'collapse', 'v', '^'));

  // plot window setup
  dataVisualizer.setPlotWindow (PlotWindow(dataVisualizer, 'PlotWindow'));

  // add plots to data visualizer
  dataVisualizer.addPlot(XYPlot(dataVisualizer, 'GraphSettingsMenu', 'DataSeriesMenu'));

  // set menus 
  dataVisualizer.dataSourceMenu = DataSourceMenu(dataVisualizer, 'DataSourceMenu');
  dataVisualizer.plotSettingsMenu = PlotSettingsMenu(dataVisualizer, 'GraphSettingsMenu');
  dataVisualizer.dataSeriesMenu = DataSeriesMenu(dataVisualizer, 'DataSeriesMenu');

  // run setup code for data visualizer
  dataVisualizer.setup();

  // original template setup
  gallery = new Gallery('StaticMenu', 'Visuals');
  gallery.addVisual(new TechDiversityRace());
  gallery.addVisual(new TechDiversityGender());
  gallery.addVisual(new PayGapByJob2017());
  gallery.addVisual(new PayGapTimeSeries());
  gallery.addVisual(new ClimateChange());
  gallery.addVisual(new UKFoodAttitudes());
  gallery.addVisual(new NutrientsTimeSeries());
  gallery.addVisual(new Waffles());  
  gallery.addVisual(new BubbleChart());

  // link new app to original template code (required for proper plot rendering)
  dataVisualizer.setGallery(gallery);

  // link the resize event handler to the window resize event
  window.onresize = function(e) {    
    dataVisualizer.resize();
  };

  background(125);

}

function draw() {
  // if we are showing an original plot, run its draw function
  if (gallery.selectedVisual) {
    gallery.selectedVisual.draw();
    // if the original plot is waffles, run check to properly detect hover and draw label
    if (gallery.selectedVisual.id == 'waffles') {    
      gallery.selectedVisual.check();
    }
  }
}