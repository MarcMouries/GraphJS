export class DOMUtil {

  /** calculate the dimensions of the specified DOM element */
  static getDimensions(element) {

   // element.setAttribute("style", "border: 10px solid black; box-shadow: 2px 2px 5px #888;");


    const tempElement = document.createElement("div");
    tempElement.style.position = "absolute";
    tempElement.style.visibility = "hidden";
    tempElement.appendChild(element);

    document.body.appendChild(tempElement);

    const style = window.getComputedStyle(element);
    console.log("style", style)

    const height = element.offsetHeight +
    parseInt(style.marginTop) +
    parseInt(style.marginBottom) +
    parseInt(style.borderTopWidth) +
    parseInt(style.borderBottomWidth) +
    parseInt(style.paddingTop) +
    parseInt(style.paddingBottom);

  const width = element.offsetWidth +
    parseInt(style.marginLeft) +
    parseInt(style.marginRight) +
    parseInt(style.borderLeftWidth) +
    parseInt(style.borderRightWidth) +
    parseInt(style.paddingLeft) +
    parseInt(style.paddingRight);

//    const width = tempElement.offsetWidth;
//    const height = tempElement.offsetHeight;

    document.body.removeChild(tempElement);

    return { width, height };
  }
}
