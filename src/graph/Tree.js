import Graph from "./Graph";
import { TreeNode } from "./TreeNode";
//import Link from "./Link";

export class Tree extends Graph {

  constructor(data) {
    super();
    this.root = null;
    this.buildTree(data);
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

  traverseBottomUp(callback) {
    const traverse = (node) => {
      node.children.forEach((child) => traverse(child));
      callback(node);
    };
    traverse(this.root);
  }

  getNode(nodeId) {
    return this.nodeList.get(nodeId);
  }

  /**
   * Returns { status: 'success'} or { status: 'error', message: "error message"}
   * @param {*} json
   */
  buildTree(data) {

    const rootData = data.find((node) => node.parentId === null);
    if (!rootData) {
      throw new Error("No root node found in the data");
    }
    this.root = new TreeNode(rootData.id, rootData.data);
    this.nodeList.set(rootData.id, this.root);

    const buildSubTree = (parentNode) => {
      const childrenData = data.filter((node) => node.parentId === parentNode.id);
      childrenData.forEach((childData) => {
        const childNode = new TreeNode(childData.id, childData.data, parentNode);
        parentNode.addChild(childNode);
        this.nodeList.set(childData.id, childNode);

        childNode.level = parentNode.level + 1;
        const parentPath = parentNode.path ? parentNode.path + "-" : "";
        childNode.path = parentPath + (parentNode.children.length);
        buildSubTree(childNode);
      });
    };

    buildSubTree(this.root);
  }

}
