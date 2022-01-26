export default class InputDeviceTracker {
	constructor(canvas, callback) {
		console.log("InputDeviceTracker ()");

		this.canvas = canvas;
		this.callback = callback;

		/**
		 *  Stores the panning offset between the initial location and the canvas location after is has been panned
		 */
		this.translatedPos = { x: 0, y: 0 };

		/**
		 *  the accumulated horizontal(X) & vertical(Y) panning the user has done in total
		 */
		(this.netPanningX = 0), (this.netPanningY = 0);

		/**
		 *  coordinates of the last move
		 */
		(this.lastMoveX = 0), (this.lastMoveY = 0);

		this.startDragOffset = { x: 0, y: 0 };

		this.canvas.addEventListener("mousedown", this.onDown.bind(this));
		this.canvas.addEventListener("mousemove", this.onMove.bind(this));
		this.canvas.addEventListener("mouseup", this.onUp.bind(this));

		this.canvas.addEventListener("touchstart", this.onDown.bind(this));
		this.canvas.addEventListener("touchmove", this.onMove.bind(this));
		this.canvas.addEventListener("touchend", this.onUp.bind(this));
	}

	getCoordinatesFromEvent(evt) {
		var rect = self.canvas.getBoundingClientRect();
		var offsetTop = rect.top;
		var offsetLeft = rect.left;

		if (evt.touches) {
			return {
				x: evt.touches[0].clientX - offsetLeft,
				y: evt.touches[0].clientY - offsetTop,
			};
		} else {
			return {
				x: evt.clientX - offsetLeft,
				y: evt.clientY - offsetTop,
			};
		}
	}

	onDown(event) {
		// tell the browser we're handling this event
		event.preventDefault();
		event.stopPropagation();
		var mouseCoords = this.getCoordinatesFromEvent(event);

		// initial mouse click signaling the start of the dragging motion: we save the location of the user's mouse.
		// dragging offest = current mouse - panning
		this.startDragOffset.x = mouseCoords.x - this.translatedPos.x;
		this.startDragOffset.y = mouseCoords.y - this.translatedPos.y;

		this.callback("down", mouseCoords.x, mouseCoords.y);
	}

	onUp(event) {
		event.preventDefault();
		this.callback("up");
	}

	onMove(event) {
		// tell the browser we're handling this event
		event.preventDefault();
		event.stopPropagation();
		var mouseCoords = this.getCoordinatesFromEvent(event);
		this.callback("move", mouseCoords.x, mouseCoords.y);
	}
}
