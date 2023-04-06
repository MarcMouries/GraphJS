/**
 * Create a High Definition Canvas.
 *
 * @param {*} canvas
 * @returns Scaled 2d Context
 */
function setupHiDefCanvas(canvas) {
	// Get the device pixel ratio, falling back to 1.
	var devicePixelRatio = window.devicePixelRatio || 1;

	var ctx = canvas.getContext("2d");

	console.log("─────────────────────────");
	console.log("│ setupHiDefCanvas      │");
	console.log("─────────────────────────");
	console.log("  devicePixelRatio : " + devicePixelRatio);
	console.log("  canvas.width  : " + canvas.width);
	console.log("  canvas.height : " + canvas.height);

	// Get the size of the canvas in CSS pixels.
	var rect = canvas.getBoundingClientRect();
	console.log("  rect.width  : " + rect.width);
	console.log("  rect.height : " + rect.height);

    const initialWidth = canvas.width;
    const initialHeight = canvas.height;


	// On Hi Def like Retina display we double the size of the canvas
	canvas.width = initialWidth * devicePixelRatio;
	canvas.height = initialHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

	// and we shrink the display size using CSS
	canvas.style.width = initialWidth + 'px';
    canvas.style.height = initialHeight + 'px';

	console.log("  canvas.style.width  : " + canvas.style.width);
	console.log("  canvas.style.height  : " + canvas.style.height);

	console.log("  canvas.width  : " + canvas.width);
	console.log("  canvas.height : " + canvas.height);

	console.log(" └───────────────────────┘");

	return ctx;
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

// =============================================================

function to_radians(degrees) {
  return degrees * (Math.PI / 180);
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
	 * Return a copy of this Vector
	 * @returns
	 */
	copy() {
		return new Vector(this.x, this.y);
	}

	/**
	 * Divide vector length (ie magnitude) by a constant  
	 */ 
	div(n) {
		if (n === 0) {
			//console.warn("Vector.div:", "divide by 0");
			return this;
		}
		this.x /= n;
		this.y /= n;
		return this;
	}

	/**
	 * Linear Interpolation
	 */ 
	lerp(v1, amount) {
		this.x += (v1.x - this.x) * amount || 0;
		this.y += (v1.y - this.y) * amount || 0;
		return this;
	}
	/**
	 * Returns the direction of the Vector
	 * @returns 
	 */
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
		if (isNaN(n)) {
			console.error(`Vector.mult: parameter is not a number: (${n})`);
		}
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
	 * Substracts either a Vector or a scalar
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

function rectContainsShape(rectangle, shape) {
	if (shape.type == "Circle") {
		return rectContainsCircle(rectangle, shape);
	} else if (shape.type == "Rectangle") {
		return rectContainsRect(rectangle, shape);
	} else {
		console.error("rectContainsShape: shape is unknown: " + shape);
		console.error( shape);
	}
}

/**
 *
 *
 *    x,y
 *    ┌────────────────────────┐ width
 *    │  x,y             width │
 *    │  ┌──────────────────┐  │
 *    │  │                  │  │
 *    │  │                  │  │
 *    │  │                  │  │
 *    │  └──────────────────┘  │
 *    │                  heigth│
 *    └────────────────────────┘ heigth

 * @param {*} rect1 
 * @param {*} rect2 
 * @returns 
 */
/*
 function rectContainsRect(rect1, rect2) {
	console.log("rectContainsRect");
	// console.log(rect1.toStringCoordinates());
	// console.log(rect2.toStringCoordinates());

	var result_X =
		rect1.getX() < rect2.getX() &&
		rect1.getX() + rect1.getWidth() < rect2.getX() + rect2.getWidth();

	var result_Y =
		rect1.getY() > rect2.getY() &&
		rect1.getY() + rect1.getHeight() <= rect2.getY() + rect2.getHeight();

	return result_X & result_Y;
}
*/

function rectContainsRect(rect1, rect2) {
	var result_X =
		rect1.x < rect2.x && rect1.x + rect1.width > rect2.x + rect2.width;

	var result_Y =
		rect1.y < rect2.y && rect1.y + rect1.height > rect2.y + rect2.height;

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
	var right_include =
		rectangle.x + rectangle.width > circle.x + circle.radius;
	if (!right_include) {
		//circle is outside of the rectangle on the right side
		return false;
	}
	// BOTTOM
	var bottom_include =
		rectangle.y + rectangle.height > circle.y + circle.radius;
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

class Link {
	constructor(source, target) {
		if (source.id && target.id) {
			this.id = source.id + " → " + target.id;
		} else {
			this.id = source + " → " + target;
		}
		this.source = source;
		this.target = target;
	}
}

class Node {
	constructor(id, data) {
		this.id = id;

		this.data = data;
		this.level = 0;
		this.children = [];

		this.isCollapsed = false;

		this.size = 20;
		this.mass = 13; //(6 * this.size) / 1.5;
		this.radius = this.size;

		this.pos = new Vector(0, 0);
		this.velocity = new Vector(0, 0);
		this.acceleration = new Vector(0, 0);
	}

	toString() {
		return "Node " + this.id + " (" + this.pos.x + ", " + this.pos.y + ")";
	}

	addChild(node) {
		this.children.push(node);
	}

	getAdjacents() {
		return this.children;
	}

	isAdjacent(node) {
		return this.children.indexOf(node) > -1;
	}

	
}

// =============================================================

class Graph {
  constructor() {
    this.graph = {};
    this.nodeList = new Map();
    this.linkList = [];
    this.adjacency = {};
    this.changed = false;
    this.root;
  }

  /**
   * Add a node
   * @param {*} node
   * @returns
   */
  addNode(node) {
    if (!(node.id in this.graph)) {
      this.nodeList.set(node.id, node); //	this.nodeList.push(node);
      this.graph[node.id] = node;
    } else {
      console.error("Node already exists: " + node.id);
    }
    return node;
  }
  getNode(nodeId) {
    //var node = this.graph[nodeId];
    return this.nodeList.get(nodeId);
  }
  removeNode(nodeId) {
    this.nodeList.delete(nodeId);
  }

  /**
   *  Add an object. Create a node from the specified object
   * @param {*} object
   * @returns
   */
  addObject(object) {
    var node = new Node(object.id, object);

    if (object.parentId) {
      node.parent = this.getNode(object.parentId);
      if (!node.parent) {
        console.error("Parent node not found for parentId: " + object.parentId);
      } else {
        node.level = node.parent.level + 1;
        node.parent.children.push(node);
      }
    } else {
      this.root = node;
    }
    this.addNode(node);
    this.changed = true;
    return node;
  }

  getLinkCount() {
    return this.linkList.length;
  }
  getNodeCount() {
    //return this.nodeList.length;
    return this.nodeList.size;
  }

  addLink(sourceNode_id, targetNode_id) {
    var sourceNode = this.getNode(sourceNode_id);
    if (sourceNode == undefined) {
      throw new TypeError("Trying to add a link to the non-existent node with id: " + sourceNode_id);
    }
    var targetNode = this.getNode(targetNode_id);
    if (targetNode == undefined) {
      throw new TypeError("Trying to add a link to the non-existent node with id: " + targetNode_id);
    }

    var link = new Link(sourceNode, targetNode);
    var exists = false;

    this.linkList.forEach(function (item) {
      if (link.id === item.id) {
        exists = true;
      }
    });

    if (!exists) {
      this.linkList.push(link);
      sourceNode.addChild(targetNode);
    } else {
      console.log("LINK EXIST: " + " source: " + link.source.id + " => " + link.target.id);
    }

    if (!(link.source.id in this.adjacency)) {
      this.adjacency[link.source.id] = {};
    }
    if (!(link.target.id in this.adjacency[link.source.id])) {
      this.adjacency[link.source.id][link.target.id] = [];
    }
    this.adjacency[link.source.id][link.target.id].push(link);
  }

  /**
   *  JSON input can be either a JSON String or a JSON object
   * @param {*} json_input
   */
  loadJSON(json_input) {
    console.log("Graph.loadJSON: json_string: ");
    console.log(json_input);
    var json_object;
    if (typeof json_input === "string") {
      console.log("Graph.loadJSON: input is of type string: ");
      json_object = JSON.parse(json_input);
    } else if (typeof json_input === "object") {
      console.log("Graph.loadJSON: input is of type object: ");
      json_object = json_input;
    }

    var nodes = json_object["nodes"];
    for (let index = 0; index < nodes.length; index++) {
      var node = nodes[index];
      this.addObject(node);
    }

    var links = json_object["links"];
    if (links) {
      for (let index = 0; index < links.length; index++) {
        var link = links[index];
        this.addLink(link.source, link.target);
      }
    }
    console.log("Graph.loadJSON:  loaded Graph=");
    console.log(this.graph);
  }

  toString() {
    //return this.nodeList.map(printNode);
    return Array.from(this.nodeList.values()).map(printNode);
  }
}

function printNode(node) {
  var adjacentsRepresentation = "";
  if (node.getAdjacents() == 0) {
    adjacentsRepresentation = "no children";
  } else {
    adjacentsRepresentation = node
      .getAdjacents()
      .map(function (item) {
        return item.id;
      })
      .join(", ");
  }
  return node.id + " => " + adjacentsRepresentation;
}

class TreeNode extends Node {
  constructor(nodeID, nodeData) {
    super(nodeID, nodeData);
    this.children = [];
    this.parent;
    this.level = 0;
  }

  addChild(node) {
    this.children.push(node);
    node.parent = this;
    return node;
  }

  getChildAt(i) {
    return this.children[i];
  }
  getFirstChild() {
    return this.getChildAt(0);
  }
  getChildren() {
    return this.children;
  }
  getChildrenCount() {
    return this.children.length;
  }
  /**
   *  isLeftMost: is this node == to the first child of its parent?
   */
  isLeftMost() {
    if (!this.parent || this.parent === null) {
      return true;
    } else {
      return this.parent.getFirstChild() === this;
    }
  }

  /**
   *  isRightMost: is this node == to the last child of its parent?
   */
  isRightMost() {
    if (!this.parent || this.parent === null) {
      return true;
    } else {
      return this.parent.getLastChild() === this;
    }
  }

  getLastChild() {
    return this.getChildAt(this.getChildrenCount() - 1);
  }

  getLeftSibling() {
    if (this.parent === null || this.isLeftMost()) {
      return null;
    } else {
      var index = this.parent.children.indexOf(this);
      return this.parent.children[index - 1];
    }
  }

  isLeaf() {
    return this.children && this.children.length == 0;
  }
  hasChild() {
    return this.children && this.children.length > 0;
  }

  isAncestorCollapsed() {
    if (this.parent == null) {
      return false;
    }
    return this.parent.isCollapsed ? true : this.parent.id === -1 ? false : this.parent.isAncestorCollapsed();
  }

  getRightSibling() {
    if (this.parent === null || this.isRightMost()) {
      return null;
    } else {
      var index = this.parent.children.indexOf(this);
      return this.parent.children[index + 1];
    }
  }

  getLeftMostChild() {
    if (this.getChildrenCount() == 0) return null;

    return this.children[0];
  }

  getRightMostChild() {
    if (this.getChildrenCount() == 0) return null;

    return this.children[this.getChildrenCount() - 1];
  }

  hasLeftSibling() {
    return !this.isLeftMost();
  }

  getIndex () {
    return this.parent.children.indexOf(this);
  }

}

//import Link from "./Link";

class Tree extends Graph {
  constructor() {
    super();
    this.root = null;
    this.nodeMap = new Map();
  }

  setRoot(nodeID) {
    this.root = nodeID;
  }
  getRoot() {
    return this.root;
  }

  isRoot(node) {
    return node === this.root;
  }

  traverseDF(callback) {
    function traverse(node) {
      callback(node);
      if (node.children) {
        node.children.forEach(traverse);
      }
    }
    traverse(this.root);
  }

  traverseBF(callback) {
    const queue = [this.root];
    while (queue.length) {
      const node = queue.shift();
      callback(node);
      node.children.forEach((child) => queue.push(child));
    }
  }

  /**
   * Returns { status: 'success'} or { status: 'error', message: "error message"}
   * @param {*} json
   */
  loadFromJSON(json) {
    const data = JSON.parse(json);

    // create nodes
    data.nodes.forEach((nodeData) => {
      const { id, data } = nodeData;
      const node = new TreeNode(id, data, null);
      this.nodeMap.set(id, node);
      // add node to nodesByLevel array
      //console.log("")
      //addNodeToLevel(id, parentId, nodesByLevel, node);
    });

    // Add child nodes to parent nodes
    data.nodes.forEach((nodeData) => {
      const { id, parentId } = nodeData;
      const node = this.nodeMap.get(id);
      if (parentId) {
        const parent = this.nodeMap.get(parentId);
        if (!parent) {
          return { status: "error", message: "Parent node not found for parentId: " + parentId };
        }
        parent.addChild(node);
        node.level = node.parent.level + 1;
      } else {
        this.root = node;
      }
    });
    return { status: "success" };
  }
}

/* eslint-disable no-unused-vars */

//import Graph from "../graph/Graph";
//import Node from "../graph/Node";


class AbstractGraphLayout {

    // need to get nodeWidth & nodeHeight
    constructor(graph, options) {
		this.graph = graph;

    }

    calculate_Positions(graph, starting_vertex, center) {
        console.error("not implemented in AbstractGraphLayout. Make sure to use a concrete layout class.");
    }
}

// =============================================================

class ForceDirected extends AbstractGraphLayout {
	constructor(graph, options) {

		super();
		this.graph = graph;
		this.initNodes();

		const DEFAULTS = {
			GRAVITY: 0.9,
			REPULSION: 500000,
		};
		this.options = Object.assign({}, DEFAULTS, options);
	}

	initNodes() {
		let min = -1000;
		let max = 1000;

		this.graph.nodeList.forEach((node) => {
			node.pos = new Vector.random(min, max);
		});
	}

	run() {
		//requestAnimationFrame(this.animate);
		console.log("run");
	}

	animate = () => {
		console.log("animate");
	};

	/**
	 *  applyForce
	 *
	 *  Newton’s second law.
	 *  Receive a force, divide by mass, and add to acceleration.
	 */
	applyForce(node, force) {
		let forceOverMass = Vector.div(force, node.mass);
		node.acceleration.add(forceOverMass);
	}

	updateNodesVelocity() {
		this.graph.nodeList.forEach((node) => {
			let force_copy = node.acceleration.copy();
			let forceOverMass = force_copy.div(node.mass);
			//	node.velocity.add( forceOverMass );
			node.pos.add(forceOverMass);

			//	node.velocity.add(node.acceleration);
			//	node.pos.add(node.velocity);
			//	node.acceleration.mult(0);
		});
	}

	applyForcesTowardsCenter() {
		// apply force towards center
		this.graph.nodeList.forEach((node) => {
			let gravity = node.pos.copy().mult(-1).mult(this.options.GRAVITY);
			node.acceleration = gravity;
			//node.applyForce(gravity);
			//console.log(node);
		});
	}

	applyRepulsiveForces() {
		// apply repulsive force between nodes
		let nodeValues = Array.from(this.graph.nodeList.values());

		for (let i = 0; i < nodeValues.length - 1; i++) {
			for (let j = i + 1; j < nodeValues.length; j++) {
				if (i != j) {
					let node1 = nodeValues[i];
					let node2 = nodeValues[j];
					//console.log("applyRepulsiveForces");
					//console.log(node1);
					//console.log(node2);

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
					node2.acceleration.add(force1);
					node1.acceleration.add(inverseForce);

					//node2.applyForce(force1);
					//node1.applyForce(inverseForce);
				}
			}
		}
	}

	applyForcesExertedByConnections() {
		this.graph.linkList.forEach((link) => {
			let node1 = link.source;
			let node2 = link.target;

			//let maxDis = con[2];
			//let connector_length = 100;

			let dir = Vector.sub(node1.pos, node2.pos);

			let neg_force = new Vector(0, 0).sub(dir);
			let pos_force = new Vector(0, 0).add(dir);

			node1.acceleration.add(neg_force);
			node2.acceleration.add(pos_force);

			//node1.applyForce(neg_force);
			//node2.applyForce(pos_force);
		});
	}

	applyForces() {
		// Force equals mass times acceleration.
		// Newton’s second law, F→=M×A→ (or force = mass * acceleration).
		this.applyForcesTowardsCenter();

		this.applyRepulsiveForces();

		this.applyForcesExertedByConnections();

		this.updateNodesVelocity();

		// kinetic energy (KE) is equal to half of an object's mass (1/2*m) multiplied by the velocity squared.
		/*
		let total_KE = 0.0;
		this.graph.nodeList.forEach((node) => {
			let velocity = node.velocity.mag();

			let node_KE = 0.5 * node.mass * (velocity * velocity);
			total_KE = + node_KE;

		});
		console.warn("total_KE= " + total_KE);
		*/
	}
}

const DEFAULTS = {
  rootOrientation: "NORTH",
  maximumDepth: 3,
  levelSeparation: 50 /* distance between levels = vertical spread */,
  siblingSpacing: 50 /* distance between leaf siblings */,
  subtreeSeparation: 160 /* distance between each subtree */,
  stackedLeaves: true,
  stackedIndentation : 40,
  nodeWidth: 0,
  nodeHeight: 0
};

class TreeLayout extends AbstractGraphLayout {
  constructor(tree, options) {
    super(tree);
    /**
     * lastNodeAtLevel: stores the last node visited at each level to set as left most nodes' neighbor
     */
    this.lastNodeAtLevel = [];

    this.options = Object.assign({}, DEFAULTS, options);
    options || (options = {});
    for (let i in DEFAULTS) {
      if (i in options) {
        this[i] = options[i];
      } else {
        this[i] = DEFAULTS[i];
      }
    }

    console.log("TreeLayout constructed.");
    console.log(this);

    /**
     * Do a post-order traversal (ie: from the bottom-left to the top-right)
     * Visit the current node after visiting all the nodes from left to right.
     */
    const firstWalk = (node, level) => {
      //console.log("firstWalk", node, level);

      // private function implementation
      node.prelim = 0;
      node.modifier = 0;
      node.width = node.width || this.nodeWidth;
      node.height = node.height || this.nodeHeight;

      setNodeNeighbor(node);

      //
      let leftSibling = node.getLeftSibling();
      //console.log("leftSibling  = " + leftSibling);
      if (node.isLeaf() || node.level == this.maximumDepth) {
        if (leftSibling) {
          /*-------------------------------------------------
           * Determine the preliminary x-coordinate based on:
           * - preliminary x-coordinate of left sibling,
           * - the separation between sibling nodes, and
           * - mean width of left sibling & current node.
           *-------------------------------------------------*/
          //console.log("\\___ firstWalk Sibling: left=" + leftSibling.id + " right=" + node.id);
          node.prelim = leftSibling.prelim + this.siblingSpacing;
          let meanNodeSize = getMeanNodeSize(node, leftSibling);
          //	console.log("meanNodeSize = " + meanNodeSize);
          node.prelim += meanNodeSize;
          //console.log("prelim = " + leftSibling.prelim + " + " + this.siblingSpacing + " + " + meanNodeSize + " = " + node.prelim);
        } else {
          /*  no sibling on the left to worry about  */
          node.prelim = 0;
          //console.log(node.id + " is a leaf with no left sibling");
          //console.log("prelim  = " + node.prelim);
          //console.log("modifier= " + node.modifier);
        }
      } else {
        /* This Node is not a leaf, so call this procedure 
        /* recursively for each of its offspring.          */
        var children_count = node.getChildrenCount();
        for (let i = 0; i < children_count; i++) {
          let child = node.getAdjacents()[i];
          firstWalk(child, level + 1);
        }
        //console.log(node);

        var midPoint = getMidPoint(node);
        //console.log("midPoint of " + node.id + "= " + midPoint);

        //console.log(node.id + " is the parent of nodes " + leftMostChild.id + " and " + rightMostChild.id);

        if (leftSibling) {
          node.prelim += leftSibling.prelim + this.siblingSpacing;
          let meanNodeSize = getMeanNodeSize(node, leftSibling);
          node.prelim += meanNodeSize;
          node.modifier = node.prelim - midPoint;
          //console.log("prelim = " + leftSibling.prelim + " + " + this.siblingSpacing + " + " + meanNodeSize + " = " + node.prelim);
          //console.log("modifier= " + node.prelim + " - " + node.modifier);
          console.log("Calling Apportion for = " + node.id + " - level = " + level);
          apportion(node, level);
        } else {
          node.prelim = midPoint;
          //console.log("prelim  = " + node.prelim);
        }
      }
    };

    const getMidPoint = (node) => {
      var leftMostChild = node.getLeftMostChild();
      var rightMostChild = node.getRightMostChild();
      var midPoint = (leftMostChild.prelim + rightMostChild.prelim) / 2;
      return midPoint;
    };

    const setNodeNeighbor = (node) => {
      let isLeftMost = node.isLeftMost();
      let isRightMost = node.isRightMost();
      console.log("setNodeNeighbor NODE= " + node.id + " , level= " + node.level + ", isLeftMost(" + isLeftMost + ")" + ", isRightMost(" + isRightMost + ")");
      if (isRightMost) {
        //console.log("\\_setNodeNeighbor lastNodeAtLevel      = " + node.id);
        //console.log("\\_setNodeNeighbor this.lastNodeAtLevel[node.level]       = " + node);
        this.lastNodeAtLevel[node.level] = node;
      } else if (isLeftMost) {
        node.neighbor = this.lastNodeAtLevel[node.level];
        if (node.neighbor) ;
      } else ;
    };

    const getMeanNodeSize = (leftNode, rightNode) => {
      var meanNodeSize = 0.0;
      switch (this.rootOrientation) {
        case "NORTH":
        case "SOUTH":
          if (leftNode) {
            meanNodeSize = leftNode.width; /// 2;
          }
          if (rightNode) {
            meanNodeSize = rightNode.width; // / 2;
          }
          break;
        case "EAST":
        case "WEST":
          if (leftNode) {
            meanNodeSize = leftNode.height / 2;
          }
          if (rightNode) {
            meanNodeSize = rightNode.height / 2;
          }
          break;
      }
      return meanNodeSize;
    };

    /**
     * Determine the leftmost descendant of a node at a given depth.
     * This is implemented using a post-order walk of the subtree
     * under node, down to the level of searchDepth.
     * If we've searched to the proper distance, return the currently leftmost node.
     * Otherwise, recursively look at the progressively lower levels.
     */
    const getLeftmost = (node, currentLevel, searchDepth) => {
      //console.log("START getLeftmost= " + node.id + "/" + currentLevel + "/" + searchDepth);

      /*  searched far enough.           */
      if (currentLevel >= searchDepth) {
        return node;
      } else if (node.isLeaf()) {
        return null; /* This node has no descendants    */
      } else {
        /* Do a post-order walk of the subtree.     */
        var children_count = node.getChildrenCount();
        //console.log("  " + ThisNode.id + "/  children_count=" + children_count);
        for (var i = 0; i < children_count; i++) {
          let child = node.children[i];
          let leftmost = getLeftmost(child, currentLevel + 1, searchDepth);
          if (leftmost) {
            return leftmost;
          }
        }
      }
    };

    /*------------------------------------------------------
     * Clean up the positioning of small sibling subtrees.
     * Subtrees of a node are formed independently and placed as close together as possible.
     * By requiring that the subtrees be rigid at the time they are put together, we avoid
     * the undesirable effects that can accrue from positioning nodes rather than subtrees.
     *
     *  Called for non-leaf nodes
     *----------------------------------------------------*/
    const apportion = (node, level) => {
      //console.log("_apportion " + node.id);

      var firstChild = node.children[0];
      var firstChildLeftNeighbor = firstChild.neighbor;
      var compareDepth = 1;
      var depthToStop = this.maximumDepth - level;

      if (firstChild && firstChildLeftNeighbor && compareDepth < depthToStop) {
        var rightModSum, leftModSum, rightAncestor, leftAncestor;

        leftModSum = 0;
        rightModSum = 0;
        rightAncestor = firstChild;
        leftAncestor = firstChildLeftNeighbor;
        for (var l = 0; l < compareDepth; l += 1) {
          rightAncestor = rightAncestor.parent;
          leftAncestor = leftAncestor.parent;
          rightModSum += rightAncestor.modifier;
          leftModSum += leftAncestor.modifier;
        }
        /**
         * Find the moveDistance, and apply it to Node's subtree.
         * Apply appropriate portions to smaller interior subtrees.
         **/
        var meanNodeSize = 10; //firstChildLeftNeighbor._getSize(this.orientation);

        var totalGap = firstChildLeftNeighbor.prelim + leftModSum + this.subtreeSeparation + meanNodeSize - (firstChild.prelim + rightModSum);
        //console.log("\\__apportion: totalGap of " + node.id + " = " + totalGap);

        if (totalGap > 0) {
          /* Count interior sibling subtrees in LeftSiblings */

          var subtree, subtreeMoveAux;

          var numberOfLeftSiblings = 0;
          for (subtree = node; subtree && subtree !== leftAncestor; subtree = subtree.getLeftSibling()) {
            numberOfLeftSiblings += 1;
            //console.log("\\__apportion: numberOfLeftSiblings: " + numberOfLeftSiblings);
            //console.log("\\__apportion: leftAncestor = " + leftAncestor.id);
          }

          if (subtree) {
            /* Apply portions to appropriate leftsibling subtrees. */
            var portion = totalGap / numberOfLeftSiblings;
            subtreeMoveAux = node;

            while (subtreeMoveAux !== leftAncestor) {
              //console.log("\\__apportion: subtree " + subtree.id + " & " + "subtreeMoveAux " + subtreeMoveAux.id);

              subtreeMoveAux.prelim += totalGap;
              subtreeMoveAux.modifier += totalGap;
              totalGap -= portion;
              subtreeMoveAux = subtreeMoveAux.getLeftSibling();
            }
          } else {
            /* Don't need to move anything--it needs to be done by an ancestor because      */
            /* pAncestorNeighbor and pAncestorLeftmost are not siblings of each other.      */
            return;
          }
        } /* end of the while  */

        /* Determine the leftmost descendant of thisNode */
        /* at the next lower level to compare its         */
        /* positioning against that of its neighbor.     */
        compareDepth++;

        if (firstChild.getChildrenCount() === 0) {
          firstChild = getLeftmost(node, 0, compareDepth);
        } else {
          firstChild = firstChild.getFirstChild();
        }
        if (firstChild) {
          firstChildLeftNeighbor = firstChild.neighbor;
        }
      }


    }; // apportion

      /*------------------------------------------------------
       * During a second pre-order walk, each node is given a final x-coordinate by summing its preliminary
       * x-coordinate and the modifiers of all the node's ancestors.
       * The y-coordinate depends on the height of the tree.
       * (The roles of x and y are reversed for RootOrientations of EAST or WEST.)
       * Returns: TRUE if no errors, otherwise returns FALSE.
       *----------------------------------------- ----------*/
      const secondWalk = (node, level, modSum) => {
        //console.log("secondWalk    = " + node);
        if (level <= this.maximumDepth) {
          var xTopAdjustment = 0;
          var yTopAdjustment = 0;

          node.x = xTopAdjustment + node.prelim + modSum;
          node.y = yTopAdjustment + level * this.levelSeparation;
          //console.log("\\secondWalk: Node(" + node.id + " / " + xTopAdjustment + " / " + node.prelim + " / " + modSum);
          //console.log("\\secondWalk: " + node.x + "," + node.y);

          if (this.leavesStacked) {
            if (node.isLeaf()) {
              const indentation = 30;
              let index = node.getIndex();
              node.x = node.parent.x + indentation;
              node.y += node.getIndex() * this.nodeHeight + node.getIndex() * this.siblingSpacing; //	shift the node down
              console.log(`secondWalk: ${node} #${index}  (${node.x}, ${node.y})`);
            }
          }


          var children_count = node.getChildrenCount();
          for (var i = 0; i < children_count; i++) {
            var child = node.children[i];
            secondWalk(child, level + 1, modSum + node.modifier);
          }
        }
      };


    // PUBLIC FUNCTIONS
    this.calculate_Positions = (root, center) => {
      console.log("calculate_Positions", this, center);
      //var root = this.graph.getRoot();
      console.log("root", root);
      let starting_node = root;

      // call the private function
      firstWalk(starting_node, 0);
      secondWalk(starting_node, 0, 0);
    };

    this.getTreeDimension = () => {
        return { "TO DO" : ""};
    };
  }
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
    super(x, y, "Arc");
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
      this.type = "Circle";
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
        super(x, y, "Rectangle");
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

class InputDeviceTracker {
	constructor(canvas, callback) {
		console.log("InputDeviceTracker ()");

		this.canvas = canvas;
		this.callback = callback;

		/**
		 *  Stores the panning offset between the initial location and the canvas location after is has been panned
		 */
		this.translatedPos = { x: 0, y: 0 };

		/**
		 *  the accumulated horizontal(X) & vertical(Y) panning the user has done in total
		 */
		(this.netPanningX = 0), (this.netPanningY = 0);

		/**
		 *  coordinates of the last move
		 */
		(this.lastMoveX = 0), (this.lastMoveY = 0);

		this.startDragOffset = { x: 0, y: 0 };

		this.canvas.addEventListener("mousedown", this.onDown.bind(this));
		this.canvas.addEventListener("mousemove", this.onMove.bind(this));
		this.canvas.addEventListener("mouseup", this.onUp.bind(this));

		this.canvas.addEventListener("touchstart", this.onDown.bind(this));
		this.canvas.addEventListener("touchmove", this.onMove.bind(this));
		this.canvas.addEventListener("touchend", this.onUp.bind(this));
	}

	getCoordinatesFromEvent(evt) {
		var rect = self.canvas.getBoundingClientRect();
		var offsetTop = rect.top;
		var offsetLeft = rect.left;

		if (evt.touches) {
			return {
				x: evt.touches[0].clientX - offsetLeft,
				y: evt.touches[0].clientY - offsetTop,
			};
		} else {
			return {
				x: evt.clientX - offsetLeft,
				y: evt.clientY - offsetTop,
			};
		}
	}

	onDown(event) {
		// tell the browser we're handling this event
		event.preventDefault();
		event.stopPropagation();
		var mouseCoords = this.getCoordinatesFromEvent(event);

		// initial mouse click signaling the start of the dragging motion: we save the location of the user's mouse.
		// dragging offest = current mouse - panning
		this.startDragOffset.x = mouseCoords.x - this.translatedPos.x;
		this.startDragOffset.y = mouseCoords.y - this.translatedPos.y;

		this.callback("down", mouseCoords.x, mouseCoords.y);
	}

	onUp(event) {
		event.preventDefault();
		this.callback("up");
	}

	onMove(event) {
		// tell the browser we're handling this event
		event.preventDefault();
		event.stopPropagation();
		var mouseCoords = this.getCoordinatesFromEvent(event);
		this.callback("move", mouseCoords.x, mouseCoords.y);
	}
}

class MChart {
	constructor(container, options) {
		console.log("MChart container()");
		console.log(container);
		this.container = container;
		(this.startX = 0), (this.startY = 0);
		(this.lastMoveX = 0), (this.lastMoveY = 0);

		this.canvas = document.getElementById("canvas");
		//this.ctx = this.canvas.getContext("2d");
		this.ctx = setupHiDefCanvas(this.canvas);

		this.cw = this.canvas.width;
		this.ch = this.canvas.height;

		this.renderer = new Renderer(this.ctx);
		this.inputDeviceTracker = new InputDeviceTracker(
			this.canvas,
			this.manageInputEvents.bind(this)
		);

		const DEFAULTS = {
			display_grid: false,
			selection: {
				strokeStyle: "#CC0000", //  'rgba(255,51,0,1)', //'rgba(0,128,255,1)';
				lineWidth: 1,
				fillStyle: "rgba(255,51,0,0.05)", //'rgba(0,128,255, 0.2)';
			},
		};
		this.options = Object.assign({}, DEFAULTS, options);

		/* The selection rectangle */
		this.selection = new Rectangle(100, 100, 100, 100);
		this.selection.strokeStyle = this.options.selection.strokeStyle;
		this.selection.fillStyle = this.options.selection.fillStyle;
		this.selection.lineWidth = this.options.selection.lineWidth;

		/* The list of ojbects to draw */
		this.objects = [];

		/**
		 *  Stores the panning offset between the initial location and the canvas location after is has been panned
		 */
		this.translatePos = { x: 0, y: 0 };

		/**
		 *  the accumulated horizontal(X) & vertical(Y) panning the user has done in total
		 */
		this.netPanningX = 0;
		this.netPanningY = 0;

		/**
		 *  coordinates of the last move
		 */
		this.lastMoveX = 0; this.lastMoveY = 0;

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
		//this.draw();
	}

	/**
	 *  Private function to render one frame. It is being called by render()
	 */
	renderFrame = () => {
		// console.log("renderFrame")
		this.ctx.clearRect(0, 0, this.cw, this.ch);

		if (this.options.display_grid) {
			this.renderer.drawGrid(this.cw, this.ch);
		}

		this.objects.forEach((object) => {
			object.render(this.ctx);
			if (object.isSelected) {
				var selection;
				if (object instanceof Circle) {
					var bbox = object.getBBox();
					selection = new Rectangle(
						bbox.x,
						bbox.y,
						bbox.width,
						bbox.height
					);
				} else {
					selection = new Rectangle(
						object.x,
						object.y,
						object.width,
						object.height
					);
				}
				selection.strokeStyle = this.options.selection.strokeStyle;
				selection.lineWidth = this.options.selection.lineWidth;
				selection.render(this.ctx);

			}

			if (this.isSelecting == true) {
				this.selection.render(this.ctx);
			}
		});
	};

	render() {
		this.renderFrame();
		window.requestAnimationFrame(this.render.bind(this, this.canvas));
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
						console.log(
							"Clicked on : " +
								object.constructor.name +
								"/" +
								object.fillStyle
						);
						moveObjectToLastPosition(this.objects, object);
						this.clicked_on_the_canvas = false;
						this.isSelecting = false;
						this.isDragging = true;
					}
				}
				console.log(
					"clicked on the canvas = " + this.clicked_on_the_canvas
				);

				if (this.clicked_on_the_canvas) {
					console.log("clicked on the canvas");
					this.selection_startX = x;
					this.selection_startY = y;

					/* reset selection if user clicked on the canvas */
					this.objects.forEach((object) => {
						console.log(
							"RESET object " +
								object.fillStyle +
								" is Circle ? " +
								(object instanceof Circle)
						);
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
							console.log(
								"object is selected: " +
									object.constructor.name +
									"/" +
									object.fillStyle
							);
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
	}

	init() {
		this.inputDeviceTracker = new InputDeviceTracker(
			this.canvas,
			this.manageInputEvents.bind(this)
		);
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

class OrgChart {

    constructor(container) {
        this.container = container;

        const nodesContainer = document.createElement("div");
        nodesContainer.id = "nodes-container";
        this.container.appendChild(nodesContainer);

        this.linksContainer = document.createElement("div");
        this.linksContainer.id = "links-container";
        this.container.appendChild(this.linksContainer);
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.linksContainer.appendChild(this.svg);
    }

    setData(data) {
        console.log("HERE in setData", data);
    }
}

var version = "0.1";

export { AbstractGraphLayout, Arc, Circle, ForceDirected, Graph, Link, MChart, Node, OrgChart, Rectangle, Renderer, Tree, TreeLayout, TreeNode, Vector, rectContainsShape, setupHiDefCanvas, to_radians, version };
//# sourceMappingURL=index.js.map
