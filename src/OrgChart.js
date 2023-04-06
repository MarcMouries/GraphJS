export class OrgChart {

    constructor(container) {
        this.container = container;

        const nodesContainer = document.createElement("div");
        nodesContainer.id = "nodes-container";
        this.container.appendChild(nodesContainer);

        this.linksContainer = document.createElement("div");
        this.linksContainer.id = "links-container";
        this.container.appendChild(this.linksContainer);
        this.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.linksContainer.appendChild(this.svg);
    }

    setData(data) {
        console.log("HERE in setData", data);
    }
}