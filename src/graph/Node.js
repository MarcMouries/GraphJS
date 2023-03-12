import Vector from "../geometry/Vector";


export default class Node {
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
