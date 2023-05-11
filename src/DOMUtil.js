export class DOMUtil {

  /** calculate the dimensions of the specified DOM element and its box-shadow separately */
  static getDimensions(element) {

    const tempElement = document.createElement("div");
    tempElement.style.position = "absolute";
    tempElement.style.visibility = "hidden";
    tempElement.appendChild(element);

    document.body.appendChild(tempElement);

    let originalHeight = element.offsetHeight;
    let originalWidth = element.offsetWidth;

    // Get box-shadow properties
    const computedStyle = getComputedStyle(element);
    const boxShadow = computedStyle.boxShadow;

    let totalWidth = originalWidth;
    let totalHeight = originalHeight;

    if (boxShadow !== 'none') {
      const shadowValues = boxShadow.split(' ');

      let shadowBlur = parseFloat(shadowValues[3]);
      let shadowSpread = parseFloat(shadowValues[4]) || 0;
      let shadowOffsetX = parseFloat(shadowValues[1]);
      let shadowOffsetY = parseFloat(shadowValues[2]);

      // Calculate the extra space added by the box-shadow
      let extraWidth = Math.max(shadowOffsetX + shadowBlur + shadowSpread, 0) - Math.min(shadowOffsetX, 0);
      let extraHeight = Math.max(shadowOffsetY + shadowBlur + shadowSpread, 0) - Math.min(shadowOffsetY, 0);

      // Calculate the total width and height including the box-shadow
      totalWidth = originalWidth + extraWidth;
      totalHeight = originalHeight + extraHeight;
    }

    document.body.removeChild(tempElement);

    return {
      width: originalWidth,
      height: originalHeight,
      totalWidth: totalWidth,
      totalHeight: totalHeight
    };
  }

}
