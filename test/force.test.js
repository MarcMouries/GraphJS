import { test, expect, describe } from "bun:test";
import Graph from "../src/graph/Graph.js";
import Node from "../src/graph/Node.js";
import ForceDirected from "../src/layout/ForceDirected.js";

function twoLinkedNodes(distance = 180) {
	const g = new Graph();
	g.addNode(new Node("a"));
	g.addNode(new Node("b"));
	g.addLink("a", "b");
	return new ForceDirected(g, { linkDistance: distance, center: { x: 0, y: 0 } });
}

function dist(a, b) {
	return Math.hypot(a.x - b.x, a.y - b.y);
}

describe("ForceDirected — lifecycle & events", () => {
	test("start() runs to convergence headlessly and fires start/tick/end", () => {
		const layout = twoLinkedNodes();
		const events = { start: 0, tick: 0, end: 0 };
		layout.on("start", () => events.start++);
		layout.on("tick", () => events.tick++);
		layout.on("end", () => events.end++);

		layout.start();

		expect(events.start).toBe(1);
		expect(events.tick).toBeGreaterThan(1);
		expect(events.end).toBe(1); // fired exactly once
		expect(layout.alpha).toBeLessThan(layout.options.alphaMin);
	});

	test("tick callback receives the node and link collections", () => {
		const layout = twoLinkedNodes();
		let received = null;
		layout.on("tick", (nodes, links) => {
			received = { nodes, links };
		});
		layout.tick();
		expect(Array.isArray(received.nodes)).toBe(true);
		expect(received.nodes).toHaveLength(2);
		expect(received.links).toHaveLength(1);
	});

	test("stop() halts and off() removes a listener", () => {
		const layout = twoLinkedNodes();
		let ticks = 0;
		const onTick = () => ticks++;
		layout.on("tick", onTick);
		layout.tick();
		layout.off("tick", onTick);
		layout.tick();
		expect(ticks).toBe(1);

		layout.start();
		expect(layout._running).toBe(false); // settled
	});
});

describe("ForceDirected — forces", () => {
	test("a linked pair settles near the configured link distance", () => {
		const D = 180;
		const layout = twoLinkedNodes(D);
		layout.start();
		const [a, b] = layout.graph.getNodes();
		const settled = dist(a, b);
		expect(settled).toBeGreaterThan(D * 0.4);
		expect(settled).toBeLessThan(D * 2);
	});

	test("repulsion pushes two disconnected nodes apart", () => {
		const g = new Graph();
		g.addNode(new Node("a"));
		g.addNode(new Node("b"));
		const layout = new ForceDirected(g, { center: { x: 0, y: 0 } });
		const [a, b] = layout.graph.getNodes();
		// Start them almost on top of each other.
		a.x = 0; a.y = 0; a.vx = 0; a.vy = 0;
		b.x = 5; b.y = 0; b.vx = 0; b.vy = 0;
		const before = dist(a, b);
		layout.start();
		expect(dist(a, b)).toBeGreaterThan(before + 10);
	});
});

describe("ForceDirected — pinning", () => {
	test("pinNode holds a node fixed through the whole simulation", () => {
		const layout = twoLinkedNodes();
		layout.pinNode("a", 500, 400);
		layout.start();
		const a = layout.graph.getNode("a");
		expect(a.x).toBe(500);
		expect(a.y).toBe(400);
		expect(a.pos.x).toBe(500); // mirrored onto pos for renderers
	});

	test("unpinNode releases a node so forces move it again", () => {
		const layout = twoLinkedNodes();
		layout.pinNode("a", 500, 400);
		layout.tick();
		expect(layout.graph.getNode("a").x).toBe(500);

		layout.unpinNode("a");
		layout.restart(1);
		expect(layout.graph.getNode("a").x).not.toBe(500);
	});
});

describe("ForceDirected — options", () => {
	test("honours the legacy GRAVITY / REPULSION aliases", () => {
		const g = new Graph();
		g.addNode(new Node("a"));
		const layout = new ForceDirected(g, { GRAVITY: 0.2, REPULSION: 1234 });
		expect(layout.options.gravity).toBe(0.2);
		expect(layout.options.repulsion).toBe(1234);
	});

	test("linkDistance accepts a function of the link", () => {
		const g = new Graph();
		g.addNode(new Node("a"));
		g.addNode(new Node("b"));
		g.addLink("a", "b");
		const layout = new ForceDirected(g, {
			linkDistance: (link) => (link.source.id === "a" ? 90 : 300),
		});
		expect(layout._resolveLinkDistance(layout.graph.linkList[0])).toBe(90);
	});
});
