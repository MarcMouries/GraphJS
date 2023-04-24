export class DOMUtil {

  /** calculate the dimensions of the specified DOM element */
  static getDimensions(element) {

    // Check if the input is an HTML string or a DOM element
    if (typeof element === 'string') {
      const tempElement = document.createElement('div');
      tempElement.innerHTML = element;
      element = tempElement.firstChild;
    }

    // Clone the element to avoid side effects when adding to the document
    const clonedElement = element.cloneNode(true);

    // Add the cloned element to the body to calculate the dimensions
    document.body.appendChild(clonedElement);
    const dimensions = {
      width: clonedElement.offsetWidth,
      height: clonedElement.offsetHeight,
    };
    document.body.removeChild(clonedElement);
    return dimensions;
  }
}
