import { DOMUtil } from './DOMUtil';

export class SVGUtil {
  static addSVGElement(container) {
    let svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("width", "100%");
    svgElement.setAttribute("height", "100%");
    container.appendChild(svgElement);
    return svgElement;
  }

  static createForeignObject(node, rootElement) {
    const foreignObject = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "foreignObject"
    );
    foreignObject.setAttribute("id", `node-${node.id}`);
    foreignObject.setAttribute("width", node.width);
    foreignObject.setAttribute("height", node.height);
    foreignObject.innerHTML = rootElement.outerHTML;

    return foreignObject;
  }

  static addGroup(svg, node, elementHTML) {
      const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
      const { width, height } = DOMUtil.getDimensions(elementHTML);
      group.innerHTML = `<foreignObject x="${node.x}" y="${node.y}" width="${width}" height="${height}">${elementHTML.outerHTML}</foreignObject>`;
      svg.appendChild(group);
  }

  static createLine(svg, x1, y1, x2, y2) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "#022D42");
    line.setAttribute("stroke-width", 0.6);
    svg.appendChild(line);
  }

  static deleteLines(svg) {
    const lines = svg.querySelectorAll("line");
    lines.forEach((line) => line.remove());
  }
}
