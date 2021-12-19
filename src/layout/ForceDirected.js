import Vector from './Vector';

export class ForceDirected {
    constructor(graph) {
  
      this.GRAVITY = 2;//0.9;
      this.REPULSION = 5000;
  
    }
     applyForcesTowardsCenter() {
      // apply force towards center
      nodes.forEach((node) => {
        let gravity = node.pos.copy().mult(-1).mult(this.GRAVITY);
        node.force = gravity;
        //node.applyForce(gravity);
        //console.log(node);
      });
    }
  
    applyRepulsiveForces() {
      // apply repulsive force between nodes
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          if (i != j) {
            let node1 = nodes[i];
            let node2 = nodes[j];
            // The gravitational force F between two bodies of mass m1 and m2 is
            // F = G*m1*m2 / r2
            // the vector that points from one object to the other
            // let dir = graphboard.Vector.sub(nodes[j].pos, nodes[i].pos);
            let dir = graphboard.Vector.sub(node2.pos, node1.pos);
            // the length (magnitude) of that vector is the distance between the two objects.
            let distance = dir.mag();
  
            //dir.normalize()
  
  
            // The strength of the force is inversely proportional to the distance squared.
            // The farther away an object is, the weaker the force; the closer, the stronger.
            let force = dir.div(distance * distance);
            force.mult(this.REPULSION);
            console.log(this.REPULSION);
            node2.force.add(force);
            let inverseForce = force.copy().mult(-1);
            node1.force.add(inverseForce);
          }
        }
      }
    }
  
  }