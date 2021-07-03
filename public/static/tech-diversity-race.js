function TechDiversityRace() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'Tech Diversity: Race';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'tech-diversity-race';

  // Property to represent whether data has been loaded.
  this.loaded = false;
  var self = this;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/tech-diversity/race-2018.csv', 'csv', 'header',
      // Callback function to set the value
      // this.loaded to true.
      function(table) {
        self.loaded = true;
      });
  };

  this.setup = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

  };

  this.addSettings = function(parent) {    
    // Create a select DOM element.
    // this.select = createSelect();
    // this.select.position(350, 40);
    var container = document.createElement('div');
    container.className = 'form-group';
    parent.appendChild(container);
    var label = document.createElement('label');
    label.for = 'drpDiversityRace';
    container.appendChild(label);    
    var dropdown = document.createElement('select');
    dropdown.className = 'form-select';
    container.appendChild(dropdown);
    // Fill the options with all company names.
    var companies = this.data.columns;
    // First entry is empty.
    for (let i = 1; i < companies.length; i++) {
      // this.select.option(companies[i]);
      var option = document.createElement('option');
      option.value = companies[i];
      option.innerHTML = companies[i];
      dropdown.appendChild(option);
    }

    this.select = dropdown;
  }

  this.destroy = function() {
    this.select.remove();
  };

  // Create a new pie chart object.
  this.pie = new PieChart(width / 2, height / 2, width * 0.4);

  this.draw = function() {
    if (!this.loaded) {
      console.log('Data not yet loaded');
      return;
    }

    background(255);

    // Get the value of the company we're interested in from the
    // select item.
    var companyName = this.select.value;

    // Get the column of raw data for companyName.
    var col = this.data.getColumn(companyName);

    // Convert all data strings to numbers.
    col = stringsToNumbers(col);

    // Copy the row labels from the table (the first item of each row).
    var labels = this.data.getColumn(0);

    // Colour to use for each category.
    var colours = ['blue', 'red', 'green', 'pink', 'purple', 'yellow'];

    // Make a title.
    var title = 'Employee diversity at ' + companyName;

    // Draw the pie chart!
    this.pie.draw(col, labels, colours, title);
  };
}
