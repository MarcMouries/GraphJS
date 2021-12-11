/*
2D vector implementation.
Based on the vector functions in P5.js 
*/
class Vector {
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

	lerp(v1, amount) {
		this.x += (v1.x - this.x) * amount || 0;
		this.y += (v1.y - this.y) * amount || 0;
		return this;
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


let v1 = new Vector(0, 0);
let v2 = new Vector(100, 100);

let amount = 0.5;
let v3 = Vector.lerp(v1, v2, amount);

// v3 has components [50,50]
console.log("=====================");
console.log("v1 = " + v1.toString());
console.log("v2 = " + v2.toString());
console.log("v3 = " + v3.toString());

export default Vector;
