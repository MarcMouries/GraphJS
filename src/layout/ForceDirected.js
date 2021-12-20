import Vector from '../Vector';

export default class ForceDirected {
  constructor(graph, options) {

    this.graph = graph;

    const DEFAULTS = {
      GRAVITY: 2, // 0.9,
      REPULSION: 500000,
    }
    this.options = Object.assign({}, DEFAULTS, options);
  }
  applyForcesTowardsCenter() {
    // apply force towards center
    this.graph.nodeList.forEach((node) => {
      let gravity = node.pos.copy().mult(-1).mult(this.options.GRAVITY);
      node.force = gravity;
      //node.applyForce(gravity);
      //console.log(node);
    });
  }

  applyRepulsiveForces() {
    // apply repulsive force between nodes
    for (let i = 0; i < this.graph.nodeList.length; i++) {
      for (let j = i + 1; j < this.graph.nodeList.length; j++) {
        if (i != j) {
          let node1 = this.graph.nodeList[i];
          let node2 = this.graph.nodeList[j];

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
          dir.normalize()

          let force1 = dir.mult(this.options.REPULSION);
          force1.div(distance * distance);

          let inverseForce = force1.copy().mult(-1);
          node2.force.add(force1);
          node1.force.add(inverseForce);
        }
      }
    }
  }

  applyForcesExertedByConnections() {
    this.graph.linkList.forEach((con) => {
      let node1 = this.graph.nodeList[con[0]];
      let node2 = this.graph.nodeList[con[1]];

      //let maxDis = con[2];

      let dir = Vector.sub(node1.pos, node2.pos);

      let neg_force = new Vector(0, 0).sub(dir);
      let pos_force = new Vector(0, 0).add(dir);

      node1.force.add(neg_force);
      node2.force.add(pos_force);
    });
  }
}