import InputDeviceTracker from "./InputDeviceTracker";
import { Rectangle, Circle } from "./shape";
import { Renderer, setupHiDefCanvas } from "./canvas";
import { rectContainsShape } from "./geometry";

export class MChart {
	constructor(container, options) {
		console.log("MChart container()");
		console.log(container);
		this.container = container;
		(this.startX = 0), (this.startY = 0);
		(this.lastMoveX = 0), (this.lastMoveY = 0);

		this.canvas = document.getElementById("canvas");
		//this.ctx = this.canvas.getContext("2d");
		this.ctx = setupHiDefCanvas(this.canvas);

		this.cw = this.canvas.width;
		this.ch = this.canvas.height;

		this.renderer = new Renderer(this.ctx);
		this.inputDeviceTracker = new InputDeviceTracker(
			this.canvas,
			this.manageInputEvents.bind(this)
		);

		const DEFAULTS = {
			display_grid: false,
			selection: {
				strokeStyle: "#CC0000", //  'rgba(255,51,0,1)', //'rgba(0,128,255,1)';
				lineWidth: 5.5,
				fillStyle: "rgba(255,51,0,0.05)", //'rgba(0,128,255, 0.2)';
			},
		};
		this.options = Object.assign({}, DEFAULTS, options);

		/* The selection rectangle */
		this.selection = new Rectangle(100, 100, 100, 100);
		this.selection.strokeStyle = this.options.selection.strokeStyle;
		this.selection.fillStyle = this.options.selection.fillStyle;
		this.selection.lineWidth = this.options.selection.lineWidth;

		/* The list of ojbects to draw */
		this.objects = [];

		/**
		 *  Stores the panning offset between the initial location and the canvas location after is has been panned
		 */
		this.translatePos = { x: 0, y: 0 };

		/**
		 *  the accumulated horizontal(X) & vertical(Y) panning the user has done in total
		 */
		this.netPanningX = 0;
		this.netPanningY = 0;

		/**
		 *  coordinates of the last move
		 */
		this.lastMoveX = 0; this.lastMoveY = 0;

		this.isSelecting = false;
		this.isDragging = false;
		this.clicked_on_the_canvas = false;
	}

	dump() {
		console.log("MChart container= ");
		console.log("- objects= ");
		console.log(this.objects);
	}

	addObject(object) {
		this.objects.push(object);
		//this.draw();
	}

	/**
	 *  Private function to render one frame. It is being called by render()
	 */
	renderFrame = () => {
		//  renderFrame() {

		// console.log("renderFrame")
		this.ctx.clearRect(0, 0, this.cw, this.ch);

		if (this.options.display_grid) {
			this.renderer.drawGrid(this.cw, this.ch);
		}

		this.objects.forEach((object) => {
			object.render(this.ctx);
			if (object.isSelected) {
				var selection;
				if (object instanceof Circle) {
					var bbox = object.getBBox();
					selection = new Rectangle(
						bbox.x,
						bbox.y,
						bbox.width,
						bbox.height
					);
				} else {
					selection = new Rectangle(
						object.x,
						object.y,
						object.width,
						object.height
					);
				}
				selection.strokeStyle = this.options.selection.strokeStyle;
				selection.lineWidth = this.options.selection.lineWidth;
				selection.render(this.ctx);
				console.log("selection rectangle");
				console.log(selection);
			}

			if (this.isSelecting == true) {
				this.selection.render(this.ctx);
			}
		});
	};

	render() {
		this.renderFrame();

		window.requestAnimationFrame(this.render.bind(this, this.canvas));
	}

	manageInputEvents(evtType, x, y) {
		switch (evtType) {
			case "down":
				this.mouseIsDown = true;

				this.startX = x;
				this.startY = y;
				this.lastMoveX = x;
				this.lastMoveY = y;

				/* we assume the user clicked on the canvas unless we find an object was hit */
				this.clicked_on_the_canvas = true;

				// we start from last to check the shape that is on top first
				for (var i = this.objects.length - 1; i >= 0; i--) {
					var object = this.objects[i];
					//    console.log ("checking for hit object = " + object.color);
					if (object.isHit(x, y)) {
						object.isSelected = true;
						console.log(
							"Clicked on : " +
								object.constructor.name +
								"/" +
								object.fillStyle
						);
						moveObjectToLastPosition(this.objects, object);
						this.clicked_on_the_canvas = false;
						this.isSelecting = false;
						this.isDragging = true;
					}
				}
				console.log(
					"clicked on the canvas = " + this.clicked_on_the_canvas
				);

				if (this.clicked_on_the_canvas) {
					console.log("clicked on the canvas");
					this.selection_startX = x;
					this.selection_startY = y;

					/* reset selection if user clicked on the canvas */
					this.objects.forEach((object) => {
						console.log(
							"RESET object " +
								object.fillStyle +
								" is Circle ? " +
								(object instanceof Circle)
						);
						object.isSelected = false;
					});
				}
				break;

			case "up":
				this.mouseIsDown = false;
				console.log("MOUSE UP");
				console.log(" isDragging : " + this.isDragging);
				console.log(" isSelecting : " + this.isSelecting);

				if (this.isSelecting) {
					console.log(" selection : " + this.selection);
					/* check if selection includes any object */
					this.objects.forEach((object) => {
						if (rectContainsShape(this.selection, object)) {
							object.isSelected = true;
							console.log(
								"object is selected: " +
									object.constructor.name +
									"/" +
									object.fillStyle
							);
						}
					});
				}

				this.isSelecting = false;
				this.isDragging = false;
				break;

			case "move":
				if (this.clicked_on_the_canvas && this.mouseIsDown) {
					this.isSelecting = true;
					// getting the min & max to handle when the user selects from bottom right to top left
					const x1 = Math.min(this.selection_startX, this.lastMoveX);
					const y1 = Math.min(this.selection_startY, this.lastMoveY);
					const x2 = Math.max(this.selection_startX, this.lastMoveX);
					const y2 = Math.max(this.selection_startY, this.lastMoveY);

					this.selection.x = Math.floor(x1);
					this.selection.y = Math.floor(y1);
					this.selection.width = Math.floor(x2 - x1);
					this.selection.height = Math.floor(y2 - y1);
				}
				this.lastMoveX = x;
				this.lastMoveY = y;

				var dx = x - this.startX;
				var dy = y - this.startY;

				this.startX = x;
				this.startY = y;

				if (this.isDragging) {
					this.objects.forEach((object) => {
						if (object.isSelected) {
							object.x += dx;
							object.y += dy;
						}
					});
				}
				break;
		}
		// this.draw();
	}

	init() {
		this.inputDeviceTracker = new InputDeviceTracker(
			this.canvas,
			this.manageInputEvents.bind(this)
		);
	}
}

/**
 *  We move the node selection to the last position so that it is drawn above the other shapes on the canvas
 */
function moveObjectToLastPosition(object_list, object_to_move) {
	object_list.forEach(function (object, index) {
		if (object === object_to_move) {
			object_list.splice(index, 1);
			object_list.push(object_to_move);
			return;
		}
	});
}
