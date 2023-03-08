import Node from "./Node";

class TreeNode extends Node {
  constructor(nodeID, nodeData, parentID) {
    super(nodeID, nodeData);
    this.parentID = parentID;
    this.children = [];
  }

  addChild(nodeID, nodeData) {
    const childNode = new TreeNode(nodeID, nodeData, this.nodeID);
    this.children.push(childNode);
    return childNode;
  }
}

export {TreeNode };