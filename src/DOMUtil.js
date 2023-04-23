export class DOMUtil {

  /** calculate the dimensions of the specified DOM element */
  static getDimensions(elementHTML) {

    // Create a temporary DOM element to calculate the dimensions
    const tempElement = document.createElement('div');
    tempElement.style.position = 'absolute';
    tempElement.style.visibility = 'hidden';
    tempElement.innerHTML = elementHTML;
    document.body.appendChild(tempElement);

    const dimensions = {
      width: tempElement.offsetWidth,
      height: tempElement.offsetHeight,
    };

    document.body.removeChild(tempElement);

    return dimensions;
  }
}