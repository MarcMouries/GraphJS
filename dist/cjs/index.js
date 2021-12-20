'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function hello(name) {
    return ("hello " + name) ;
  }

var NONE = "none";

class Shape {
    constructor(x, y, type) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.isSelected = false;
        this.strokeStyle = NONE;

    }
    getColor() {
        return this.color;
    }
}

class Arc extends Shape {
  constructor(x, y, radius, radians) {
    super(x, y);
    this.radius = radius;
    this.radians = radians;
  }
  isHit(x, y) {
    var dx = this.x - x;
    var dy = this.y - y;
    if (dx * dx + dy * dy < this.radius * this.radius) {
      return true;
    }
  }
  render(ctx) {
    ctx.save();

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, this.radians, false);

    if (this.fillStyle) {
      ctx.fillStyle = this.fillStyle;
      ctx.fill();
    }

    if (this.strokeStyle != NONE) {
      ctx.strokeStyle = this.strokeStyle;
      ctx.lineWidth = this.lineWidth;
      ctx.stroke();
    }

    ctx.restore();
  }
}

class Circle extends Arc {
    constructor(x, y, radius) {
      super(x, y, radius, Math.PI *2);
    }
    isHit(x, y) {
      var dx = this.x - x;
      var dy = this.y - y;
      if (dx * dx + dy * dy < this.radius * this.radius) {
        return true;
      }
    }

    getBBox() {
      return {
        x: this.x - this.radius,
        y: this.y - this.radius,
        width : this.radius * 2,
        height : this.radius * 2
      }
    }
  }

class Rectangle extends Shape {
    constructor(x, y, width, height) {
        super(x, y);
        this.width = width;
        this.height = height;
    }
    getArea() {
        return this.width * this.height;
    }

    isHit(x, y) {
        if (
            x > this.x &&
            x < this.x + this.width &&
            y > this.y &&
            y < this.y + this.height
        ) {
            return true;
        }
    }
    render(ctx) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(
            this.x,
            this.y,
            this.width,
            this.height
        );

        if (this.fillStyle) {
            ctx.fillStyle = this.fillStyle;
            ctx.fill();
        }
        if (this.strokeStyle != NONE) {
            ctx.strokeStyle = this.strokeStyle;
            ctx.lineWidth = this.lineWidth;
            ctx.stroke();
        }
        ctx.restore();
    }
    toString() {
        return `rectangle:  (${this.x},${this.y}) x (${this.width},${this.height})`;
    }
}

/**
 *  A vector is an entity that has both magnitude and direction.
 *  2D vector implementation based on the vector functions in P5.js
 */
class Vector {
	constructor(x, y) {
		this.x = x || 0;
		this.y = y || 0;

		if (isNaN(x) || isNaN(y)) {
			console.warn(`Vector(): parameters are not number: (${x}), ${y} `);
		}
		/*
		console.log("in Vector()");
		console.log("this.x  = " + this.x);
		console.log("this.y  = " + this.y);

		console.log("typeof x  = " + typeof y);
		console.log("typeof y  = " + typeof y);
		*/
	}

	static add(v1, v2) {
		return new Vector(v1.x + v2.x, v1.y + v2.y);
	}

	/**
	 * Divides a vector by a scalar and returns a new vector.
	 *
	 * @method div
	 * @static
	 * @param  {Vector} v
	 * @param  {Number}  n
	 * @return  {Vector}
	 */
	static div(v, n) {
		let result = v.copy();
		return result.div(n);
	}

	/**
	 * Linear interpolate the vector to another vector
	 */
	static lerp(v1, v2, amount) {
		let result = v1.copy();
		return result.lerp(v2, amount);
	}

	static random(min, max) {
		let x = randomIntBounds(min, max);
		let y = randomIntBounds(min, max);
		return new Vector(x, y);
	}

	static sub(v1, v2) {
		return new Vector(v1.x - v2.x, v1.y - v2.y);
	}

	/**
	 * Supports adding a Vector or a Scalar
	 * @param {*} n
	 * @returns
	 */
	add(n) {
		if (n instanceof Vector) {
			this.x += n.x;
			this.y += n.y;
			return this;
		} else if (typeof n === "number") {
			this.x += n;
			this.y += n;
			return this;
		} else {
			console.error(`Parameter in Vector.add(n) Not supported: ${n})`);
		}
	}

	/**
	 *  Return a new vector
	 * @returns
	 */
	copy() {
		return new Vector(this.x, this.y);
	}

	/* divide vector length (ie magnitude) by a constant*/
	div(n) {
		if (n === 0) {
			//console.warn("Vector.div:", "divide by 0");
			return this;
		}
		this.x /= n;
		this.y /= n;
		return this;
	}

	lerp(v1, amount) {
		this.x += (v1.x - this.x) * amount || 0;
		this.y += (v1.y - this.y) * amount || 0;
		return this;
	}

	heading() {
		const h = Math.atan2(this.y, this.x);
		return h;
	}

	magSq() {
		const x = this.x;
		const y = this.y;
		return x * x + y * y;
	}

	mag() {
		return Math.sqrt(this.magSq());
	}

	normalize() {
		return this.div(this.mag());
	}

	/**
	Multiply vector length (ie magnitude) by a constant
	*/
	mult(n) {
		this.x *= n;
		this.y *= n;
		return this;
	}

	/**
	 *  set magnitude to a given value
	 */
	setMag(n) {
		return this.normalize().mult(n);
	}


	/**
	 * 
	 * @param {*} n 
	 * @returns 
	 */
	sub(n) {
		if (n instanceof Vector) {
			this.x -= n.x;
			this.y -= n.y;
			return this;
		} else if (typeof n === "number") {
			this.x -= n;
			this.y -= n;
			return this;
		} else {
			console.error(`Parameter in Vector.sub(n) Not supported: ${n})`);
		}
	}

	toString() {
		return "[" + this.x + ", " + this.y + "]";
	}
}

/* Return a random integer between min and max (inclusive) */
function randomIntBounds(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

class ForceDirected {
  constructor(graph, options) {

    this.graph = graph;
    this.initNodes();



    const DEFAULTS = {
      GRAVITY: 2, // 0.9,
      REPULSION: 500000,
    };
    this.options = Object.assign({}, DEFAULTS, options);

  }

  initNodes() {

        /* we may want to have distinct min, max values for x and y */
        let min = -1000;
        let max =  1000;

    this.graph.nodeList.forEach((node) => {
      node.pos = new Vector.random(min, max);
    });
  }

  applyForcesTowardsCenter() {
    // apply force towards center
    this.graph.nodeList.forEach((node) => {
      let gravity = node.pos.copy().mult(-1).mult(this.options.GRAVITY);
      node.force = gravity;
      //node.applyForce(gravity);
      //console.log(node);
    });
  }

  applyRepulsiveForces() {
    // apply repulsive force between nodes
    for (let i = 0; i < this.graph.nodeList.length; i++) {
      for (let j = i + 1; j < this.graph.nodeList.length; j++) {
        if (i != j) {
          let node1 = this.graph.nodeList[i];
          let node2 = this.graph.nodeList[j];

          // The gravitational force F between two bodies of mass m1 and m2 is
          // F = G*m1*m2 / r2
          // the vector that points from one object to the other
          let dir = Vector.sub(node2.pos, node1.pos);
         // let unit = dir.copy().normalize()

          // the length (magnitude) of that vector is the distance between the two objects.
          let distance = dir.mag();

          // The strength of the force is inversely proportional to the distance squared.
          // The farther away an object is, the weaker the force; the closer, the stronger.

          // original  : without the normalize
          dir.normalize();

          let force1 = dir.mult(this.options.REPULSION);
          force1.div(distance * distance);

          let inverseForce = force1.copy().mult(-1);
          node2.force.add(force1);
          node1.force.add(inverseForce);
        }
      }
    }
  }

  applyForcesExertedByConnections() {
    this.graph.linkList.forEach((con) => {
      let node1 = this.graph.nodeList[con[0]];
      let node2 = this.graph.nodeList[con[1]];

      //let maxDis = con[2];

      let dir = Vector.sub(node1.pos, node2.pos);

      let neg_force = new Vector(0, 0).sub(dir);
      let pos_force = new Vector(0, 0).add(dir);

      node1.force.add(neg_force);
      node2.force.add(pos_force);
    });
  }

  applyForces() {

    // Force equals mass times acceleration.
    // Newton’s second law, F→=M×A→ (or force = mass * acceleration).
    this.applyForcesTowardsCenter();

    this.applyRepulsiveForces();

    this.applyForcesExertedByConnections();



    // kinetic energy (KE) is equal to half of an object's mass (1/2*m) multiplied by the velocity squared.
    //let total_KE = 0.0;
    /*
    nodes.forEach((node) => {
      let node_KE = (0.5 * node.mass * node.velocity * node.velocity);
      total_KE =+  node_KE;
      });
      console.log("total_KE=" + total_KE);
  */
  }

}

class InputDeviceTracker {

    constructor(canvas, callback) {
        console.log("InputDeviceTracker ()");

        this.canvas = canvas;
        this.callback = callback;
        self = this;

        console.log("constructor this");
        console.log(this);

        this.canvas.addEventListener('mousedown', this.onDown.bind(this));
        this.canvas.addEventListener('mousemove', this.onMove.bind(this));
        this.canvas.addEventListener('mouseup', this.onUp.bind(this));

        this.canvas.addEventListener('touchstart', this.onDown.bind(this));
        this.canvas.addEventListener('touchmove', this.onMove.bind(this));
        this.canvas.addEventListener('touchend', this.onUp.bind(this));
    }

    getCoordinatesFromEvent(evt) {
        var rect = self.canvas.getBoundingClientRect();
        var offsetTop = rect.top;
        var offsetLeft = rect.left;

        if (evt.touches) {
            return {
                x: evt.touches[0].clientX - offsetLeft,
                y: evt.touches[0].clientY - offsetTop
            };
        } else {
            return {
                x: evt.clientX - offsetLeft,
                y: evt.clientY - offsetTop
            };
        }
    }

    onDown(evt) {
        evt.preventDefault();
        var coords = self.getCoordinatesFromEvent(evt);
        self.callback("down", coords.x, coords.y);
    }

    onUp(evt) {
        evt.preventDefault();
        self.callback("up");
    }

    onMove(evt) {
        evt.preventDefault();
        var coords = self.getCoordinatesFromEvent(evt);
        self.callback("move", coords.x, coords.y);
    }
}

class Renderer {

    constructor(ctx) {
        this.ctx = ctx;
    }

    drawGrid(w, h) {

        this.ctx.save();

        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, w, h);
        this.ctx.lineWidth = 0.3;
        this.ctx.strokeStyle = 'lightgray';
        this.ctx.fillStyle = 'black';

        for (let i = 1; i < w; i++) {
            this.ctx.beginPath();
            if (i % 10 === 0) {
                this.ctx.moveTo(i, 0);
                this.ctx.lineTo(i, h);
                this.ctx.moveTo(i, 0);
            }
            this.ctx.closePath();
            this.ctx.stroke();
        }

        for (let i = 1; i < h; i++) {
            this.ctx.beginPath();
            if (i % 10 === 0) {
                this.ctx.moveTo(0, i);
                this.ctx.lineTo(w, i);
                this.ctx.moveTo(0, i);
            }
            this.ctx.closePath();
            this.ctx.stroke();
        }


        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = 'gray';

        this.ctx.beginPath();
        for (let i = 50; i < w; i += 10) {
            if (i % 50 === 0) {
                this.ctx.moveTo(i, 0);
                this.ctx.lineTo(i, 30);
                this.ctx.fillText(` ${i}`, i, 30);
            } else {
                this.ctx.moveTo(i, 0);
                this.ctx.lineTo(i, 10);
            }

        }
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.beginPath();
        for (let i = 50; i < h; i += 10) {
            if (i % 50 === 0) {
                this.ctx.moveTo(0, i);
                this.ctx.lineTo(30, i);
                this.ctx.fillText(` ${i}`, 30, i);
            } else {
                this.ctx.moveTo(0, i);
                this.ctx.lineTo(10, i);
            }

        }
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.restore();
    }
}

class MChart {

  constructor(container, options) {
    console.log("MChart container()");
    console.log(container);
    this.container = container;
    this.startX = 0, this.startY = 0;
    this.lastMoveX = 0, this.lastMoveY = 0;

    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");

    //let w = canvas.width = canvas2.width = window.innerWidth * 0.9;
    //let h = canvas.height = canvas2.height = window.innerHeight * 0.9;

    this.w = this.canvas.width = window.innerWidth ;
    this.h = this.canvas.height = window.innerHeight ;

    this.renderer = new Renderer(this.ctx);

    const DEFAULTS = {
      display_grid: false,
      selection: {
        strokeStyle: '#CC0000', //  'rgba(255,51,0,1)', //'rgba(0,128,255,1)';
        lineWidth: 1,
        fillStyle: 'rgba(255,51,0,0.01)'  //'rgba(0,128,255, 0.2)';
      }
    };
    this.options = Object.assign({}, DEFAULTS, options);

    /* The selection rectangle */
    this.selection = new Rectangle(100, 100, 100, 100);
    this.selection.strokeStyle = this.options.selection.strokeStyle;
    this.selection.fillStyle = this.options.selection.fillStyle;
    this.selection.lineWidth = this.options.selection.lineWidth;

    /* The list of ojbects to draw */
    this.objects = [];



    this.isSelecting = false;
    this.isDragging = false;
    this.clicked_on_the_canvas = false;
  }

  dump() {
    console.log("MChart container= ");
    console.log("- objects= ");
    console.log(this.objects);
  }

  addObject(object) {
    this.objects.push(object);
    this.draw();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    if (this.options.display_grid) {
      this.renderer.drawGrid(this.w, this.h);
    }

    this.objects.forEach((object) => {
      object.render(this.ctx);
      if (object.isSelected) {
        var selection;
        if (object instanceof Circle) {
          var bbox = object.getBBox();
          selection = new Rectangle(bbox.x, bbox.y, bbox.width, bbox.height);
        }
        else {
          selection = new Rectangle(object.x, object.y, object.width, object.height);
        }
        selection.strokeStyle = this.options.selection.strokeStyle;
        selection.lineWidth = this.options.selection.lineWidth;
        selection.render(this.ctx);
      }

      if (this.isSelecting == true) {
        this.selection.render(this.ctx);
      }
    });
  }

  manageInputEvents(evtType, x, y) {
    switch (evtType) {
      case "down":
        this.mouseIsDown = true;

        this.startX = x;
        this.startY = y;
        this.lastMoveX = x;
        this.lastMoveY = y;

        /* we assume the user clicked on the canvas unless we find an object was hit */
        this.clicked_on_the_canvas = true;

        // we start from last to check the shape that is on top first
        for (var i = this.objects.length - 1; i >= 0; i--) {
          var object = this.objects[i];
          //    console.log ("checking for hit object = " + object.color);
          if (object.isHit(x, y)) {
            object.isSelected = true;
            console.log("Clicked on : " + object.constructor.name + "/" + object.fillStyle);
            moveObjectToLastPosition(this.objects, object);
            this.clicked_on_the_canvas = false;
            this.isSelecting = false;
            this.isDragging = true;
          }

        }
        console.log("clicked on the canvas = " + this.clicked_on_the_canvas);

        if (this.clicked_on_the_canvas) {
          console.log("clicked on the canvas");
          this.selection_startX = x;
          this.selection_startY = y;

          /* reset selection if user clicked on the canvas */
          this.objects.forEach((object) => {
            console.log("RESET object " + object.fillStyle + " is Circle ? " + (object instanceof Circle));
            object.isSelected = false;
          });
        }
        break;

      case "up":
        this.mouseIsDown = false;
        console.log("MOUSE UP");
        console.log(" isDragging : " + this.isDragging);
        console.log(" isSelecting : " + this.isSelecting);

        if (this.isSelecting) {



          console.log(" selection : " + this.selection);
          /* check if selection includes any object */
          this.objects.forEach((object) => {

            if (rectContainsShape(this.selection, object)) {
              object.isSelected = true;
              console.log("object is selected: " + object.constructor.name + "/" + object.fillStyle);
            }
          });
        }


        this.isSelecting = false;
        this.isDragging = false;
        break;

      case "move":
        if (this.clicked_on_the_canvas && this.mouseIsDown) {
          this.isSelecting = true;
          // getting the min & max to handle when the user selects from bottom right to top left 
          const x1 = Math.min(this.selection_startX, this.lastMoveX);
          const y1 = Math.min(this.selection_startY, this.lastMoveY);
          const x2 = Math.max(this.selection_startX, this.lastMoveX);
          const y2 = Math.max(this.selection_startY, this.lastMoveY);

          this.selection.x = Math.floor(x1);
          this.selection.y = Math.floor(y1);
          this.selection.width = Math.floor(x2 - x1);
          this.selection.height = Math.floor(y2 - y1);
        }
        this.lastMoveX = x;
        this.lastMoveY = y;

        var dx = x - this.startX;
        var dy = y - this.startY;

        this.startX = x;
        this.startY = y;

        if (this.isDragging) {
          this.objects.forEach((object) => {
            if (object.isSelected) {
              object.x += dx;
              object.y += dy;
            }
          });
        }
        break;
    }
    this.draw();
  }

  init() {
    this.inputDeviceTracker = new InputDeviceTracker(this.canvas, this.manageInputEvents.bind(this));
  }
}

/**
 *  We move the node selection to the last position so that it is drawn above the other shapes on the canvas
 */
function moveObjectToLastPosition(object_list, object_to_move) {
  object_list.forEach(function (object, index) {
    if (object === object_to_move) {
      object_list.splice(index, 1);
      object_list.push(object_to_move);
      return;
    }
  });
}



function rectContainsShape(rectangle, shape) {

  if (shape.constructor.name == "Circle") {
    return rectContainsCircle(rectangle, shape);
  }
  else if (shape.constructor.name == "Rectangle") {
    return rectContainsRect(rectangle, shape);
  }
  else {
    console.error("rectContainsShape: shape is unknown: " + shape);
  }
}

function rectContainsRect(rect1, rect2) {

  var result_X = (rect1.x) < (rect2.x) &&
    (rect1.x + rect1.width) > (rect2.x + rect2.width);

  var result_Y = (rect1.y) < (rect2.y) &&
    (rect1.y + rect1.height) > (rect2.y + rect2.height);

  return result_X & result_Y;
}

function rectContainsCircle(rectangle, circle) {

  // LEFT 
  var left_include = rectangle.x < circle.x - circle.radius;
  if (!left_include) {
    //circle is outside of the rectangle on the left side
    return false;
  }
  // RIGHT 
  var right_include = rectangle.x + rectangle.width > circle.x + circle.radius;
  if (!right_include) {
    //circle is outside of the rectangle on the right side
    return false;
  }
  // BOTTOM 
  var bottom_include = rectangle.y + rectangle.height > circle.y + circle.radius;
  if (!bottom_include) {
    //circle is outside of the rectangle on the bottom side
    return false;
  }
  // TOP: 
  var top_include = rectangle.y < circle.y - circle.radius;
  if (!top_include) {
    //circle is outside of the rectangle on the top side
    return false;
  }
  return true;
}

// =============================================================
//                          Graph
// =============================================================
class Graph {
    constructor() {
        
        this.graph = {};
        this.nodeList = [];
        this.linkList = [];
        this.adjacency = {};
        this.changed = false;
        this.root;    
    }

    test () {
    }
}

const PI_2 = Math.PI * 2;

class Node {


    constructor(id) {
      this.id = id;
      this.size = 10;
      this.mass = (PI_2 * this.size) / 1.5;
      this.radius = this.size;

      this.pos = new Vector(0, 0);
      this.force = new Vector(0, 0);
      this.velocity = new Vector(0, 0);
      this.acceleration = new Vector(0, 0);
    }
    draw(ctx) {
      ctx.beginPath();
      ctx.fillStyle = "darkGrey";
      ctx.arc(this.pos.x, this.pos.y, this.radius, 0, PI_2, false);
      ctx.fill();
      ctx.closePath();
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(this.id, this.pos.x, this.pos.y);
    }

    /**
     *  applyForce
     *
     *  Newton’s second law.
     *  Receive a force, divide by mass, and add to acceleration.
    */
    __applyForce(force) {
      let f = Vector.div(force, this.mass);
      this.acceleration.add(f);
    }

    update() {

      let force_copy = this.force.copy();
      let velocity = force_copy.div(this.mass);
      this.pos.add(velocity);
      /*
            this.velocity.add(this.acceleration);
            this.pos.add(this.velocity);
            this.acceleration.mult(0);
            */
    }

    toString() {
      return "[" + this.id + ", " + this.pos.x + ", " + this.pos.y + "]";
    }
  }

var version = "0.1";

exports.Arc = Arc;
exports.Circle = Circle;
exports.ForceDirected = ForceDirected;
exports.Graph = Graph;
exports.MChart = MChart;
exports.Node = Node;
exports.Rectangle = Rectangle;
exports.Vector = Vector;
exports.hello = hello;
exports.version = version;
//# sourceMappingURL=index.js.map
