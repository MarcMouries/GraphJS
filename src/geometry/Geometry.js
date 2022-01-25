
 export function rectContainsShape(rectangle, shape) {
	if (shape.type == "Circle") {
		return rectContainsCircle(rectangle, shape);
	} else if (shape.type == "Rectangle") {
		return rectContainsRect(rectangle, shape);
	} else {
		console.error("rectContainsShape: shape is unknown: " + shape);
		console.error( shape);
	}
}

/**
 *
 *
 *    x,y
 *    ┌────────────────────────┐ width
 *    │  x,y             width │
 *    │  ┌──────────────────┐  │
 *    │  │                  │  │
 *    │  │                  │  │
 *    │  │                  │  │
 *    │  └──────────────────┘  │
 *    │                  heigth│
 *    └────────────────────────┘ heigth

 * @param {*} rect1 
 * @param {*} rect2 
 * @returns 
 */
/*
 function rectContainsRect(rect1, rect2) {
	console.log("rectContainsRect");
	// console.log(rect1.toStringCoordinates());
	// console.log(rect2.toStringCoordinates());

	var result_X =
		rect1.getX() < rect2.getX() &&
		rect1.getX() + rect1.getWidth() < rect2.getX() + rect2.getWidth();

	var result_Y =
		rect1.getY() > rect2.getY() &&
		rect1.getY() + rect1.getHeight() <= rect2.getY() + rect2.getHeight();

	return result_X & result_Y;
}
*/

function rectContainsRect(rect1, rect2) {
	var result_X =
		rect1.x < rect2.x && rect1.x + rect1.width > rect2.x + rect2.width;

	var result_Y =
		rect1.y < rect2.y && rect1.y + rect1.height > rect2.y + rect2.height;

	return result_X & result_Y;
}





function rectContainsCircle(rectangle, circle) {
	// LEFT
	var left_include = rectangle.x < circle.x - circle.radius;
	if (!left_include) {
		//circle is outside of the rectangle on the left side
		return false;
	}
	// RIGHT
	var right_include =
		rectangle.x + rectangle.width > circle.x + circle.radius;
	if (!right_include) {
		//circle is outside of the rectangle on the right side
		return false;
	}
	// BOTTOM
	var bottom_include =
		rectangle.y + rectangle.height > circle.y + circle.radius;
	if (!bottom_include) {
		//circle is outside of the rectangle on the bottom side
		return false;
	}
	// TOP:
	var top_include = rectangle.y < circle.y - circle.radius;
	if (!top_include) {
		//circle is outside of the rectangle on the top side
		return false;
	}
	return true;
}

