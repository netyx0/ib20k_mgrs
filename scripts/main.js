/* first set up the maps with HK80 projection */
proj4.defs("EPSG:2326", "+proj=tmerc +lat_0=22.31213333333334 +lon_0=114.1785555555556 +k=1 +x_0=836694.05 +y_0=819069.8 +ellps=intl +towgs84=-162.619,-276.959,-161.764,0.067753,-2.24365,-1.15883,-1.09425 +units=m +no_defs");
proj4.defs("EPSG:3857", "+proj=merc +a=6378137 +b=6378137 +lat_ts=0 +lon_0=0 +x_0=0 +y_0=0 +k=1 +units=m +nadgrids=@null +wktext +no_defs +type=crs");
proj4.defs("ESRI:102142","+proj=utm +zone=50 +ellps=intl +units=m +no_defs +type=crs");
ol.proj.proj4.register(proj4);

var maplayer_geoinfobasemap = new ol.layer.Tile({
	source: new ol.source.XYZ({
		url: "https://mapapi.geodata.gov.hk/gs/api/v1.0.0/xyz/basemap/HK80/{z}/{x}/{y}.png",
		projection: "EPSG:2326",
		tileGrid: hk80_tilegrid(10, 20),
		crossOrigin: "anonymous",
		attributions: "<a href=\"https://portal.csdi.gov.hk/csdi-webpage/doc/TNC\"><img id=\"attribimg\" src=\"https://www.map.gov.hk/gm/res/images/core/lands.png\" />地圖由地政總署提供</a>"
	})
});
var maplayer_geoinfolabels = new ol.layer.Tile({
	source: new ol.source.XYZ({
		url: "https://mapapi.geodata.gov.hk/gs/api/v1.0.0/xyz/label/hk/tc/hk80/{z}/{x}/{y}.png",
		projection: "EPSG:2326",
		tileGrid: hk80_tilegrid(8, 20),
		crossOrigin: "anonymous"
	})
});
var maplayer_ib20k = new ol.layer.Tile({
	source: new ol.source.XYZ({
		url: "https://services2.map.gov.hk/xyz/ib20000/tile/{z}/{y}/{x}?blankTile=false",
		projection: "EPSG:2326",
		tileGrid: hk80_tilegrid(8, 18),
		crossOrigin: "anonymous",
		attributions: "<a href=\"https://portal.csdi.gov.hk/csdi-webpage/doc/TNC\"><img id=\"attribimg\" src=\"https://www.map.gov.hk/gm/res/images/core/lands.png\" />地圖由地政總署提供</a>"
	})
});
var maplayer_aerial = new ol.layer.Tile({
	source: new ol.source.XYZ({
		url: "https://mapapi.geodata.gov.hk/gs/api/v1.0.0/xyz/imagery/HK80/{z}/{x}/{y}.png",
		projection: "EPSG:2326",
		tileGrid: hk80_tilegrid(7, 19),
		crossOrigin: "anonymous",
		attributions: "<a href=\"https://portal.csdi.gov.hk/csdi-webpage/doc/TNC\"><img id=\"attribimg\" src=\"https://www.map.gov.hk/gm/res/images/core/lands.png\" />航空照片由地政總署提供</a><p class=\"attrib\"> | Contains modified Copernicus Sentinel data [2022]</p>"
	})
})

var maplayer_osm = new ol.layer.Tile({
	source: new ol.source.XYZ({
		url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
		projection: "EPSG:3857",
		maxZoom: 19,
		crossOrigin: "anonymous",
		attributions: "<a href=\"https://openstreetmap.org/copyright\">© OpenStreetMap contributors</a>"
	})
})

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
	}),
	minZoom: 13
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
var layerarr_aerial = [
	maplayer_aerial,
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
		maxZoom: 21
	}),
	controls: ol.control.defaults.defaults({attribution: false}).extend(
		[new ol.control.Attribution({
			collapsible: false
		})])
});

/* make labels rotate w/ map */
map.getView().on('propertychange', function() {
	var features = maplayer_mgrsgrid.getSource().getFeatures();
	for (var i = 0; i < features.length; i++) {
		var textfeature = features[i].getStyle().getText();
		if (textfeature == null) {
			continue;
		}
		textfeature.setRotation(map.getView().getRotation());
	}
	maplayer_mgrsgrid.getSource().changed();
	}
);
