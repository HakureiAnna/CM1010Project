function Waffles() {
    // Name for the visualisation to appear in the menu bar.
    this.name = 'Waffles!';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'waffles';

    var waffles = [];

    
    this.loaded = false;

    // Preload the data. This function is called automatically by the
    // gallery when a visualisation is added.
    this.preload = function() {
        var self = this;
        this.data = loadTable(
        './data/waffles/finalData.csv', 'csv', 'header',
        // Callback function to set the value
        // this.loaded to true.
        function(table) {
            self.loaded = true;
        });

    };

    this.setup = function() {        
        var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday",
        "Sunday"
        ];

        var values = ['Take-away', 'Cooked from fresh', 'Ready meal', 'Ate out',
            'Skipped meal', 'Left overs'
        ]

        // waffle = new Waffle(30, 30, 300, 300, 10, 10, data, 'Monday', values);
        for (var i=0; i<days.length; ++i) {
            if (i<4) {
                waffles.push(new Waffle(20 + (i*220), 20, 200, 200, 8, 8, this.data, days[i], values));
            } else {
                waffles.push(new Waffle(120 + ((i-4)*220), 240, 200, 200, 8, 8, this.data, days[i], values));
            }
        }
    };

    this.draw = function() {
        if (!this.loaded) {
          console.log('Data not yet loaded');
          return;
        }
        background(255);
        for (var i=0; i<waffles.length; ++i) {	
            waffles[i].draw();
        }
        for (var i=0; i<waffles.length; ++i) {
            waffles[i].checkMouse(mouseX, mouseY);
        }
    };

    this.check = function() {            
        for (var i=0; i<waffles.length; ++i) {
            waffles[i].checkMouse(mouseX, mouseY);
        }
    }
}