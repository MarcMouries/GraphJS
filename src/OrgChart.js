import { TreeLayout } from "./layout";
import { Tree } from "./graph/Tree";
import { SVGUtil } from "./SVGUtil";
import { DOMUtil } from "./DOMUtil";
import { Animation } from "./Animation";
import { SVG } from "./SVG";

export class OrgChart {

  #nodeContentFunction = null;
  #nodeStyleFunction = null;
  delayPerLevel = 50;


  #defaultNodeTemplateHtml = function (node) {
    return `
      <div class="position-card">
        <div class="position-info">
          <div class="job-title">${node.data.job_title}</div>
          <div class="name">${node.data.name}</div>
        </div>
      <!-- position data -->
      </div>
    `;
  };



  constructor(container) {
    this.container = container;
    //this.svg = SVGUtil.addSVGElement(this.container);
    this.svg = new SVG(this.container);



    // this.linksContainer = document.createElement("div");
    // this.linksContainer.className = "links";
    // this.container.appendChild(this.linksContainer);

    // this.linksContainer.appendChild(this.svg);

    // this.nodesContainer = document.createElement("div");
    // this.nodesContainer.id = "nodes";
    // this.container.appendChild(this.nodesContainer);

    this.cssString = `

    .animate-opacity {
      transition: opacity 1s ease-in-out;
    }

    .position-card {
      align-items: flex-start;
      background: #ffffff;
      border-top: 10px solid #01778e;
      box-shadow: 0 1px 4px 2px hsla(0, 0%, 80%, 0.3);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      font-family: sans-serif;
      position: absolute;
      padding: 4px 8px;
      transition: top 0.3s ease-in-out, left 0.3s ease-in-out;
    }

    .position-card .name {
      font-size: 12px;
      font-weight: 300;
    }
    .position-card .job-title {
      font-size: 14px;
      font-weight: 500;
    }
    .links {
      position: relative;
    }
    .position-info {
      align-items: flex-start;
      background-color: white;
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .position-data {
      background-color: white;
      display: flex;
      flex-direction: row;
      align-content: center;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-around;
      width: 100%;
    }
    .child-count {
      height: 10px;
      width: 10px;
      padding: 4px;
      background-color: white;
      cursor: pointer;
      font-size: 0.5em;
      position: fixed;
      vertical-align: middle;
      text-align: center;
      __transform: translate(50%, 100%);
      box-shadow: 0 1px 4px 2px hsla(0, 0%, 80%, 0.3);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
    }
    
      `;
  }

  setNodeClass(nodeStyleFunction) {
    if (typeof nodeStyleFunction === "function") {
      this.#nodeStyleFunction = nodeStyleFunction;
    } else {
      throw new Error("nodeStyleFunction should be a function");
    }
  }
  setNodeHtml(nodeContentFunction) {
    if (typeof nodeContentFunction === 'function') {
      this.#nodeContentFunction = nodeContentFunction;
    } else {
      throw new Error('nodeContentFunction should be a function');
    }
  }

  setData(data) {
    console.log("HERE in setData", data);
    this.tree = new Tree(data);
    console.log("tree", this.tree);

    const styleElement = document.createElement("style");
    styleElement.textContent = this.cssString;
    document.head.appendChild(styleElement);
  }


  #getNodeClassName = function (node) {
    return this.#nodeStyleFunction ? this.#nodeStyleFunction(node) : "";
  };
  #getNodeHtml = function (node) {
    const templateFunction = this.#nodeContentFunction || this.#defaultNodeTemplateHtml;
    return templateFunction(node);
  };


  animateNode(node, parentDelay = 0) {
    const group = this.svg.svg.querySelector(`[data-node-id="${node.id}"]`);
    const delay = parentDelay + node.level * this.delayPerLevel;

    if (node.parent) {
      const origPoint = { x: node.parent.x, y: node.parent.y };
      const destPoint = { x: node.x, y: node.y };
      group.setAttribute("transform", `translate(${origPoint.x}, ${origPoint.y})`);
      setTimeout(() => {
        Animation.animate(group, origPoint, destPoint, 1000);
      }, delay);
    } else {
      group.setAttribute("transform", `translate(${node.x}, ${node.y})`);
    }

    setTimeout(() => {
      group.style.opacity = 1;
    }, delay);
  }


  renderNodes() {
    const root = this.tree.getRoot();

    // Calculate the dimensions
    const templateFilled = this.#getNodeHtml(root);
    const tempElement = document.createElement("div");
    tempElement.innerHTML = templateFilled;
    const rootElement = tempElement.firstElementChild;
    const dimensions = DOMUtil.getDimensions(rootElement);


    console.log("rootElement: ", rootElement);
    console.log("dimensions: ", dimensions);

    this.treeLayout = new TreeLayout(this.tree, {
      nodeWidth: dimensions.width,
      nodeHeight: dimensions.height,
    });
    this.treeLayout.calculate_Positions(root, { x: 100, y: 100 });
    console.log("treeLayout", this.treeLayout);

    var treeDimension = this.treeLayout.getTreeDimension();
    console.log(" -  treeDimension : ", treeDimension);

    // node orgering for proper z-index
    const nodeGroups = [];

    // Create a new group element for the lines
    const lineGroup = SVGUtil.createGroup(this.svg.svgGroup);

    this.tree.traverseBF((node) => {
      node.width = dimensions.width;
      node.height = dimensions.height;
      node.totalHeight = dimensions.totalHeight;
      node.totalWidth = dimensions.totalWidth;

      nodeGroups.push({ level: node.level, group: this.renderNode(node, false) });

      // Add lines to the line group after the node is added to the SVG element
      this.createLine(node, lineGroup);
    });

    nodeGroups
      .sort((a, b) => b.level - a.level)
      .forEach((nodeGroup) => this.svg.svgGroup.appendChild(nodeGroup.group));

    // Add the line group before the node groups
    this.svg.svgGroup.insertBefore(lineGroup, nodeGroups[0].group);

    this.tree.traverseBF((node) => {
      const delay = node.level * 6 * this.delayPerLevel;
      console.log(`delay for ${node.id} = ${delay}`);

      this.animateNode(node, delay);
    });
  }




  renderNode(node, animate = true) {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    group.setAttribute("data-node-id", node.id);
    const templateFilled = this.#getNodeHtml(node);

    const tempElement = document.createElement("div");
    tempElement.innerHTML = templateFilled;
    const rootElement = tempElement.firstElementChild;

    const className = this.#getNodeClassName(node);
    if (className) {
      rootElement.classList.add(className);
    }

    const foreignObject = SVGUtil.createForeignObject(node, rootElement);
    group.appendChild(foreignObject);

    if (animate) {
      this.animateNode(node);
    } else {
      group.setAttribute("transform", `translate(${node.x}, ${node.y})`);
    }

    group.style.opacity = 0; // Set the initial opacity to 0
    group.classList.add("animate-opacity"); // Add the class for the opacity transition

    return group;
  }



  /*
    #drawNode(node) {
      console.log(`drawNode node id: "${node.id}", level: ${node.level}, path: ${node.path}`);
      console.log(node);
  
      const existingChild = this.nodesContainer.querySelector(`[data-node-id='${node.id}']`);
      console.log("existingChild: ", existingChild);
  
      this.#createLine(node);
  
      if (!existingChild) {
        const nodeElement = this.#buildNode(node);
        this.nodesContainer.appendChild(nodeElement);
      }
  
      // Draw this node's children.
      if (!node.isCollapsed) {
        node.children.forEach((child) => {
          this.renderNode(child);
        });
      }
    }
  
  
    #buildNode = function (node, templateHtml) {
      console.log("BuildNode templateHtml", templateHtml);
  
      const templateFilled = this.#getNodeHtml(node);
      const nodeStyle = this.getNodeClassName(node);
      console.log("nodeStyle ", nodeStyle)
      // so that we get the inner div directly without the outer div,
      const tempWrapper = document.createElement("div");
      tempWrapper.innerHTML = templateFilled;
      const nodeElement = tempWrapper.firstElementChild;
      nodeElement.dataset.nodeId = node.id.toString();
  
      nodeElement.style.left = `${node.x}px`;
      nodeElement.style.top = `${node.y}px`;
      nodeElement.style.width = `${node.width}px`;
  
      const childCount = node.getChildCount();
      if (childCount > 0) {
  
        let childCountElement = document.createElement("div");
        childCountElement.classList.add("child-count");
  
  
        // if stacked => left = 
        // else different => left = 
        console.log("childCount node         : '" + node);
        console.log("childCount stackedLeaves: '" + this.treeLayout.stackedLeaves);
        console.log("childCount level        : '" + node.level);
  
        if (node.level == 1) {
          childCountElement.style.left = `${node.x + node.width / 2}px`;
          childCountElement.style.top = `${node.y + node.height}px`;
        }
        else if (this.treeLayout.stackedLeaves) {
          if (node.level == 2) {
            //let index = node.getIndex();
            childCountElement.style.left = `${node.x + (this.treeLayout.stackedIndentation / 2)}px`; // - 5 = half of the element width
            childCountElement.style.top = `${node.y + node.height}px`;
          }
        }
  
  
        childCountElement.innerHTML = "" + childCount;
        const childCountDim = DOMUtil.getDimensions(childCountElement);
        console.log("childCountDim dimensions: '" + childCountDim.width + "' x '" + childCountDim.height);
        const { width, height } = DOMUtil.getDimensions(childCountElement);
        console.log(`childCountDim dimensions: ${width} x ${height}`);
  
  
        childCountElement.addEventListener("click", (e) => {
          var nodeElement = e.target.parentElement;
          let nodeId = nodeElement.dataset.nodeId;
          console.log("nodeId=" + nodeId);
          let clickedNode = this.tree.getNode(nodeId);
          console.log("clickedNode=", clickedNode);
          clickedNode.isCollapsed = !clickedNode.isCollapsed;
  
          // get all the nodes currently displayed
          const nodeElementList = this.nodesContainer.querySelectorAll("[data-node-id]");
          const nodesList = Array.from(nodeElementList).map((node) => node.getAttribute("data-node-id"));
          console.log("nodes currently displayed=", nodesList);
  
          if (clickedNode.isCollapsed) {
            //nodeElement.innerHTML = '';  // remove all children
            const rootElement = this.nodesContainer;
            while (rootElement.firstChild) {
              rootElement.removeChild(rootElement.firstChild);
            }
  
            SVGUtil.deleteLines(this.svg);
          }
  
          // redraw the tree
          this.#drawNode(this.tree.getRoot());
        });
        nodeElement.appendChild(childCountElement);
  
      }
      return nodeElement;
    };
   */
  createLine = function (node) {
    console.log("createLine TODO check if stackedLeaves: " + node);

    if (node.parent && node.parent.isCollapsed) {
      return;
    }
    if (node.isLeaf()) {
      const leftMiddlePoint = node.getLeftMiddlePoint();
      const indentationPoint = { x: leftMiddlePoint.x - this.treeLayout.stackedIndentation / 2, y: leftMiddlePoint.y };

      // horizontal line from node to vertical line
      //           |
      //      ────────────
      // =>   --   --   --
      SVGUtil.createLine(this.svg.svgGroup, leftMiddlePoint.x, leftMiddlePoint.y, indentationPoint.x, indentationPoint.y);

      // vertical line from indentation to parent
      //           |
      //      ────────────
      // =>   |--  |--  |--
      SVGUtil.createLine(this.svg.svgGroup, indentationPoint.x, indentationPoint.y, indentationPoint.x, indentationPoint.y - this.treeLayout.levelSeparation);

    } else {
      // draw a horizontal line connecting the first or left most child and the last or right most child
      //           |
      // =>   ────────────
      //     |     |      |
      if (node.level == 1) {
        if (!node.isCollapsed && node.children.length >= 1) {
          // horizontal line from leftMostChild to the rightMostChild
          let leftMostChild = node.getLeftMostChild();
          let rightMostChild = node.getRightMostChild();

          const nodeStartY = node.y + node.height;
          const nextNodeY = leftMostChild.y;

          const distanceBetweenNodes = nextNodeY - nodeStartY;
          const midpoint = nodeStartY + distanceBetweenNodes / 2;
          let nodeMiddle = node.width / 2;
          SVGUtil.createLine(this.svg.svgGroup, leftMostChild.x + nodeMiddle, midpoint, rightMostChild.x + nodeMiddle, midpoint);

          const leftMostChildSouth = leftMostChild.getTopMiddlePoint();
          SVGUtil.createLine(this.svg.svgGroup,
            leftMostChildSouth.x, midpoint,
            leftMostChildSouth.x, leftMostChildSouth.y);
          const rightMostChildSouth = rightMostChild.getTopMiddlePoint();
          SVGUtil.createLine(this.svg.svgGroup,
            rightMostChildSouth.x, midpoint,
            rightMostChildSouth.x, leftMostChildSouth.y);

          // Find the bottom middle point of the current node
          //   =>       |
          //      ────────────
          //      |     |      |
          const nodeBottomMiddle = node.getBottomMiddlePoint();
          SVGUtil.createLine(this.svg.svgGroup, nodeBottomMiddle.x, nodeBottomMiddle.y, nodeBottomMiddle.x, midpoint);

          // draw vertical line connecting the child to the line across top of children
          //           |
          //      ────────────
          // =>  |     |      |
          if (node.parent !== undefined) {
            // Find the top middle point of the current node
            const nodeTopMiddle = { x: node.x + node.width / 2, y: node.y };

            // Straight line from parent to child just below it
            let intersectionPoint = { x: nodeBottomMiddle.x, y: nodeBottomMiddle.y + this.treeLayout.levelSeparation};

            // Calculate the point where the vertical line intersects with the horizontal line
            intersectionPoint = { x: nodeTopMiddle.x, y: nodeTopMiddle.y - node.height / 2 };
            SVGUtil.createLine(this.svg.svgGroup, nodeTopMiddle.x, nodeTopMiddle.y, intersectionPoint.x, intersectionPoint.y);
          }
        }
      }
    }
  };
}
