import { TreeLayout } from "./layout";
import { Tree } from "./graph/Tree";

export class OrgChart {
  constructor(container) {
    this.container = container;

    this.nodesContainer = document.createElement("div");
    this.nodesContainer.id = "nodes";
    this.container.appendChild(this.nodesContainer);

    this.linksContainer = document.createElement("div");
    this.linksContainer.id = "links-container";
    this.container.appendChild(this.linksContainer);
    this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.linksContainer.appendChild(this.svg);

    this.tree = new Tree();

  }

  setData(data) {
    console.log("HERE in setData", data);
    this.tree.loadFromJSON(JSON.stringify(data));
    console.log("tree", this.tree);

    let treeLayout = new TreeLayout(this.tree, {
      nodeHeight: 50,
      nodeWidth: 160,
    });
    var root = this.tree.getRoot();
    treeLayout.calculate_Positions(root, { x: 100, y: 100 });
    console.log("treeLayout", treeLayout);

    var treeDimension = treeLayout.getTreeDimension();
    console.log(" -  treeDimension : ", treeDimension);

    const cssString = `
    .position-card {
      background: #ffffff;
      border-radius: 4px;
      box-shadow: 0 1px 4px 2px hsla(0, 0%, 80%, 0.3);
      position: absolute;
      display: flex;
      flex-direction: column;
      font-family: sans-serif;
      align-items: flex-start;
    }

.position-card .name {
  font-size: 16px;
  font-weight: 600;
  padding: 4px 8px;
}
.position-card .job-title {
  font-size: 12px;
  font-weight: 400;
  padding: 4px 8px;
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
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
}
   `;

    const styleElement = document.createElement("style");
    styleElement.textContent = cssString;
    document.head.appendChild(styleElement);

    this.#drawNode(root);
  }
  #drawNode = function (node) {
    console.log(`node id: "${node.id}", level: ${node.level}, path: ${node.path}`);
    //console.log(node);
    //console.log(this.#nodeTemplateHtml(node));

    const nodeElement = this.#buildNode(node);
    this.nodesContainer.appendChild(nodeElement);

    // Draw this node's children.
    if (!node.isCollapsed) {
      node.children.forEach((child) => {
        this.#drawNode(child);
      });
    }
  }.bind(this);


  #nodeTemplateHtml = function (node) {
    return `
      <div class="position-card" style="left: ${node.x}px; top: ${node.y}px; width: 150px;">
        <div class="position-info">
          <div class="name">${node.data.name}</div>
          <div class="job-title">${node.data.job_title}</div>
        </div>
      <!-- position data -->
      </div>
    `;
  };
//  <div class="position-data">
//    <div>A</div><div>B</div>
//  </div>

  #buildNode = function (node, templateHtml) {
    console.log("templateHtml", templateHtml);

    const templateFilled = this.#nodeTemplateHtml(node);
    const parser = new DOMParser();
    const templateElement = parser.parseFromString(templateFilled, "text/html").querySelector(".position-card");
    const nodeElement = templateElement.cloneNode(true);

    nodeElement.dataset.nodeId = node.id.toString();

    nodeElement.style.left = `${node.x}px`;
    nodeElement.style.top = `${node.y}px`;
    nodeElement.style.width = `160px`;
//    nodeElement.style.position = "absolute";

    const childCount = node.children.length;
    if (childCount > 0) {
      var childCountElement = document.createElement("span");
      childCountElement.classList.add("child-count");
      childCountElement.innerHTML = "" + childCount;
      nodeElement.appendChild(childCountElement);

      childCountElement.addEventListener("click", (e) => {
        var target = e.target;
        var nodeElement = target.parentElement;
        let nodeId = nodeElement.dataset.nodeId;
        console.log("nodeId=" + nodeId);
        // toggleNodeCollapsedProperty(nodeId);
        console.log("this.tree=", this.tree);
        let node = this.tree.getNode(nodeId);
        console.log("node=" , node);
        if (!node.isCollapsed) {
          //nodeElement.innerHTML = '';  // remove all children
          const rootElement = this.nodesContainer;
          while (rootElement.firstChild) {
            rootElement.removeChild(rootElement.firstChild);
          }
        }
        node.isCollapsed = !node.isCollapsed;
        //context.clearRect(0, 0, canvas.width, canvas.height);
        this.#drawNode(this.tree.getRoot());
      });
    }
    return nodeElement;
  }
}
