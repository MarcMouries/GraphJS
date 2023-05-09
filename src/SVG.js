export class SVG {
    constructor(container) {
      this.currentX = 0;
      this.currentY = 0;
      this.offsetX = 0;
      this.offsetY = 0;
      this.dragging = false;
      this.currentScale = 1;
  
      this.init(container);
    }
  
    init(container) {
      this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      this.svg.setAttribute("id", "svgCanvas");
      this.svg.setAttribute("width", "100%");
      this.svg.setAttribute("height", "100%");
  
      this.svgGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      this.svgGroup.setAttribute("id", "group");
      this.svgGroup.setAttribute("transform", "translate(0, 0) scale(1)");
  
      this.svg.appendChild(this.svgGroup);
  
      this.svg.addEventListener("mousedown", this.startDrag.bind(this));
      this.svg.addEventListener("mousemove", this.drag.bind(this));
      this.svg.addEventListener("mouseup", this.endDrag.bind(this));
      this.svg.addEventListener("wheel", this.zoom.bind(this));
  
      container.appendChild(this.svg);
    }
  
    startDrag(evt) {
      this.dragging = true;
      this.currentX = evt.clientX;
      this.currentY = evt.clientY;
      const transform = this.svgGroup.getAttribute("transform");
      if (transform) {
        const translateMatch = transform.match(/translate\(([^,]+),\s*([^)]+)\)/);
        if (translateMatch) {
          this.offsetX = parseFloat(translateMatch[1]);
          this.offsetY = parseFloat(translateMatch[2]);
        }
      }
    }
  
   drag(evt) {
      if (this.dragging) {
        evt.preventDefault();
        const dx = evt.clientX - this.currentX;
        const dy = evt.clientY - this.currentY;
  
        this.svgGroup.setAttribute(
          "transform",
          `translate(${this.offsetX + dx}, ${this.offsetY + dy}) scale(${this.currentScale})`
        );
      }
    }
  
    endDrag(evt) {
      this.dragging = false;
      const dx = evt.clientX - this.currentX;
      const dy = evt.clientY - this.currentY;
      this.offsetX += dx;
      this.offsetY += dy;
    }
  
    zoom(evt) {
      evt.preventDefault();
  
      const scaleFactor = evt.deltaY > 0 ? 0.9 : 1.1;
      this.currentScale *= scaleFactor;
      this.svgGroup.setAttribute(
        "transform",
        `translate(${this.offsetX}, ${this.offsetY}) scale(${this.currentScale})`
      );
    }
  }