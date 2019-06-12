//leaflet.draw
var drawControl = new L.Control.Draw({
  draw: {
    circle: {
      feet: false
    },
  },
  edit: {
    featureGroup: drawLayer,
  },
}).addTo(map);

// 何かを描画した際の生成やら設定やら
map.on(L.Draw.Event.CREATED, function (e) {
  // featureのポップアップで値を入力する方法は下記を参考にしました
  // https://gis.stackexchange.com/questions/202966/leaflet-popups-preserving-user-input-on-close-reopen
  // geojsonに落とす際にpropertiesに値を保持する方法は下記を参考にしました
  // https://stackoverflow.com/questions/35760126/leaflet-draw-not-taking-properties-when-converting-featuregroup-to-geojson
  drawLayer.addLayer(e.layer);
  e.layer.feature = e.layer.feature || {};
  e.layer.feature.properties = e.layer.feature.properties || {};
  e.layer.feature.properties.note = e.layer.feature.properties.note || "";
  e.layer.feature.type = "Feature";
  popup = e.layer.bindPopup("");
  setFeatureProperties(e.layer);
  popup.on("popupopen", function (p) {
    $('#note_' + p.target._leaflet_id).attr('value', p.target.feature.properties.note).focus();
  });
  popup.on("popupclose", function (p) {
    p.target.feature.properties.note = $('#note_' + p.target._leaflet_id).val();
  });
});
map.on(L.Draw.Event.EDITED, function (e) {
  e.layers.eachLayer(function (layer) {
    setFeatureProperties(layer);
  });
});

// 描画物の情報を計算し保持するメソッド
var setFeatureProperties = function (layer) {
  // 線と多角形と四角形
  if (layer instanceof L.Polyline) {
    var latlngs = layer._defaultShape ? layer._defaultShape() : layer.getLatLngs();
    if (latlngs.length >= 2) {
      var distance = 0;
      for (var i = 0; i < latlngs.length - 1; i++) {
        distance += latlngs[i].distanceTo(latlngs[i + 1]);
      }
      layer.feature.properties.distance = distance.toFixed(2) + " m"; // ex. distance 3728.81 m
    }
    layer.feature.properties.drawtype = L.Draw.Polyline.TYPE;
  }
  // 多角形と四角形
  if (layer instanceof L.Polygon) {
    var latlngs = layer._defaultShape ? layer._defaultShape() : layer.getLatLngs();
    var area = L.GeometryUtil.geodesicArea(latlngs);
    layer.feature.properties.area = L.GeometryUtil.readableArea(area, true); // ex. area 174.19 ha
    layer.feature.properties.drawtype = L.Draw.Polygon.TYPE;
  }
  // 四角形
  if (layer instanceof L.Rectangle) {
    layer.feature.properties.drawtype = L.Draw.Rectangle.TYPE;
  }
  // 円
  if (layer instanceof L.Circle) {
    layer.feature.properties.radius = layer.getRadius().toFixed(2) + " m"; // ex. radius 1097.02 m
    layer.feature.properties.drawtype = L.Draw.Circle.TYPE;
  }
  // マーカー
  if (layer instanceof L.Marker) {
    layer.feature.properties.drawtype = L.Draw.Marker.TYPE;
  }
  // popup時の表示内容の差し替え
  var contents = "";
  for (var key in layer.feature.properties) {
    if (key != 'note' && key != 'drawtype') {
      contents = contents + key + " " + layer.feature.properties[key] + "<br />";
    }
  }
  contents += "note <input type='text' class='notes' id='note_" + layer._leaflet_id + "' value=''>";
  layer.setPopupContent(contents);
};