// =============================================================
//                          Graph
// =============================================================
import Link from "./Link";
import Node from "./Node";

export default class Graph {
  constructor() {
    this.graph = {};
    this.nodeList = new Map();
    this.linkList = [];
    this.adjacency = {};
    this.changed = false;
    this.root;
  }

  /**
   * Add a node
   * @param {*} node
   * @returns
   */
  addNode(node) {
    if (!(node.id in this.graph)) {
      this.nodeList.set(node.id, node); //	this.nodeList.push(node);
      this.graph[node.id] = node;
    } else {
      console.error("Node already exists: " + node.id);
    }
    return node;
  }
  getNode(nodeId) {
    //var node = this.graph[nodeId];
    return this.nodeList.get(nodeId);
  }
  removeNode(nodeId) {
    this.nodeList.delete(nodeId);
  }

  /**
   *  Add an object. Create a node from the specified object
   * @param {*} object
   * @returns
   */
  addObject(object) {
    var node = new Node(object.id, object);

    if (object.parentId) {
      node.parent = this.getNode(object.parentId);
      if (!node.parent) {
        console.error("Parent node not found for parentId: " + object.parentId);
      } else {
        node.level = node.parent.level + 1;
        node.parent.children.push(node);
      }
    } else {
      this.root = node;
    }
    this.addNode(node);
    this.changed = true;
    return node;
  }

  getLinkCount() {
    return this.linkList.length;
  }
  getNodeCount() {
    return this.nodeList.size;
  }
  getNodes() {
    return Array.from(this.nodeList.values());
  }

  addLink(sourceNode_id, targetNode_id, attributes = {}) {
    var sourceNode = this.getNode(sourceNode_id);
    if (sourceNode == undefined) {
      throw new TypeError("Trying to add a link to the non-existent node with id: " + sourceNode_id);
    }
    var targetNode = this.getNode(targetNode_id);
    if (targetNode == undefined) {
      throw new TypeError("Trying to add a link to the non-existent node with id: " + targetNode_id);
    }

    var link = new Link(sourceNode, targetNode, attributes);
    var exists = false;

    this.linkList.forEach(function (item) {
      if (link.id === item.id) {
        exists = true;
      }
    });

    if (!exists) {
      this.linkList.push(link);
      sourceNode.addChild(targetNode);
    } else {
      console.log("LINK EXIST: " + " source: " + link.source.id + " => " + link.target.id);
    }

    if (!(link.source.id in this.adjacency)) {
      this.adjacency[link.source.id] = {};
    }
    if (!(link.target.id in this.adjacency[link.source.id])) {
      this.adjacency[link.source.id][link.target.id] = [];
    }
    this.adjacency[link.source.id][link.target.id].push(link);
  }

  /**
   *  JSON input can be either a JSON String or a JSON object
   * @param {*} json_input
   */
  loadJSON(json_input) {
    var json_object = typeof json_input === "string" ? JSON.parse(json_input) : json_input;

    var nodes = json_object["nodes"] || [];
    for (let index = 0; index < nodes.length; index++) {
      this.addObject(nodes[index]);
    }

    // Accept both `links` and `edges` as the edge collection.
    var links = json_object["links"] || json_object["edges"] || [];
    for (let index = 0; index < links.length; index++) {
      var link = links[index];
      // Pass the whole edge object so its metadata (label, type, color, ...)
      // is stored on the Link.
      this.addLink(link.source, link.target, link);
    }
    return this;
  }

  /**
   *  All nodes and links within `depth` hops of `nodeId` (undirected),
   *  including the start node.
   * @returns {{ nodes: Node[], links: Link[] }}
   */
  getNeighbors(nodeId, depth = 1) {
    const start = this.getNode(nodeId);
    if (!start) return { nodes: [], links: [] };

    // Build an undirected adjacency map from the link list.
    const neighbours = new Map();
    const link = (a, b) => {
      if (!neighbours.has(a)) neighbours.set(a, new Set());
      neighbours.get(a).add(b);
    };
    for (const l of this.linkList) {
      link(l.source.id, l.target.id);
      link(l.target.id, l.source.id);
    }

    const visited = new Set([nodeId]);
    let frontier = [nodeId];
    for (let d = 0; d < depth; d++) {
      const next = [];
      for (const id of frontier) {
        for (const nid of neighbours.get(id) || []) {
          if (!visited.has(nid)) {
            visited.add(nid);
            next.push(nid);
          }
        }
      }
      frontier = next;
    }

    const nodes = Array.from(visited).map((id) => this.getNode(id));
    const links = this.linkList.filter((l) => visited.has(l.source.id) && visited.has(l.target.id));
    return { nodes, links };
  }

  /**
   *  Degree centrality of a node: incident edges / (nodeCount - 1).
   */
  getCentrality(nodeId) {
    const total = this.getNodeCount();
    if (total <= 1) return 0;
    let degree = 0;
    for (const l of this.linkList) {
      if (l.source.id === nodeId || l.target.id === nodeId) degree++;
    }
    return degree / (total - 1);
  }

  toString() {
    //return this.nodeList.map(printNode);
    return Array.from(this.nodeList.values()).map(printNode);
  }
}

function printNode(node) {
  var adjacentsRepresentation = "";
  if (node.getAdjacents() == 0) {
    adjacentsRepresentation = "no children";
  } else {
    adjacentsRepresentation = node
      .getAdjacents()
      .map(function (item) {
        return item.id;
      })
      .join(", ");
  }
  return node.id + " => " + adjacentsRepresentation;
}
