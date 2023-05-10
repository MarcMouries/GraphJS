import { DOMUtil } from './DOMUtil';

export class SVGUtil {

  static addSVGElement_OLD(container) {
    let svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("width", "100%");
    svgElement.setAttribute("height", "100%");
    container.appendChild(svgElement);
    return svgElement;
  }
  static addSVGElement(container) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("xmlns:xhtml", "http://www.w3.org/1999/xhtml");
    svg.setAttribute("version", "1.1");
    svg.setAttribute("class", "orgchart");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", "0 0 2000 2000");
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");

    container.appendChild(svg);

    let isDragging = false;
    let previousX = 0;
    let previousY = 0;

    // Add mousedown event listener to the SVG element
    svg.addEventListener("mousedown", (event) => {
      isDragging = true;
      previousX = event.clientX;
      previousY = event.clientY;
    });

    // Add mousemove event listener to the SVG element
    svg.addEventListener("mousemove", (event) => {
      if (isDragging) {
        const dx = event.clientX - previousX;
        const dy = event.clientY - previousY;

        svg.setAttribute("transform", `translate(${dx}, ${dy})`);

        previousX = event.clientX;
        previousY = event.clientY;
      }
    });

    // Add mouseup event listener to the SVG element
    svg.addEventListener("mouseup", () => {
      isDragging = false;
    });

    return svg;
  }

  static createForeignObject(node, rootElement) {
    const foreignObject = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "foreignObject"
    );
    foreignObject.setAttribute("id", `node-${node.id}`);
//    foreignObject.setAttribute("width", node.width);
//    foreignObject.setAttribute("height", node.height);

    foreignObject.setAttribute("width", node.totalWidth);
    foreignObject.setAttribute("height", node.totalHeight);


    foreignObject.innerHTML = rootElement.outerHTML;

    return foreignObject;
  }

  static addGroup(svg, node, elementHTML) {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    const { width, height } = DOMUtil.getDimensions(elementHTML);
    group.innerHTML = `<foreignObject x="${node.x}" y="${node.y}" width="${width}" height="${height}">${elementHTML.outerHTML}</foreignObject>`;
    svg.appendChild(group);
  }

  static createGroup(svgElement) {
    const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
    svgElement.appendChild(group);
    return group;
  }

  static createLine(svg, x1, y1, x2, y2, text) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.classList.add("orgchart-line");
    line.setAttribute("stroke", "#022D42");
    line.setAttribute("stroke-width", 0.6);
    svg.appendChild(line);

    if (text) {
      this.createText(svg, text, (x1 + x2) / 2, y1 - 10);
    }
  }

  static createText(svg, text, x, y) {
      const textElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
      textElement.setAttribute("x", x);
      textElement.setAttribute("y", y);
      textElement.setAttribute("font-family", "Verdana");
      textElement.setAttribute("font-size", "12");
      textElement.setAttribute("fill", "black");
      textElement.setAttribute("text-anchor", "middle");
      textElement.textContent = text;
      svg.appendChild(textElement);
      return textElement;
  }
  
  static deleteLines(svg) {
    const lines = svg.querySelectorAll("line");
    lines.forEach((line) => line.remove());
  }
}