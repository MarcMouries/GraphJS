/* eslint-disable no-unused-vars */

//import Graph from "../graph/Graph";
//import Node from "../graph/Node";


export default class AbstractGraphLayout {

    // need to get nodeWidth & nodeHeight
    constructor(graph, options) {
		this.graph = graph;

    }

    calculate_Positions(graph, starting_vertex, center) {
        console.error("not implemented in AbstractGraphLayout. Make sure to use a concrete layout class.")
    }
}