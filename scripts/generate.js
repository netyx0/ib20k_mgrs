/* Modified from OpenLayers "print to scale example" and "Export PDF example"
 * https://openlayers.org/en/latest/examples/print-to-scale.html
 * https://openlayers.org/en/latest/examples/export-pdf.html
*/

function onclick_exportbtn()
{
	const resolution = 150;
	const dim = [297, 210];
	const width = Math.round((297 * resolution) / 25.4);
	const height = Math.round((210 * resolution) / 25.4);
	const size = map.getSize();
	const orig_resolution = map.getView().getResolution();
	const new_resolution = (29.7*200)/(297*150/25.4);

	document.body.style.cursor = "wait";
	map.once("rendercomplete", function () {
		const mapCanvas = document.createElement("canvas");
		mapCanvas.width = width;
		mapCanvas.height = height;
		const mapContext = mapCanvas.getContext("2d");
		Array.prototype.forEach.call(
			document.querySelectorAll(".ol-layer canvas"),
			function (canvas) {
				if (canvas.width > 0) {
					const opacity = canvas.parentNode.style.opacity;
					mapContext.globalAlpha = opacity === "" ? 1 : Number(opacity);
					const transform = canvas.style.transform;
					// Get the transform parameters from the style's transform matrix
					const matrix = transform
						.match(/^matrix\(([^\(]*)\)$/)[1]
						.split(",")
						.map(Number);
					// Apply the transform to the export map context
					CanvasRenderingContext2D.prototype.setTransform.apply(
						mapContext,
						matrix,
					);
					mapContext.drawImage(canvas, 0, 0);
				}
			},
		);
		mapContext.globalAlpha = 1;
		mapContext.setTransform(1, 0, 0, 1, 0, 0);
		const pdf = new jspdf.jsPDF("landscape", undefined, "a4");
		pdf.addImage(mapCanvas.toDataURL("image/jpeg"), "JPEG", 0, 0, 297, 210);
		pdf.save("map.pdf");
		map.setSize(size);
		map.getView().setResolution(orig_resolution);
		document.body.style.cursor = "auto";
	});
	map.setSize([width, height]);
	map.getView().setResolution(new_resolution);
}
