// =============================================================
// Force Directed Layout
// -------------------------------------------------------------
// A physics-based graph layout with a real animation loop.
//
//   const layout = new ForceDirected(graph, {
//     gravity: 0.05, repulsion: 800, damping: 0.9,
//     linkDistance: 180, linkStrength: 0.7,
//     center: { x: 600, y: 400 },
//   });
//   layout.on("tick", (nodes) => renderer.update(nodes));
//   layout.on("end", () => console.log("settled"));
//   layout.pinNode("subject_id", 600, 400);
//   layout.start();
//
// Node positions are exposed as `node.x` / `node.y` (canonical) and mirrored
// onto `node.pos` for renderers that read the Vector. Pinned nodes carry
// `node.fx` / `node.fy`.
// =============================================================
import AbstractGraphLayout from "./AbstractGraphLayout";

const DEFAULTS = {
	gravity: 0.05, // attraction strength toward `center`
	repulsion: 800, // node-node repulsion coefficient
	linkDistance: 180, // rest length of a link: number | (link) => number
	linkStrength: 0.7, // spring stiffness (0..1)
	damping: 0.9, // velocity retained each tick (0..1)
	alphaDecay: 0.0228, // cooling rate per tick
	alphaMin: 0.001, // simulation settles below this alpha
	center: null, // { x, y }; defaults to the origin
};

export default class ForceDirected extends AbstractGraphLayout {
	constructor(graph, options = {}) {
		super(graph);
		this.graph = graph;

		const o = options || {};
		this.options = {
			// Accept the legacy uppercase GRAVITY / REPULSION aliases.
			gravity: o.gravity ?? o.GRAVITY ?? DEFAULTS.gravity,
			repulsion: o.repulsion ?? o.REPULSION ?? DEFAULTS.repulsion,
			linkDistance: o.linkDistance ?? DEFAULTS.linkDistance,
			linkStrength: o.linkStrength ?? DEFAULTS.linkStrength,
			damping: o.damping ?? DEFAULTS.damping,
			alphaDecay: o.alphaDecay ?? DEFAULTS.alphaDecay,
			alphaMin: o.alphaMin ?? DEFAULTS.alphaMin,
			center: o.center ?? DEFAULTS.center ?? { x: 0, y: 0 },
		};
		this.center = this.options.center;

		this.alpha = 1;
		this._running = false;
		this._ended = false;
		this._raf = null;
		this._listeners = { start: [], tick: [], end: [] };

		this.initNodes();
	}

	// -----------------------------------------------------------------
	//  Event emitter
	// -----------------------------------------------------------------
	on(event, handler) {
		(this._listeners[event] ||= []).push(handler);
		return this;
	}
	off(event, handler) {
		const list = this._listeners[event];
		if (list) this._listeners[event] = list.filter((h) => h !== handler);
		return this;
	}
	emit(event, ...args) {
		const list = this._listeners[event];
		if (list) for (const h of list.slice()) h(...args);
	}

	// -----------------------------------------------------------------
	//  Seeding
	// -----------------------------------------------------------------
	// Deterministic circular seed: reproducible layouts (no Math.random),
	// which also keeps the simulation and its tests stable.
	initNodes() {
		const nodes = this.graph.getNodes();
		const n = nodes.length || 1;
		const radius = this.options.linkDistance * Math.max(1, n / (2 * Math.PI));
		nodes.forEach((node, i) => {
			if (typeof node.x !== "number" || typeof node.y !== "number") {
				const angle = (2 * Math.PI * i) / n;
				node.x = this.center.x + radius * Math.cos(angle);
				node.y = this.center.y + radius * Math.sin(angle);
			}
			if (typeof node.vx !== "number") node.vx = 0;
			if (typeof node.vy !== "number") node.vy = 0;
			this._syncPos(node);
		});
	}

	_syncPos(node) {
		if (node.pos) {
			node.pos.x = node.x;
			node.pos.y = node.y;
		} else {
			node.pos = { x: node.x, y: node.y };
		}
	}

	_resolveLinkDistance(link) {
		const d = this.options.linkDistance;
		return typeof d === "function" ? d(link) : d;
	}

	// -----------------------------------------------------------------
	//  Pinning
	// -----------------------------------------------------------------
	pinNode(nodeId, x, y) {
		const node = this.graph.getNode(nodeId);
		if (!node) return this;
		node.fx = x != null ? x : node.x;
		node.fy = y != null ? y : node.y;
		node.x = node.fx;
		node.y = node.fy;
		node.vx = 0;
		node.vy = 0;
		this._syncPos(node);
		return this;
	}
	unpinNode(nodeId) {
		const node = this.graph.getNode(nodeId);
		if (node) {
			node.fx = null;
			node.fy = null;
		}
		return this;
	}

	// -----------------------------------------------------------------
	//  Simulation loop
	// -----------------------------------------------------------------
	start() {
		if (this._running) return this;
		this._running = true;
		this._ended = false;
		this.emit("start");

		if (typeof requestAnimationFrame === "function") {
			const loop = () => {
				if (!this._running) return;
				this.tick();
				if (this._running) this._raf = requestAnimationFrame(loop);
			};
			this._raf = requestAnimationFrame(loop);
		} else {
			// Headless (Node/Bun): run synchronously to convergence.
			let guard = 0;
			while (this._running && this.alpha >= this.options.alphaMin && guard < 100000) {
				this.tick();
				guard++;
			}
		}
		return this;
	}

	stop() {
		this._running = false;
		if (this._raf != null && typeof cancelAnimationFrame === "function") {
			cancelAnimationFrame(this._raf);
		}
		this._raf = null;
		return this;
	}

	// Warm restart: re-heat the simulation without resetting positions.
	restart(alpha = 1) {
		this.alpha = alpha;
		this._ended = false;
		if (!this._running) this.start();
		return this;
	}

	// One cooling step of the simulation. Safe to call manually (tests,
	// step-through) as well as from the animation loop.
	tick() {
		this._step(true);
		this.alpha *= 1 - this.options.alphaDecay;
		this.emit("tick", this.graph.getNodes(), this.graph.linkList || []);
		if (this.alpha < this.options.alphaMin && !this._ended) {
			this._ended = true;
			this._running = false;
			if (this._raf != null && typeof cancelAnimationFrame === "function") {
				cancelAnimationFrame(this._raf);
			}
			this._raf = null;
			this.emit("end");
		}
		return this;
	}

	// Legacy single-step API used by the standalone canvas harness. Runs a
	// physics step at full strength (no cooling, no events).
	applyForces() {
		this._step(false);
	}
	// Legacy alias.
	run() {
		return this.start();
	}

	// -----------------------------------------------------------------
	//  Physics — one integration step.
	//  `cool` scales displacement by the current alpha so the system settles.
	// -----------------------------------------------------------------
	_step(cool) {
		const nodes = this.graph.getNodes();
		const links = this.graph.linkList || [];
		const { repulsion, linkStrength, gravity, damping } = this.options;

		for (const node of nodes) {
			node._fx = 0;
			node._fy = 0;
		}

		// Repulsion between every pair of nodes (O(n^2), inverse-square).
		for (let i = 0; i < nodes.length; i++) {
			for (let j = i + 1; j < nodes.length; j++) {
				const a = nodes[i];
				const b = nodes[j];
				let dx = b.x - a.x;
				let dy = b.y - a.y;
				let d2 = dx * dx + dy * dy;
				if (d2 === 0) {
					// Deterministic nudge so coincident nodes separate.
					dx = (i - j) || 1;
					dy = 1;
					d2 = dx * dx + dy * dy;
				}
				const dist = Math.sqrt(d2);
				const force = repulsion / d2;
				const ux = dx / dist;
				const uy = dy / dist;
				a._fx -= ux * force;
				a._fy -= uy * force;
				b._fx += ux * force;
				b._fy += uy * force;
			}
		}

		// Link springs pull endpoints toward the rest length.
		for (const link of links) {
			const s = link.source;
			const t = link.target;
			if (!s || !t) continue;
			const dx = t.x - s.x;
			const dy = t.y - s.y;
			const dist = Math.sqrt(dx * dx + dy * dy) || 1e-6;
			const desired = this._resolveLinkDistance(link);
			const k = ((dist - desired) / dist) * linkStrength;
			const fx = dx * k * 0.5;
			const fy = dy * k * 0.5;
			s._fx += fx;
			s._fy += fy;
			t._fx -= fx;
			t._fy -= fy;
		}

		// Gravity toward the configured center.
		for (const node of nodes) {
			node._fx += (this.center.x - node.x) * gravity;
			node._fy += (this.center.y - node.y) * gravity;
		}

		// Integrate.
		const scale = cool ? this.alpha : 1;
		for (const node of nodes) {
			if (node.fx != null && node.fy != null) {
				node.x = node.fx;
				node.y = node.fy;
				node.vx = 0;
				node.vy = 0;
			} else {
				node.vx = (node.vx + node._fx) * damping;
				node.vy = (node.vy + node._fy) * damping;
				node.x += node.vx * scale;
				node.y += node.vy * scale;
			}
			this._syncPos(node);
		}
	}
}
