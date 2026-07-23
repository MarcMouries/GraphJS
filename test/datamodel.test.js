import { test, expect, describe } from "bun:test";
import Graph from "../src/graph/Graph.js";
import Node from "../src/graph/Node.js";
import Link from "../src/graph/Link.js";

describe("Link metadata", () => {
	test("stores styling metadata and a free-form data bag", () => {
		const a = new Node("a");
		const b = new Node("b");
		const link = new Link(a, b, {
			label: "Wife",
			type: "family",
			color: "#58a6ff",
			width: 2.5,
			dashArray: "4,3",
			opacity: 0.6,
			weight: 1,
			data: { caseId: 42 },
		});
		expect(link.label).toBe("Wife");
		expect(link.type).toBe("family");
		expect(link.color).toBe("#58a6ff");
		expect(link.width).toBe(2.5);
		expect(link.dashArray).toBe("4,3");
		expect(link.opacity).toBe(0.6);
		expect(link.weight).toBe(1);
		expect(link.data.caseId).toBe(42);
	});

	test("defaults dashArray to null and data to {}", () => {
		const link = new Link(new Node("a"), new Node("b"));
		expect(link.dashArray).toBeNull();
		expect(link.data).toEqual({});
	});
});

describe("loadJSON edge metadata", () => {
	test("parses link metadata onto the Link instances", () => {
		const g = new Graph();
		g.loadJSON({
			nodes: [{ id: "a" }, { id: "b" }],
			links: [{ source: "a", target: "b", label: "Known Address", type: "address" }],
		});
		const [link] = g.linkList;
		expect(link.label).toBe("Known Address");
		expect(link.type).toBe("address");
	});

	test("accepts an `edges` key as an alias for `links`", () => {
		const g = new Graph();
		g.loadJSON({
			nodes: [{ id: "a" }, { id: "b" }],
			edges: [{ source: "a", target: "b", type: "arrest" }],
		});
		expect(g.getLinkCount()).toBe(1);
		expect(g.linkList[0].type).toBe("arrest");
	});
});

describe("graph queries", () => {
	// a — b — c — d   (path)
	function pathGraph() {
		const g = new Graph();
		g.loadJSON({
			nodes: [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }],
			links: [
				{ source: "a", target: "b" },
				{ source: "b", target: "c" },
				{ source: "c", target: "d" },
			],
		});
		return g;
	}

	test("getNeighbors returns nodes within N hops (undirected, inclusive)", () => {
		const g = pathGraph();
		const oneHop = g.getNeighbors("a", 1);
		expect(oneHop.nodes.map((n) => n.id).sort()).toEqual(["a", "b"]);

		const twoHop = g.getNeighbors("a", 2);
		expect(twoHop.nodes.map((n) => n.id).sort()).toEqual(["a", "b", "c"]);
		// Only links fully inside the neighbourhood are returned.
		expect(twoHop.links.map((l) => l.id)).toContain("a → b");
		expect(twoHop.links.map((l) => l.id)).toContain("b → c");
	});

	test("getNeighbors traverses against link direction too", () => {
		const g = pathGraph();
		// 'c' is only ever a target, but neighbours are undirected.
		expect(g.getNeighbors("c", 1).nodes.map((n) => n.id).sort()).toEqual(["b", "c", "d"]);
	});

	test("getNeighbors on an unknown node is empty", () => {
		expect(pathGraph().getNeighbors("ghost").nodes).toHaveLength(0);
	});

	test("getCentrality is degree / (n-1)", () => {
		const g = pathGraph(); // 4 nodes
		expect(g.getCentrality("a")).toBeCloseTo(1 / 3); // degree 1
		expect(g.getCentrality("b")).toBeCloseTo(2 / 3); // degree 2
	});
});
