function UKFoodAttitudes() {

  // Name for the visualisation to appear in the menu bar.
  this.name = 'UK Food Attitudes 2018';

  // Each visualisation must have a unique ID with no special
  // characters.
  this.id = 'uk-food-attitudes';

  // Property to represent whether data has been loaded.
  this.loaded = false;
  var self = this;

  // Preload the data. This function is called automatically by the
  // gallery when a visualisation is added.
  this.preload = function() {
    var self = this;
    this.data = loadTable(
      './data/food/attitudes-transposed.csv', 'csv', 'header',
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
    var container = document.createElement('div');
    container.className = 'form-group';
    parent.appendChild(container);
    var label = document.createElement('label');
    label.for = 'drpQuestions';
    container.appendChild(label);    
    var dropdown = document.createElement('select');
    dropdown.className = 'form-select';
    container.appendChild(dropdown);
    
    // Fill the options with all company names.
    var questions = this.data.columns;
    // First entry is empty.
    for (let i = 1; i < questions.length; i++) {
      // this.select.option(questions[i]);
      var option = document.createElement('option');
      option.value = questions[i];
      option.innerHTML = questions[i];
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
    var question = this.select.value;

    // Get the column of raw data for question.
    var col = this.data.getColumn(question);

    // Convert all data strings to numbers.
    col = stringsToNumbers(col);

    // Copy the row labels from the table (the first item of each row).
    var labels = this.data.getColumn(0);

    // Colour to use for each category.
    var colours = ['#00ff00', 'green', 'yellow', 'orange', 'red'];

    // Make a title.
    var title = 'Question: ' + question;

    // Draw the pie chart!
    this.pie.draw(col, labels, colours, title);
  };
}
