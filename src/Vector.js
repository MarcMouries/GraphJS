/**
 *  A vector is an entity that has both magnitude and direction.
 *  2D vector implementation based on the vector functions in P5.js 
 */
 export class Vector {
	constructor(x, y) {
		this.x = x || 0;
		this.y = y || 0;
	}

	static add(v1, v2) {
		return new Vector(v1.x + v2.x, v1.y + v2.y);
	}
	static lerp(v1, v2, amount) {
		let result = v1.copy();
		return result.lerp(v2, amount);
	}

	add(n) {
		this.x += n;
		this.y += n;
		return this;
	}
	copy() {
		return new Vector(this.x, this.y);
	}

	/* divide vector length (ie magnitude) by a constant*/
	div(n) {
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
