/**
 * Create a High Definition Canvas.
 *
 * @param {*} canvas
 * @returns Scaled 2d Context
 */
export default function setupHiDefCanvas(canvas) {
	// Get the device pixel ratio, falling back to 1.
	var devicePixelRatio = window.devicePixelRatio || 1;

	var ctx = canvas.getContext("2d");

	console.log("─────────────────────────")
	console.log("│ setupHiDefCanvas      │")
	console.log("─────────────────────────")
	console.log("  devicePixelRatio : " + devicePixelRatio)
	console.log("  canvas.width  : " + canvas.width)
	console.log("  canvas.height : " + canvas.height)

	// Get the size of the canvas in CSS pixels.
	var rect = canvas.getBoundingClientRect();
	console.log("  rect.width  : " + rect.width)
	console.log("  rect.height : " + rect.height)

    const initialWidth = canvas.width;
    const initialHeight = canvas.height;


	// On Hi Def like Retina display we double the size of the canvas
	canvas.width = initialWidth * devicePixelRatio;
	canvas.height = initialHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

	// and we shrink the display size using CSS
	canvas.style.width = initialWidth + 'px';
    canvas.style.height = initialHeight + 'px';

	console.log("  canvas.style.width  : " + canvas.style.width)
	console.log("  canvas.style.height  : " + canvas.style.height)

	console.log("  canvas.width  : " + canvas.width)
	console.log("  canvas.height : " + canvas.height)

	console.log(" └───────────────────────┘")

	return ctx;
}