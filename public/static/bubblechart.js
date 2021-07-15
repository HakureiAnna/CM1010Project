function BubbleChart() {
     // Name for the visualisation to appear in the menu bar.
     this.name = 'Bubble Chart';

     // Each visualisation must have a unique ID with no special
     // characters.
     this.id = 'bubblechart';
 
     var waffles = [];
 
     
     this.loaded = false;
     var self = this;

     var years= null;
     var bubbles = null;
     this.selected = null;
 
     // Preload the data. This function is called automatically by the
     // gallery when a visualisation is added.
     this.preload = function() {
         var self = this;
         this.data = loadTable(
         './data/food/foodData.csv', 'csv', 'header',
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

        bubbles = [];

        years = [];
    
        for (var i=5; i<this.data.getColumnCount(); ++i) {
            var s = this.data.columns[i];
            years.push(s);
        }
    
        for (var i=0; i<this.data.getRowCount(); ++i) {
            var r = this.data.getRow(i);
            var name = r.getString('L1');
            if (name != '') {
                var d = [];
                for (var j=0; j<years.length; ++j) {
                    var v = Number(r.get(years[j]));
                    d.push(v);
                }
                var b = new Bubble(name, d);
                var v = Number(r.get('1974'));
                b.setYear(0);
                bubbles.push(b);
            }
        }
     };

     this.addSettings = function(parent) {
         var container = document.createElement('div');
         container.className = 'form-group';
         parent.appendChild(container);
         var label = document.createElement('label');
         label.for = 'drpYears';
         container.appendChild(label);
         var dropdown = document.createElement('select');
         dropdown.className = 'form-select';
         container.appendChild(dropdown);

         for (var i=0; i<years.length; ++i) {
             var option = document.createElement('option');
             option.value = years[i];
             option.innerHTML = years[i];
             dropdown.appendChild(option);
         }

         dropdown.onchange = function() {     
            var yearIndex = years.indexOf(self.select.value);
            for (var i=0; i<bubbles.length; ++i) {
                bubbles[i].setYear(yearIndex);
            }
            self.draw();
         };

         this.select = dropdown;   
     };

     this.destroy = function() {
       this.select.remove();
     };
   
 
     this.draw = function() {    
         if (!this.loaded) {
           console.log('Data not yet loaded');
           return;
         }
         background(100);

         push();
         textAlign(CENTER);
         translate(width/2, height/2);
         for (var i=0; i<bubbles.length; ++i) {
             bubbles[i].updateDirection(bubbles);
             bubbles[i].draw();
         }
         pop();
     }; 
}