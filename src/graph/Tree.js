import Graph from "./Graph";
import { TreeNode } from "./TreeNode";
//import Link from "./Link";

export class Tree extends Graph {
  constructor() {
    super();
    this.root = null;
    this.nodeMap = new Map();
  }

  setRoot(nodeID) {
    this.root = nodeID;
  }
  getRoot() {
    return this.root;
  }

  isRoot(node) {
    return node === this.root;
  }

  traverseDF(callback) {
    function traverse(node) {
      callback(node);
      if (node.children) {
        node.children.forEach(traverse);
      }
    }
    traverse(this.root);
  }

  traverseBF(callback) {
    const queue = [this.root];
    while (queue.length) {
      const node = queue.shift();
      callback(node);
      node.children.forEach((child) => queue.push(child));
    }
  }

  /**
   * Returns { status: 'success'} or { status: 'error', message: "error message"}
   * @param {*} json
   */
  loadFromJSON(json) {
    const data = JSON.parse(json);

    // create nodes
    data.nodes.forEach((nodeData) => {
      const { id, data } = nodeData;
      const node = new TreeNode(id, data, null);
      this.nodeMap.set(id, node);
      // add node to nodesByLevel array
      //console.log("")
      //addNodeToLevel(id, parentId, nodesByLevel, node);
    });

    // Add child nodes to parent nodes
    data.nodes.forEach((nodeData) => {
      const { id, parentId } = nodeData;
      const node = this.nodeMap.get(id);
      if (parentId) {
        const parent = this.nodeMap.get(parentId);
        if (!parent) {
          return { status: "error", message: "Parent node not found for parentId: " + parentId };
        }
        parent.addChild(node);
        node.level = node.parent.level + 1;
      } else {
        this.root = node;
      }
    });
    return { status: "success" };
  }
}
