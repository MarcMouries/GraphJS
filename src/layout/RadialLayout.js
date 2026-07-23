// =============================================================
// Radial Layout
// -------------------------------------------------------------
// Ported and generalised from LinkAnalysis's MRadialLayout.
//
// Places a `centerNode` at the center and lays its descendants out on
// concentric rings: 1st-degree nodes at `ringSpacing`, 2nd-degree at
// `2 * ringSpacing`, and so on. Each node receives an angular slice of its
// parent's range and its children are distributed evenly inside that slice,
// so siblings never overlap and branches never cross (no `i % 2` offset hack).
//
//   const layout = new RadialLayout(graph, {
//     centerNode: "subject_id",   // id or Node (required)
//     ringSpacing: 150,
//     startAngle: 0,
//     center: { x: 600, y: 400 },
//   });
//   layout.run();
//   // every reachable node now has x / y (mirrored onto node.pos)
// =============================================================
import AbstractGraphLayout from "./AbstractGraphLayout";

const DEFAULTS = {
	centerNode: null, // id or Node — required
	ringSpacing: 150, // radial distance between successive rings
	startAngle: 0, // angle (radians) the first ring starts at
	center: null, // { x, y }; defaults to the origin
};

export default class RadialLayout extends AbstractGraphLayout {
	constructor(graph, options = {}) {
		super(graph);
		this.graph = graph;
		this.options = { ...DEFAULTS, ...options };
		this.center = this.options.center || { x: 0, y: 0 };
	}

	_resolveCenterNode() {
		const c = this.options.centerNode;
		if (c == null) return null;
		// A Node exposes getAdjacents(); anything else is treated as an id.
		if (typeof c === "object" && typeof c.getAdjacents === "function") return c;
		return this.graph.getNode(c);
	}

	_syncPos(node) {
		if (node.pos) {
			node.pos.x = node.x;
			node.pos.y = node.y;
		} else {
			node.pos = { x: node.x, y: node.y };
		}
	}

	run() {
		const start = this._resolveCenterNode();
		if (!start) {
			console.error("RadialLayout: a valid `centerNode` (id or Node) is required.");
			return this;
		}
		if (this.graph.getNodes().length === 0) {
			console.error("RadialLayout: can't run on an empty graph.");
			return this;
		}

		const { ringSpacing, startAngle } = this.options;
		const visited = new Set();

		start.x = this.center.x;
		start.y = this.center.y;
		start.depth = 0;
		start.angle = 0;
		this._syncPos(start);
		visited.add(start.id);

		// Recursively place a node's not-yet-visited neighbours within the
		// angular range [angleStart, angleEnd).
		const place = (node, depth, angleStart, angleEnd) => {
			const children = node.getAdjacents().filter((child) => !visited.has(child.id));
			const count = children.length;
			if (count === 0) return;

			const slice = (angleEnd - angleStart) / count;
			const radius = depth * ringSpacing;

			children.forEach((child, i) => {
				visited.add(child.id);
				const childStart = angleStart + slice * i;
				const childEnd = childStart + slice;
				const angle = (childStart + childEnd) / 2; // centered in its slice

				child.x = this.center.x + radius * Math.cos(angle);
				child.y = this.center.y + radius * Math.sin(angle);
				child.depth = depth;
				child.angle = angle;
				child.angleRange = slice;
				this._syncPos(child);

				place(child, depth + 1, childStart, childEnd);
			});
		};

		place(start, 1, startAngle, startAngle + 2 * Math.PI);
		return this;
	}

	// Compatibility shim for the AbstractGraphLayout call signature.
	calculate_Positions(graph, centerNode, center) {
		if (graph) this.graph = graph;
		if (centerNode != null) this.options.centerNode = centerNode;
		if (center) this.center = center;
		return this.run();
	}
}
