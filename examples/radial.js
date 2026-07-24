// Radial layout example — a subject at the center, relations on rings.
//   bun run examples/radial.js > examples/img/radial.svg
import { Graph, RadialLayout } from "../src/index.js";
import { renderGraphSVG } from "./render.js";

const data = {
	nodes: [
		{ id: "S", name: "Subject" },
		{ id: "a1", name: "Wife" }, { id: "a2", name: "Brother" }, { id: "a3", name: "Associate" },
		{ id: "a4", name: "Address" }, { id: "a5", name: "Vehicle" },
		{ id: "b1", name: "Child" }, { id: "b2", name: "Co-def." }, { id: "b3", name: "Arrest" },
		{ id: "b4", name: "Plate" },
	],
	edges: [
		{ source: "S", target: "a1" }, { source: "S", target: "a2" }, { source: "S", target: "a3" },
		{ source: "S", target: "a4" }, { source: "S", target: "a5" },
		{ source: "a1", target: "b1" }, { source: "a3", target: "b2" }, { source: "a4", target: "b3" },
		{ source: "a5", target: "b4" },
	],
};

const graph = new Graph();
graph.loadJSON(data);

new RadialLayout(graph, { centerNode: "S", ringSpacing: 130, center: { x: 0, y: 0 } }).run();

const svg = renderGraphSVG(graph, {
	// Highlight the subject: larger and a different colour.
	nodeRadius: (n) => (n.id === "S" ? 26 : 16),
	nodeFill: (n) => (n.id === "S" ? "#f78166" : "#3fb950"),
});
process.stdout.write(svg + "\n");
