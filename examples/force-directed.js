// Force-directed layout example.
//   bun run examples/force-directed.js > examples/img/force-directed.svg
import { Graph, ForceDirected } from "../src/index.js";
import { renderGraphSVG } from "./render.js";

// A small social network with two loosely-connected clusters.
const data = {
	nodes: [
		{ id: "ana", name: "Ana" }, { id: "ben", name: "Ben" }, { id: "cara", name: "Cara" },
		{ id: "dan", name: "Dan" }, { id: "eve", name: "Eve" }, { id: "finn", name: "Finn" },
		{ id: "gina", name: "Gina" }, { id: "hugo", name: "Hugo" }, { id: "ivy", name: "Ivy" },
		{ id: "jon", name: "Jon" }, { id: "kim", name: "Kim" }, { id: "leo", name: "Leo" },
	],
	edges: [
		{ source: "ana", target: "ben" }, { source: "ana", target: "cara" }, { source: "ben", target: "cara" },
		{ source: "cara", target: "dan" }, { source: "dan", target: "eve" }, { source: "eve", target: "finn" },
		{ source: "dan", target: "finn" }, { source: "finn", target: "gina" }, { source: "gina", target: "hugo" },
		{ source: "hugo", target: "ivy" }, { source: "ivy", target: "jon" }, { source: "jon", target: "kim" },
		{ source: "kim", target: "gina" }, { source: "leo", target: "jon" }, { source: "leo", target: "ana" },
		{ source: "eve", target: "kim" },
	],
};

const graph = new Graph();
graph.loadJSON(data);

const layout = new ForceDirected(graph, {
	center: { x: 0, y: 0 },
	linkDistance: 160,
	repulsion: 30000,
	gravity: 0.04,
});
layout.on("end", () => process.stdout.write(renderGraphSVG(graph, { radius: 15, nodeFill: "#1f6feb" }) + "\n"));
layout.start(); // headless: runs to convergence, then fires "end"
