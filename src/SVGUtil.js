export class SVGUtil {
  static createSVGelement(width, height) {
    let svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute("width", width);
    svgElement.setAttribute("height", height);
    return svgElement;
  }
  static createLine(svg, x1, y1, x2, y2) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "#022D42");
    line.setAttribute("stroke-width", 1);
    svg.appendChild(line);
  }

  static deleteLines(svg) {
    const lines = svg.querySelectorAll("line");
    lines.forEach((line) => line.remove());
  }
}
