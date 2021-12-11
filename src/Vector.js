class Vector {
	constructor(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}

	static add(v1, v2) {
		return new Vector(v1.x + v2.x, v1.y + v2.y);
	}

	copy() {
		return new Vector(this.x, this.y);
	}

	sub(v) {
		this.x -= v.x || 0;
		this.y -= v.y || 0;

		return this;
	}

	toString() {
		return "[" + this.x + ", " + this.y + "]";
	}
}

export default Vector;
