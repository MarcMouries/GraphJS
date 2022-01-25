/**
 *  A vector is an entity that has both magnitude and direction.
 *  2D vector implementation based on the vector functions in P5.js
 */
 export class Vector {
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

export default Vector;