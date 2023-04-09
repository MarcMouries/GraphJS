import { TreeLayout } from "./layout";
import { Tree } from "./graph/Tree";
import { SVGUtil } from "./SVGUtil.js";

export class OrgChart {
  constructor(container) {
    this.container = container;

    this.linksContainer = document.createElement("div");
    this.linksContainer.id = "links";
    this.container.appendChild(this.linksContainer);
    this.svg = SVGUtil.createSVGelement(1000, 1000);
    this.linksContainer.appendChild(this.svg);

    this.nodesContainer = document.createElement("div");
    this.nodesContainer.id = "nodes";
    this.container.appendChild(this.nodesContainer);


    this.tree = new Tree();
  }

  setData(data) {
    console.log("HERE in setData", data);
    this.tree.loadFromJSON(JSON.stringify(data));
    console.log("tree", this.tree);

    this.treeLayout = new TreeLayout(this.tree, {
      nodeHeight: 50,
      nodeWidth: 200,
    });
    var root = this.tree.getRoot();
    this.treeLayout.calculate_Positions(root, { x: 100, y: 100 });
    console.log("treeLayout", this.treeLayout);

    var treeDimension = this.treeLayout.getTreeDimension();
    console.log(" -  treeDimension : ", treeDimension);

    const cssString = `
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

    }

.position-card .name {
  font-size: 12px;
  font-weight: 300;
}
.position-card .job-title {
  font-size: 14px;
  font-weight: 500;
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
  cursor: pointer;
  font-size: 0.6em;
  position: absolute;
  right: 50%;
  bottom: 0;
  padding: 4px;
  vertical-align: middle;
  text-align: center;
  transform: translate(50%, 100%);
  box-shadow: 0 1px 4px 2px hsla(0, 0%, 80%, 0.3);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
}
   `;

    const styleElement = document.createElement("style");
    styleElement.textContent = cssString;
    document.head.appendChild(styleElement);

    this.#drawNode(root);
  }
  #drawNode = function (node) {
    console.log(`drawNode node id: "${node.id}", level: ${node.level}, path: ${node.path}`);
    console.log(node);
    //console.log(this.#nodeTemplateHtml(node));

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
        this.#drawNode(child);
      });
    }
  }.bind(this);

  #nodeTemplateHtml = function (node) {
    return `
      <div class="position-card" style="left: ${node.x}px; top: ${node.y}px">
        <div class="position-info">
          <div class="job-title">${node.data.job_title}</div>
          <div class="name">${node.data.name}</div>
        </div>
      <!-- position data -->
      </div>
    `;
  };

  //         <div style="margin-top:-0px;background-color:#01778e;height:10px;width:100%;border-radius:1px"></div>

  //  <div class="position-data">
  //    <div>A</div><div>B</div>
  //  </div>

  #buildNode = function (node, templateHtml) {
    console.log("BuildNode templateHtml", templateHtml);

    const templateFilled = this.#nodeTemplateHtml(node);
    const parser = new DOMParser();
    const templateElement = parser.parseFromString(templateFilled, "text/html").querySelector(".position-card");
    const nodeElement = templateElement.cloneNode(true);

    nodeElement.dataset.nodeId = node.id.toString();

    nodeElement.style.left = `${node.x}px`;
    nodeElement.style.top = `${node.y}px`;
    nodeElement.style.width = `${node.width}px`;

    const childCount = node.children.length;
    if (childCount > 0) {
      var childCountElement = document.createElement("span");
      childCountElement.classList.add("child-count");
      childCountElement.innerHTML = "" + childCount;
      nodeElement.appendChild(childCountElement);

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

        //console.log(this.tree);

        //context.clearRect(0, 0, canvas.width, canvas.height);
        // redraw the tree
        this.#drawNode(this.tree.getRoot());
      });
    }
    return nodeElement;
  };

  #createLine = function (node) {
    console.log("createLine TODO check if stackedLeaves: ", node);

    if (node.parent && node.parent.isCollapsed) {
      return;
    }
    if (node.isLeaf()) {
      const leftMiddlePoint = { x: node.x, y: node.y + node.height / 2 };
      const indentationPoint = { x: leftMiddlePoint.x - this.treeLayout.stackedIndentation / 2, y: leftMiddlePoint.y };

      // horizontal line from node to vertical line
      //           |
      //      ────────────
      // =>   --   --   --
      SVGUtil.createLine(this.svg, leftMiddlePoint.x, leftMiddlePoint.y, indentationPoint.x, indentationPoint.y);
      // vertical line from indentation to parent
      //           |
      //      ────────────
      // =>   |--  |--  |--
      SVGUtil.createLine(this.svg, indentationPoint.x, indentationPoint.y, indentationPoint.x, indentationPoint.y - this.treeLayout.levelSeparation);
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
          console.log("=> left Child : " + leftMostChild);
          console.log("=> right Child : " + rightMostChild);
          SVGUtil.createLine(this.svg, leftMostChild.x + node.width / 2, leftMostChild.y - node.height / 2, rightMostChild.x + node.width / 2, rightMostChild.y - node.height / 2);

          // Find the bottom middle point of the current node
          //   =>       |
          //      ────────────
          //      |     |      |
        const nodeBottomMiddlePoint = {
          x: node.x + node.width / 2,
          y: node.y + (node.height / 2)
        };
        // Straight line from parent to child just below it
        const intersectionPoint = {
          x: nodeBottomMiddlePoint.x,
          y: nodeBottomMiddlePoint.y  + this.treeLayout.levelSeparation - node.height
        };
         SVGUtil.createLine(this.svg,
           nodeBottomMiddlePoint.x, nodeBottomMiddlePoint.y,
           intersectionPoint.x, intersectionPoint.y);
        }
      }
      // draw vertical line connecting the child to the line across top of children
      //           |
      //      ────────────
      // =>  |     |      |
      if (node.parent !== undefined) {
        // Find the top middle point of the current node
        const nodeTopMiddlePoint = {
          x: node.x + node.width / 2,
          y: node.y,
        };
        // Calculate the point where the vertical line intersects with the horizontal line
        const intersectionPoint = {
          x: nodeTopMiddlePoint.x,
          y: nodeTopMiddlePoint.y - node.height / 2,
        };
        SVGUtil.createLine(this.svg,
           nodeTopMiddlePoint.x, nodeTopMiddlePoint.y,
           intersectionPoint.x, intersectionPoint.y);
      }


    }
  };
}
