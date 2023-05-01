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

  addLink(sourceNode_id, targetNode_id) {
    var sourceNode = this.getNode(sourceNode_id);
    if (sourceNode == undefined) {
      throw new TypeError("Trying to add a link to the non-existent node with id: " + sourceNode_id);
    }
    var targetNode = this.getNode(targetNode_id);
    if (targetNode == undefined) {
      throw new TypeError("Trying to add a link to the non-existent node with id: " + targetNode_id);
    }

    var link = new Link(sourceNode, targetNode);
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
    console.log("Graph.loadJSON: json_string: ");
    console.log(json_input);
    var json_object;
    if (typeof json_input === "string") {
      console.log("Graph.loadJSON: input is of type string: ");
      json_object = JSON.parse(json_input);
    } else if (typeof json_input === "object") {
      console.log("Graph.loadJSON: input is of type object: ");
      json_object = json_input;
    }

    var nodes = json_object["nodes"];
    for (let index = 0; index < nodes.length; index++) {
      var node = nodes[index];
      this.addObject(node);
    }

    var links = json_object["links"];
    if (links) {
      for (let index = 0; index < links.length; index++) {
        var link = links[index];
        this.addLink(link.source, link.target);
      }
    }
    console.log("Graph.loadJSON:  loaded Graph=");
    console.log(this.graph);
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
