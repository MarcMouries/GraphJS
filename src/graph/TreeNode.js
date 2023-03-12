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

  getChildAt(i) {
    return this.children[i];
  }
  getFirstChild() {
    return this.getChildAt(0);
  }
  getChildren() {
    return this.children;
  }
  getChildrenCount() {
    return this.children.length;
  }
  /**
   *  isLeftMost: is this node == to the first child of its parent?
   */
  isLeftMost() {
    if (!this.parent || this.parent === null) {
      return true;
    } else {
      return this.parent.getFirstChild() === this;
    }
  }

  /**
   *  isRightMost: is this node == to the last child of its parent?
   */
  isRightMost() {
    if (!this.parent || this.parent === null) {
      return true;
    } else {
      return this.parent.getLastChild() === this;
    }
  }

  getLastChild() {
    return this.getChildAt(this.getChildrenCount() - 1);
  }

  getLeftSibling() {
    if (this.parent === null || this.isLeftMost()) {
      return null;
    } else {
      var index = this.parent.children.indexOf(this);
      return this.parent.children[index - 1];
    }
  }

  isLeaf() {
    return this.children && this.children.length == 0;
  }
  hasChild() {
    return this.children && this.children.length > 0;
  }

  isAncestorCollapsed() {
    if (this.parent == null) {
      return false;
    }
    return this.parent.isCollapsed ? true : this.parent.id === -1 ? false : this.parent.isAncestorCollapsed();
  }

  getRightSibling() {
    if (this.parent === null || this.isRightMost()) {
      return null;
    } else {
      var index = this.parent.children.indexOf(this);
      return this.parent.children[index + 1];
    }
  }

  getLeftMostChild() {
    if (this.getChildrenCount() == 0) return null;

    return this.children[0];
  }

  getRightMostChild() {
    if (this.getChildrenCount() == 0) return null;

    return this.children[this.getChildrenCount() - 1];
  }

  hasLeftSibling() {
    return !this.isLeftMost();
  }
}

export { TreeNode };
