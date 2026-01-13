/* first set up the maps with HK80 projection */
proj4.defs("EPSG:2326", "+proj=tmerc +lat_0=22.31213333333334 +lon_0=114.1785555555556 +k=1 +x_0=836694.05 +y_0=819069.8 +ellps=intl +towgs84=-162.619,-276.959,-161.764,0.067753,-2.24365,-1.15883,-1.09425 +units=m +no_defs");
proj4.defs("EPSG:3857", "+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs +type=crs");
proj4.defs("ESRI:102142","+proj=utm +zone=50 +ellps=intl +units=m +no_defs +type=crs");
ol.proj.proj4.register(proj4)

var hk80_tilegrid = new ol.tilegrid.TileGrid({
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
	]
});

var maplayer_geoinfobasemap = new ol.layer.Tile({
	source: new ol.source.XYZ({
		url: "https://mapapi.geodata.gov.hk/gs/api/v1.0.0/xyz/basemap/HK80/{z}/{x}/{y}.png",
		projection: "EPSG:2326",
		tileGrid: hk80_tilegrid,
		crossOrigin: "anonymous",
		attributions: "<a href=\"https://portal.csdi.gov.hk/csdi-webpage/doc/TNC\">Map from Lands Department<img id=\"attribimg\" src=\"https://www.map.gov.hk/gm/res/images/core/lands.png\"></a>"
	})
});
var maplayer_geoinfolabels = new ol.layer.Tile({
	source: new ol.source.XYZ({
		url: "https://mapapi.geodata.gov.hk/gs/api/v1.0.0/xyz/label/hk/tc/hk80/{z}/{x}/{y}.png",
		projection: "EPSG:2326",
		tileGrid: hk80_tilegrid,
		crossOrigin: "anonymous"
	})
});
var maplayer_ib20k = new ol.layer.Tile({
	source: new ol.source.XYZ({
		url: "https://services2.map.gov.hk/xyz/ib20000/tile/{z}/{y}/{x}?blankTile=false",
		projection: "EPSG:2326",
		tileGrid: hk80_tilegrid,
		crossOrigin: "anonymous",
		attributions: "<a href=\"https://portal.csdi.gov.hk/csdi-webpage/doc/TNC\">Map from Lands Department<img id=\"attribimg\" src=\"https://www.map.gov.hk/gm/res/images/core/lands.png\"></a>"
	})
});

var maplayer_osm = new ol.layer.Tile({
	source: new ol.source.XYZ({
		url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
		projection: "EPSG:3857",
		crossOrigin: "anonymous",
		attributions: "<a href=\"https://openstreetmap.org/copyright\">© OpenStreetMap contributors</a>"
	})
})

/* next set up the grid */
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

var featurearr = [];
/* in 49Q, draw west to east because the easternmost grid has bits lopped off */
var gridnumber = 91;
for (var i = 0; i < LINE_COORDS_49Q_E.length; i++) {
	draw_gridline(featurearr, LINE_COORDS_49Q_E[i], gridnumber++);
	if (gridnumber == 100) {
		gridnumber = 1;
	}
}
gridnumber = 51;
for (var i = 0; i < LINE_COORDS_49Q_N.length; i++) {
	draw_gridline(featurearr, LINE_COORDS_49Q_N[i], gridnumber++);
	if (gridnumber == 100) {
		gridnumber = 51;
	}
}

/* in 50Q, draw in opposite direction */
/* also flip direction of all lines for better gridnumber label placements */
gridnumber = 39;
for (var i = LINE_COORDS_50Q_E.length-1; i >=0; i--) {
	draw_gridline(featurearr, [LINE_COORDS_50Q_E[i][1],LINE_COORDS_50Q_E[i][0]], gridnumber--);
	if (gridnumber == 0) {
		gridnumber = 99;
	}
}

gridnumber = 99;
for (var i = LINE_COORDS_50Q_N.length-1; i >=0; i--) {
	draw_gridline(featurearr, [LINE_COORDS_50Q_N[i][1],LINE_COORDS_50Q_N[i][0]], gridnumber--);
	if (gridnumber == 50) {
		gridnumber = 99;
	}
}

draw_gridline_boundary(featurearr, BOUNDARY_HEJK, "HE JK ");
draw_gridline_boundary(featurearr, BOUNDARY_GEHE, "GE HE ");
/* flip this one */
draw_gridline_boundary(featurearr, [BOUNDARY_JKKK[1], BOUNDARY_JKKK[0]], "JK KK ");

var maplayer_mgrsgrid = new ol.layer.Vector({
	source: new ol.source.Vector({
		features: featurearr
	})
});


/* okay thats all map layers */
var layerarr_geoinfo = [
	maplayer_geoinfobasemap,
	maplayer_geoinfolabels,
	maplayer_mgrsgrid
];
var layerarr_ib20k = [
	maplayer_ib20k,
	maplayer_mgrsgrid
];
var layerarr_osm = [
	maplayer_osm,
	maplayer_mgrsgrid
];

var map = new ol.Map({
	target: "map",
	pixelRatio: 1,
	interpolate: false,
	layers: layerarr_geoinfo,
	view: new ol.View({
		projection: "ESRI:102142",
		center: ol.proj.fromLonLat([114.1740, 22.3233], "ESRI:102142"),
		zoom: 15,
		minZoom: 10,
		maxZoom: 18
	}),
	controls: ol.control.defaults.defaults({attribution: false}).extend(
		[new ol.control.Attribution({
			collapsible: false
		})])
});

function onclick_changemap_gi()
{
	map.setLayers(layerarr_geoinfo);
}

function onclick_changemap_ib20k()
{
	map.setLayers(layerarr_ib20k);
}

function onclick_changemap_osm()
{
	map.setLayers(layerarr_osm);
}
