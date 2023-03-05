// =============================================================
// Force Directed Layout
// =============================================================
import GraphLayout from "./GraphLayout";
import Vector from "../geometry/Vector";

export default class ForceDirected extends GraphLayout {
	constructor(graph, options) {
		super();
		this.graph = graph;
		this.initNodes();

		const DEFAULTS = {
			GRAVITY: 0.9,
			REPULSION: 500000,
		};
		this.options = Object.assign({}, DEFAULTS, options);
	}

	initNodes() {
		let min = -1000;
		let max = 1000;

		this.graph.nodeList.forEach((node) => {
			node.pos = new Vector.random(min, max);
		});
	}

	run() {
		//requestAnimationFrame(this.animate);
		console.log("run");
	}

	animate = () => {
		console.log("animate");
	};

	/**
	 *  applyForce
	 *
	 *  Newton’s second law.
	 *  Receive a force, divide by mass, and add to acceleration.
	 */
	applyForce(node, force) {
		let forceOverMass = Vector.div(force, node.mass);
		node.acceleration.add(forceOverMass);
	}

	updateNodesVelocity() {
		this.graph.nodeList.forEach((node) => {
			let force_copy = node.acceleration.copy();
			let forceOverMass = force_copy.div(node.mass);
			//	node.velocity.add( forceOverMass );
			node.pos.add(forceOverMass);

			//	node.velocity.add(node.acceleration);
			//	node.pos.add(node.velocity);
			//	node.acceleration.mult(0);
		});
	}

	applyForcesTowardsCenter() {
		// apply force towards center
		this.graph.nodeList.forEach((node) => {
			let gravity = node.pos.copy().mult(-1).mult(this.options.GRAVITY);
			node.acceleration = gravity;
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
					//console.log("applyRepulsiveForces");
					//console.log(node1);
					//console.log(node2);

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
					dir.normalize();

					let force1 = dir.mult(this.options.REPULSION);
					force1.div(distance * distance);

					let inverseForce = force1.copy().mult(-1);
					node2.acceleration.add(force1);
					node1.acceleration.add(inverseForce);

					//node2.applyForce(force1);
					//node1.applyForce(inverseForce);
				}
			}
		}
	}

	applyForcesExertedByConnections() {
		this.graph.linkList.forEach((link) => {
			let node1 = link.source;
			let node2 = link.target;

			//let maxDis = con[2];
			//let connector_length = 100;

			let dir = Vector.sub(node1.pos, node2.pos);

			let neg_force = new Vector(0, 0).sub(dir);
			let pos_force = new Vector(0, 0).add(dir);

			node1.acceleration.add(neg_force);
			node2.acceleration.add(pos_force);

			//node1.applyForce(neg_force);
			//node2.applyForce(pos_force);
		});
	}

	applyForces() {
		// Force equals mass times acceleration.
		// Newton’s second law, F→=M×A→ (or force = mass * acceleration).
		this.applyForcesTowardsCenter();

		this.applyRepulsiveForces();

		this.applyForcesExertedByConnections();

		this.updateNodesVelocity();

		// kinetic energy (KE) is equal to half of an object's mass (1/2*m) multiplied by the velocity squared.
		/*
		let total_KE = 0.0;
		this.graph.nodeList.forEach((node) => {
			let velocity = node.velocity.mag();

			let node_KE = 0.5 * node.mass * (velocity * velocity);
			total_KE = + node_KE;

		});
		console.warn("total_KE= " + total_KE);
		*/
	}
}
