import Node from "./Node";



class TreeNode extends Node {
  constructor(nodeID, nodeData, parentID) {
    super(nodeID, nodeData);
    this.parentID = parentID;
    this.children = [];
    this.parent;
		//this.neighbor;

    console.log("TreeNode: constructor: ", nodeID, nodeData, parentID);

  }

  addChild(node) {
   // const childNode = new TreeNode(nodeID, nodeData, this.nodeID);
    this.children.push(node);
    return node;
  }
}

export {TreeNode };