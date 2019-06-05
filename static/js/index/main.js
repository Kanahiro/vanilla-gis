//LEAFLET.JS
	var mapTitle = "地図タイトル"
	var authorName = "kigchi999"
	//ベースレイヤーを定義
	var osm_layer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
	    attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',  });
	var kokudo_layer = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg',{
	    attribution: '© <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>',  });
	var base_layer = {
		"OpenStreetMap":osm_layer,
		"国土地理院オルソ":kokudo_layer,
	};
	//オーバーレイレイヤーを定義
	var kokudoContour_layer = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/slopemap/{z}/{x}/{y}.png',{
	attribution: '© <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>',  });
	kokudoContour_layer.setOpacity(0.65);
	//手書き図形のためのオーバーレイ
	var handwriting_layer = L.featureGroup();
	attribution: ''
	var overlay_layer = {
		"傾斜量図":kokudoContour_layer,
		"手書きレイヤー":handwriting_layer,
	}

	//ユーザーが追加したレイヤー
	var custom_layer_group = []
	
	//地図を表示するdiv要素のidを設定
	var map = L.map('map_container',{
		//デフォルトのタイルマップを定義
		layers:[osm_layer, handwriting_layer],
	});
	//地図の中心とズームレベルを指定
	map.setView([44.2,142.4], 5);
	//スケールを表示
	L.control.scale({"imperial":false}).addTo(map);

	//レイヤーコントロールを追加：引数1ベースレイヤー、引数2オーバーレイレイヤー
	var layer_control = L.control.layers(base_layer,overlay_layer,
										{"collapsed":false,});
	layer_control.addTo(map);