const style_grid = new ol.style.Style({
	stroke: new ol.style.Stroke({
		color: "#0088C9",
		width: 2,
	})
});
const style_boundary = new ol.style.Style({
	stroke: new ol.style.Stroke({
		color: "#924720",
		width: 3
	})
});

function hk80_tilegrid(min_zoom, max_zoom)
{
	var ret = new ol.tilegrid.TileGrid({
		extent: [795233.5770899998, 794267.8361200001, 872991.5360700004, 853188.3580900002],
		origin: [-4786700.0, 8353100.0],
		scales: [
			5.91657527591555E8,
			2.95828763795777E8,
			1.47914381897889E8,
			7.3957190948944E7,
			3.6978595474472E7,
			1.8489297737236E7,
			9244648.868618,
			4622324.434309,
			2311162.217155,
			1155581.108577,
			577790.554289,
			288895.277144,
			144447.638572,
			72223.819286,
			36111.909643,
			18055.954822,
			9027.977411,
			4513.988705,
			2256.994353,
			1128.497176,
			564.248588
		],
		resolutions: [
			156543.03392800014,
			78271.51696399994,
			39135.75848200009,
			19567.87924099992,
			9783.93962049996,
			4891.96981024998,
			2445.98490512499,
			1222.992452562495,
			611.4962262813797,
			305.74811314055756,
			152.87405657041106,
			76.43702828507324,
			38.21851414253662,
			19.10925707126831,
			9.554628535634155,
			4.77731426794937,
			2.388657133974685,
			1.1943285668550503,
			0.5971642835598172,
			0.29858214164761665,
			0.14929107082380833
		],
	});

	/* yikes - stupid hack */
	ret.minZoom = min_zoom;
	ret.maxZoom = max_zoom;
	return ret;
}

function draw_gridline(featurearr, latlngs, number)
{
	var geom = new ol.geom.LineString([ol.proj.fromLonLat([latlngs[0][1], latlngs[0][0]], "ESRI:102142"), ol.proj.fromLonLat([latlngs[1][1], latlngs[1][0]], "ESRI:102142")]);
	var feature =new ol.Feature({
		geometry: geom
	});
	feature.setStyle(style_grid);
	featurearr.push(feature);
	var length = ol.sphere.getDistance([latlngs[0][1], latlngs[0][0]], [latlngs[1][1], latlngs[1][0]]);
	var label_style = new ol.style.Style({
		text: new ol.style.Text({
			text: (""+number).padStart(2, '0'),
			font: "16pt monospace",
			fill: new ol.style.Fill({
                color: "#0088C9"
            })
		})
	})
	for (var len = 2500; len < length; len += 4000) {
		var label = new ol.Feature({geometry: new ol.geom.Point(geom.getCoordinateAt(len / length))});
		label.setStyle(label_style);
		featurearr.push(label);
	}
}

function draw_gridline_boundary(featurearr, latlngs, text)
{
	var geom =  new ol.geom.LineString([ol.proj.fromLonLat([latlngs[0][1], latlngs[0][0]], "ESRI:102142"), ol.proj.fromLonLat([latlngs[1][1], latlngs[1][0]], "ESRI:102142")]);
	var feature =new ol.Feature({
		geometry: geom
	});
	feature.setStyle(style_boundary);
	featurearr.push(feature);
	var length = ol.sphere.getDistance([latlngs[0][1], latlngs[0][0]], [latlngs[1][1], latlngs[1][0]]);
	var label_style = new ol.style.Style({
		text: new ol.style.Text({
			text: text,
			font: "18pt monospace",
			fill: new ol.style.Fill({
				color: "#924720"
			})
		})
	})
	for (var len = 2500; len < length; len += 5000) {
		var label = new ol.Feature({geometry: new ol.geom.Point(geom.getCoordinateAt(len / length))});
		label.setStyle(label_style);
		featurearr.push(label);
	}
}

function onclick_changemap_gi()
{
	change_layer(layerarr_geoinfo);
}

function onclick_changemap_ib20k()
{
	change_layer(layerarr_ib20k);
}

function onclick_changemap_aerial()
{
	change_layer(layerarr_aerial);
}

function onclick_changemap_osm()
{
	change_layer(layerarr_osm);
}

function change_layer(layers)
{
	map.setLayers(layers);
	if (export_area_polygon_layer) {
		map.addLayer(export_area_polygon_layer);
	}
}
