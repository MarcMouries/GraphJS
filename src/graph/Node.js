import Vector from "../geometry/Vector";


export default class Node {
	constructor(id, data) {
		this.id = id;

		this.data = data;
		this.level = 0;
		this.children = [];
		this.parent;
		this.neighbor;
		this.isCollapsed = false;

		this.size = 20;
		this.mass = 13; //(6 * this.size) / 1.5;
		this.radius = this.size;

		this.pos = new Vector(0, 0);
		this.velocity = new Vector(0, 0);
		this.acceleration = new Vector(0, 0);
	}

	toString() {
		return "Node " + this.id + "(" + this.pos.x + ", " + this.pos.y + ")";
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

	getChildAt(i) {
		return this.children[i];
	}

	getFirstChild() {
		return this.getChildAt(0);
	}

	getChildrenCount() {
		return this.children.length;
	}
	isLeaf() {
		return this.children && this.children.length == 0;
	}
	hasChild() {
		return this.children && this.children.length > 0;
	}
	getLastChild() {
		return this.getChildAt(this.getChildrenCount() - 1);
	}
	isAncestorCollapsed() {
		if (this.parent == null) {
			return false;
		}
		return this.parent.isCollapsed
			? true
			: this.parent.id === -1
			? false
			: this.parent.isAncestorCollapsed();
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

	getLeftSibling() {
		if (this.parent === null || this.isLeftMost()) {
			return null;
		} else {
			var index = this.parent.children.indexOf(this);
			return this.parent.children[index - 1];
		}
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
}
