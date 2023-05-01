export class DOMUtil {

  /** calculate the dimensions of the specified DOM element */
  static getDimensions(element) {

    const tempElement = document.createElement("div");
    tempElement.style.position = "absolute";
    tempElement.style.visibility = "hidden";
    tempElement.appendChild(element);
    document.body.appendChild(tempElement);

    const width = tempElement.offsetWidth;
    const height = tempElement.offsetHeight;

    document.body.removeChild(tempElement);

    return { width, height };
  }
}
