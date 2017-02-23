var log = console.log;

var masterCircle = {
  me: null,
  radius: 0,
  origin: {
    x: 0,
    y: 0
  },
  init: function(radius) {
      this.me = document.createElement('div');
      this.radius = radius;      
      this.origin.x = window.innerWidth / 2 - radius;
      this.origin.y = window.innerHeight / 2 - radius;

      this.me.style.height = radius * 2 +  'px'; 
      this.me.style.width = radius * 2  +  'px'; 
      this.me.style.borderRadius = radius +  'px';
      this.me.style.backgroundColor = "seagreen";
      this.me.style.left = this.origin.x + 'px';
      this.me.style.top = this.origin.y + 'px';
      this.me.style.position = 'absolute';
      this.me.id = 'master';
      
      document.body.appendChild(this.me);      
  }
};

var slaveCircle = {
  me: null,
  radius: 0,
  origin: {
    x: 0,
    y: 0
  },
  masterCircleRadius: 0,
  init: function(radius, masterCircleRadius) {
      this.me = document.createElement('div');
      this.radius = radius;      
      this.origin.x = window.innerWidth / 2 - radius;
      this.origin.y = window.innerHeight / 2 - radius;
      this.masterCircleRadius = masterCircleRadius;

      this.me.style.height = radius * 2 +  'px'; 
      this.me.style.width = radius * 2  +  'px'; 
      this.me.style.borderRadius = radius +  'px';
      this.me.style.backgroundColor = "coral";
      this.me.style.left = this.origin.x + 'px';
      this.me.style.top = this.origin.y + this.masterCircleRadius + this.radius + 'px';
      this.me.style.position = 'absolute';
      this.me.id = 'slave';
      
      document.body.appendChild(this.me);      
  },
  isCircleHit: function(evt) {      
      return (evt.target == this.me);
  },
  moveCircle: function(evt) {    
    this.me.style.left = evt.x - this.radius + 'px';
    this.me.style.top = evt.y - this.radius + 'px';
  },
  returnHome: function(evt) { 
    this._translate(this.me, this.origin.x, this.origin.y);
  },
  _css: function( element, property ) {
    return window.getComputedStyle( element, null ).getPropertyValue( property );
  },
  
  _translate: function(elem, x, y) {
    var left = parseInt( this._css( elem, 'left' ), 10 ),
        top = parseInt( this._css( elem, 'top' ), 10 ),
        // Calculate distance to the origin.
        dx = left - x,
        dy = top - y,
        i = 1,
        count = 67,
        delay = 5;

        
    function loop() {
        if ( i >= count )  return;
        if (true) { }
        i += 1;

        // Reduce distance proportionaly
        var stepCloserX = ( left - ( dx * i / count ) ).toFixed();
        var stepCloserY = ( top - ( dy * i / count ) ).toFixed();

        elem.style.left = stepCloserX + 'px';
        elem.style.top = stepCloserY + 'px';

        // Deltas between window center and slave circle's center
        var delta_x = Math.abs((window.innerWidth/2) - (Math.abs(stepCloserX) + slaveCircle.radius));
        var delta_y = Math.abs((window.innerHeight/2) - (Math.abs(stepCloserY) + slaveCircle.radius)); 
        var delta_hypotenuse = Math.sqrt((delta_x*delta_x + delta_y*delta_y));

        if(delta_hypotenuse <= slaveCircle.radius + masterCircle.radius + 1) return;

        setTimeout( loop, delay );
    }
    
    loop();
  }
}


// Render circles
window.addEventListener("load", function() {

  masterCircle.init(30);
  slaveCircle.init(30, masterCircle.radius);

  function wrapper(e) {   slaveCircle.moveCircle(e);   }
  
  // Follow the cursor if mouse click hits the circle
  document.addEventListener('mousedown', function(e) {
      if (slaveCircle.isCircleHit(e)) {
          document.addEventListener('mousemove', wrapper)
      }
  });

  // Float back to the master circle
  document.addEventListener('mouseup', function(e) { 
        document.removeEventListener('mousemove', wrapper);
        slaveCircle.returnHome(e);
  });
  
}); 