import Vector from "../Vector";

const PI_2 = Math.PI * 2;

export default class Node {
	constructor(id) {
		this.id = id;
		this.size = 20;
		this.mass = (PI_2 * this.size) / 1.5;
		this.radius = this.size;

		this.force = new Vector(0, 0);

		this.pos = new Vector(0, 0);
		this.velocity = new Vector(0, 0);
		this.acceleration = new Vector(0, 0);
	}

	draw(ctx) {
		ctx.beginPath();
		//ctx.fillStyle = "darkGrey";
		ctx.fillStyle = "rgb(176,225,206)";

		ctx.arc(this.pos.x, this.pos.y, this.radius, 0, PI_2, false);
		ctx.fill();
		ctx.closePath();
		ctx.fillStyle = "black";
		ctx.textAlign = "center";
		ctx.textBaseline = "middle";
		ctx.fillText(this.id, this.pos.x, this.pos.y);
	}

	toString() {
		return "[" + this.id + ", " + this.pos.x + ", " + this.pos.y + "]";
	}
}
