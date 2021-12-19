
// =============================================================
//                          Graph
// =============================================================
export class Graph {
    constructor() {
        this.graph = {};
        this.nodeList = [];
        this.linkList = [];
        this.adjacency = {};
        this.changed = false;
        this.root;    
    }
}