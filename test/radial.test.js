import { test, expect, describe } from "bun:test";
import Graph from "../src/graph/Graph.js";
import RadialLayout from "../src/layout/RadialLayout.js";

function starGraph(childCount) {
	const nodes = [{ id: "root" }];
	const links = [];
	for (let i = 0; i < childCount; i++) {
		nodes.push({ id: "c" + i });
		links.push({ source: "root", target: "c" + i });
	}
	const g = new Graph();
	g.loadJSON({ nodes, links });
	return g;
}

const radius = (node, center) => Math.hypot(node.x - center.x, node.y - center.y);

describe("RadialLayout", () => {
	test("places the center node at the configured center", () => {
		const g = starGraph(4);
		const center = { x: 500, y: 300 };
		new RadialLayout(g, { centerNode: "root", center }).run();
		const root = g.getNode("root");
		expect(root.x).toBe(500);
		expect(root.y).toBe(300);
		expect(root.pos.x).toBe(500); // mirrored for renderers
	});

	test("first-degree nodes land on the first ring (ringSpacing)", () => {
		const g = starGraph(6);
		const center = { x: 0, y: 0 };
		const ringSpacing = 150;
		new RadialLayout(g, { centerNode: "root", ringSpacing, center }).run();
		for (let i = 0; i < 6; i++) {
			const child = g.getNode("c" + i);
			expect(Math.abs(radius(child, center) - ringSpacing)).toBeLessThan(1e-6);
			expect(child.depth).toBe(1);
		}
	});

	test("distributes siblings evenly around the ring (no i%2 offset hack)", () => {
		const g = starGraph(4);
		const center = { x: 0, y: 0 };
		new RadialLayout(g, { centerNode: "root", center }).run();
		const angles = [];
		for (let i = 0; i < 4; i++) angles.push(g.getNode("c" + i).angle);
		// Adjacent siblings are a quarter-turn apart.
		for (let i = 1; i < angles.length; i++) {
			expect(Math.abs((angles[i] - angles[i - 1]) - Math.PI / 2)).toBeLessThan(1e-6);
		}
	});

	test("second-degree nodes land on the second ring", () => {
		const g = new Graph();
		g.loadJSON({
			nodes: [{ id: "root" }, { id: "a" }, { id: "b" }],
			links: [
				{ source: "root", target: "a" },
				{ source: "a", target: "b" },
			],
		});
		const center = { x: 0, y: 0 };
		const ringSpacing = 100;
		new RadialLayout(g, { centerNode: "root", ringSpacing, center }).run();
		expect(Math.abs(radius(g.getNode("a"), center) - ringSpacing)).toBeLessThan(1e-6);
		expect(Math.abs(radius(g.getNode("b"), center) - 2 * ringSpacing)).toBeLessThan(1e-6);
		expect(g.getNode("b").depth).toBe(2);
	});

	test("handles cycles without infinite recursion", () => {
		const g = new Graph();
		g.loadJSON({
			nodes: [{ id: "a" }, { id: "b" }, { id: "c" }],
			links: [
				{ source: "a", target: "b" },
				{ source: "b", target: "c" },
				{ source: "c", target: "a" }, // cycle back
			],
		});
		expect(() => new RadialLayout(g, { centerNode: "a", center: { x: 0, y: 0 } }).run()).not.toThrow();
		expect(typeof g.getNode("c").x).toBe("number");
	});

	test("accepts a centerNode passed as a Node instance", () => {
		const g = starGraph(3);
		const root = g.getNode("root");
		new RadialLayout(g, { centerNode: root, center: { x: 10, y: 20 } }).run();
		expect(root.x).toBe(10);
		expect(root.y).toBe(20);
	});
});
