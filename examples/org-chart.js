// Tree / org-chart layout example (Walker's algorithm via TreeLayout).
//   bun run examples/org-chart.js > examples/img/org-chart.svg
import { Tree } from "../src/graph/Tree.js";
import TreeLayout from "../src/layout/TreeLayout.js";
import { renderGraphSVG } from "./render.js";

// TreeLayout logs its walk verbosely; keep stdout to pure SVG.
console.log = () => {};

// A Tree is built from flat data where the root has parentId: null.
const org = [
	{ id: "ceo", parentId: null, data: { name: "CEO" } },
	{ id: "cto", parentId: "ceo", data: { name: "CTO" } },
	{ id: "cfo", parentId: "ceo", data: { name: "CFO" } },
	{ id: "coo", parentId: "ceo", data: { name: "COO" } },
	{ id: "eng1", parentId: "cto", data: { name: "Eng Lead" } },
	{ id: "eng2", parentId: "cto", data: { name: "QA Lead" } },
	{ id: "fin1", parentId: "cfo", data: { name: "Controller" } },
	{ id: "ops1", parentId: "coo", data: { name: "Ops Lead" } },
	{ id: "ops2", parentId: "coo", data: { name: "Support" } },
];

const tree = new Tree(org);

const layout = new TreeLayout(tree, {
	levelSeparation: 90,
	siblingSpacing: 60,
	subtreeSeparation: 60,
	nodeWidth: 60,
	stackedLeaves: false,
	maximumDepth: 5,
});
layout.calculate_Positions(tree.getRoot(), { x: 0, y: 0 });

const svg = renderGraphSVG(tree, { radius: 20, nodeFill: "#8957e5" });
process.stdout.write(svg + "\n");
