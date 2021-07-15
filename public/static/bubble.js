function Bubble(_name, _data)
{
    this.name = _name;
	this.id = getRandomID();
	this.pos = createVector(0, 0);
	this.dir = createVector(0, 0);

	this.data = _data;

	this.color = color(random(0, 255), random(0, 255), random(0, 255));
	this.size = 20;
	this.target_size = this.size;

	this.draw = function() {
		fill(this.color);
		ellipse(this.pos.x, this.pos.y, this.size);
		
		noStroke();
		fill(0);
		text(this.name, this.pos.x, this.pos.y);

		this.pos.add(this.dir);

		if (this.size < this.target_size) {
			this.size += 1;
		} else if (this.size > this.target_size) {
			this.size -= 1;
		}
	};

	this.setYear = function(year_index) {
		var v = this.data[year_index];
		this.target_size = map(v, 0, 3600, 5, 200);
	};

	this.updateDirection = function(_bubbles) {
		this.dir = createVector(0, 0);
		
		for (var i=0; i<_bubbles.length; ++i) {
			if (_bubbles[i].id != this.id) {
				var v = p5.Vector.sub(this.pos, _bubbles[i].pos);
				var d = v.mag();
				if (d < this.size/2 + _bubbles[i].size/2) {
					if (d == 0) {
						this.dir.add(p5.Vector.random2D());
					} else {					
						//console.log('collision!');
						this.dir.add(v);				
					}		
				}
			}
		}
		this.dir.normalize();
	};
}