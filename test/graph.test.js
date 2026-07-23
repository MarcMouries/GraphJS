import { test, expect, describe } from "bun:test";
import Graph from "../src/graph/Graph.js";
import Node from "../src/graph/Node.js";
import Link from "../src/graph/Link.js";

describe("Graph data model", () => {
	test("addNode / getNode / node count", () => {
		const g = new Graph();
		g.addNode(new Node("a", { name: "A" }));
		g.addNode(new Node("b", { name: "B" }));
		expect(g.getNodeCount()).toBe(2);
		expect(g.getNode("a").data.name).toBe("A");
		expect(g.getNode("missing")).toBeUndefined();
	});

	test("removeNode", () => {
		const g = new Graph();
		g.addNode(new Node("a"));
		g.removeNode("a");
		expect(g.getNodeCount()).toBe(0);
	});

	test("addLink builds adjacency and children", () => {
		const g = new Graph();
		g.addNode(new Node("a"));
		g.addNode(new Node("b"));
		g.addLink("a", "b");
		expect(g.getLinkCount()).toBe(1);
		expect(g.getNode("a").getAdjacents().map((n) => n.id)).toEqual(["b"]);
		expect(g.adjacency["a"]["b"]).toHaveLength(1);
	});

	test("addLink throws on a non-existent node", () => {
		const g = new Graph();
		g.addNode(new Node("a"));
		expect(() => g.addLink("a", "missing")).toThrow(TypeError);
	});

	test("loadJSON accepts a plain object with nodes + links", () => {
		const g = new Graph();
		g.loadJSON({
			nodes: [{ id: "a" }, { id: "b" }, { id: "c" }],
			links: [
				{ source: "a", target: "b" },
				{ source: "b", target: "c" },
			],
		});
		expect(g.getNodeCount()).toBe(3);
		expect(g.getLinkCount()).toBe(2);
	});
});

describe("Link", () => {
	test("stores source/target and a derived id", () => {
		const a = new Node("a");
		const b = new Node("b");
		const link = new Link(a, b);
		expect(link.source).toBe(a);
		expect(link.target).toBe(b);
		expect(link.id).toContain("a");
		expect(link.id).toContain("b");
	});
});
