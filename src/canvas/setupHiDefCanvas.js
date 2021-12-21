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

	// Get the size of the canvas in CSS pixels.
	//var rect = canvas.getBoundingClientRect();
    const initialWidth = canvas.width;
    const initialHeight = canvas.height;


	// On Hi Def like Retina display we double the size of the canvas
	canvas.width = initialWidth * devicePixelRatio;
	canvas.height = initialHeight * devicePixelRatio;
    ctx.scale(devicePixelRatio, devicePixelRatio);

	// and we shrink the display size using CSS
	canvas.style.width = initialWidth + 'px';
    canvas.style.height = initialHeight + 'px';

	console.log(" ─────────────────────────")
	console.log(" │ setupHiDefCanvas      │")
	console.log(" ─────────────────────────")

	console.log("devicePixelRatio : " + devicePixelRatio)
	console.log(" └───────────────────────┘")

	return ctx;
}





