/* Modified from OpenLayers "print to scale example" and "Export PDF example"
 * https://openlayers.org/en/latest/examples/print-to-scale.html
 * https://openlayers.org/en/latest/examples/export-pdf.html
*/

var export_area_polygon_layer = null;

function onclick_export_1to20k()
{
	var div;
	var control_panel = document.getElementById("controls");
	var el;

	map_selection_enabled = true;

	if (document.getElementById("controls_menu_1to20k")) {
		return;
	}

	div = document.createElement("div");
	div.id = "controls_menu_1to20k";
	div.classList.add("controldiv")

	div.appendChild(document.createElement("hr"));

	el = document.createElement("p");
	el.innerText = "Export (1:20k)";
	div.appendChild(el);

	el = document.createElement("button");
	el.id = "export_1to20k_export_btn";
	el.innerText = "Export selection";
	el.onclick = function(){alert("No area selected!");};
	div.appendChild(el);

	el = document.createElement("button");
	el.innerText = "Export current view";
	el.onclick = export_cur_view_1to20k;
	div.appendChild(el);

	el = document.createElement("button");
	el.innerText = "Cancel";
	el.onclick = onclick_export_1to20k_cancel;
	div.appendChild(el);

	control_panel.appendChild(div);

	map.on("click", export_map_clickfunc);

	document.body.style.cursor = "crosshair";
}

function onclick_export_cur()
{
	export_cur_view_curres();
}

function onclick_export_1to20k_cancel()
{
	if (export_area_polygon_layer) {
		map.removeLayer(export_area_polygon_layer);
		export_area_polygon_layer = null;
	}
	document.getElementById("controls_menu_1to20k").remove();
	map.removeEventListener("click", export_map_clickfunc);
	document.body.style.cursor = "auto";
}

function export_cur_view_1to20k()
{
	export_cur_view_1to20k_offset(null);
}

function export_cur_view_1to20k_offset(end_location)
{
	export_cur_view((29.7*200)/(297*150/25.4), end_location);
}

function export_cur_view_curres()
{
	export_cur_view(map.getView().getResolution(), null);
}

function export_cur_view(new_resolution, end_location)
{
	const resolution = 150;
	const dim = [297, 210];
	const width = Math.round((297 * resolution) / 25.4);
	const height = Math.round((210 * resolution) / 25.4);
	const size = map.getSize();
	const orig_resolution = map.getView().getResolution();
	const orig_cursor = document.body.style.cursor;

	var coverdiv = document.createElement("div");
	coverdiv.id = "coverdiv";
	coverdiv.innerText = "Loading...";
	document.body.appendChild(coverdiv);
	if (export_area_polygon_layer) {
		map.removeLayer(export_area_polygon_layer);
	}

	document.body.style.cursor = "wait";
	map.once("rendercomplete", function() {
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
		if (end_location) {
			map.getView().setCenter(end_location);
		}
		document.body.style.cursor = orig_cursor;
		coverdiv.remove();
	});
	map.setSize([width, height]);
	map.getView().setResolution(new_resolution);
}

function export_map_clickfunc(e)
{
	var x = e.coordinate[0];
	var y = e.coordinate[1];
	if (!map_selection_enabled) {
		return;
	}
	if (export_area_polygon_layer) {
		map.removeLayer(export_area_polygon_layer);
		export_area_polygon_layer = null;
	}
	export_area_polygon_layer = new ol.layer.Vector({
		source: new ol.source.Vector({
			features: [new ol.Feature({geometry: new ol.geom.Polygon([[
				[x, y],
				[x + 29.7*200, y],
				[x + 29.7*200, y - 21.0*200],
				[x, y - 21.0*200],
				[x, y]
			]])})]
		}),
		style: new ol.style.Style({
			fill: new ol.style.Fill({color: [200, 0, 0, 0.33]}),
			stroke: new ol.style.Stroke({color: [200, 0, 0, 1]})
		})
	});
	map.addLayer(export_area_polygon_layer);
	document.getElementById("export_1to20k_export_btn").onclick = function() {
		document.getElementById("export_1to20k_export_btn").onclick = function(){alert("No area selected!");};
		var orig_centre = map.getView().getCenter();
		map.getView().setCenter([x + 29.7/2*200, y - 21.0/2*200]);
		export_cur_view_1to20k_offset(orig_centre);
	}
}
