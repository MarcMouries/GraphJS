
import Vector from '../Vector';

  const PI_2 = Math.PI * 2;

export default class Node {


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