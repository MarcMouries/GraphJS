import AbstractGraphLayout from "./AbstractGraphLayout";

export default class TreeLayout extends AbstractGraphLayout {

  constructor(tree) {
    super(tree);
    /**
		 * lastNodeAtLevel: stores the last node visited at each level to set as left most nodes' neighbor
		 */
		this.lastNodeAtLevel = [];

    const firstWalk = (node, level) => {
      console.log("firstWalk", node, level);

      // private function implementation
      node.prelim = 0;
      node.modifier = 0;
      node.width = node.width || this.nodeWidth;
      node.height = node.height || this.nodeHeight;

      setNodeNeighbor(node, level);

      //
      let leftSibling = node.getLeftSibling();
			console.log("leftSibling  = " + leftSibling);

    };

    const setNodeNeighbor = (node) => {
      console.log("setNodeNeighbor", node.toString());
      let isLeftMost = node.isLeftMost();
      let isRightMost = node.isRightMost();
      console.log("setNodeNeighbor NODE= " + node.id + " , level= " + node.level + ", isLeftMost(" + isLeftMost + ")" + ", isRightMost(" + isRightMost + ")");
      if (isRightMost) {
        //console.log("\\_setNodeNeighbor lastNodeAtLevel      = " + node.id);
        //console.log("\\_setNodeNeighbor this.lastNodeAtLevel[node.level]       = " + node);
        this.lastNodeAtLevel[node.level] = node;
      }
      else if (isLeftMost) {
        node.neighbor = this.lastNodeAtLevel[node.level];
        if (node.neighbor) {
          //console.log("\\_setNodeNeighbor of " + node.id + " to " + node.neighbor.id);
        }
      }
      else {
        // has no subtree to move 
        //console.log("\\_setNodeNeighbor      = " + node + "  DO nothing");
      }
    }

    // PUBLIC FUNCTIONS
    this.calculate_Positions = (root, center) => {

      console.log("calculate_Positions", this, center);
      //var root = this.graph.getRoot();
      console.log("root", root);
      let starting_node = root;

      // call the private function
      firstWalk(starting_node, 0);

      // public function implementation
    };
  }
}