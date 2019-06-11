//TODO ズームレベルに応じた簡素化

//LEAFLET.JS
var mapTitle = "TEST Map"
var authorName = "aaaaaaaaaaaa"
//ベースレイヤーを定義
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
});
var kokudoLayer = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg',{
    attribution: '© <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>',
});
var baseLayer = {
	"OpenStreetMap":osmLayer,
	"国土地理院オルソ":kokudoLayer,
};
//オーバーレイレイヤーを定義
var kokudoContourLayer = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/slopemap/{z}/{x}/{y}.png',{
	attribution: '© <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>',
});
kokudoContourLayer.setOpacity(0.65);
//手書き図形のためのオーバーレイ
var handwritingLayer = L.featureGroup();
var overlayLayer = {
	"傾斜量図":kokudoContourLayer,
	"手書きレイヤー":handwritingLayer,
}
//ユーザーが追加したレイヤー
var customLayerGroup = []
//地図を表示するdiv要素のidを設定
var map = L.map('map_container',{
	//デフォルトのタイルマップを定義
	layers:[osmLayer, handwritingLayer],
});
//地図の中心とズームレベルを指定
map.setView([44.2,142.4], 5);
//スケールを表示
L.control.scale({"imperial":false}).addTo(map);
//レイヤーコントロールを追加：引数1ベースレイヤー、引数2オーバーレイレイヤー
var layerControl = L.control.layers(baseLayer,overlayLayer,
									{"collapsed":false,});
layerControl.addTo(map);
//map title window
L.control.custom({
    position: 'topleft',
    content : '<div>'+
                mapTitle + '\n\n' + '<a href="https://twitter.com/'+ authorName + '">@' + authorName + '</a>' +
              '</div>',
    classes : 'card border-secondary',
    style   :
    {
        position: 'absolute',
        left: '42px',
        top: '0px',
        width: '200px',
        padding: '5px',
    },
    events:
    {
        click: function(data)
        {
            console.log("AA");
        },
        dblclick: function(data)
        {
            console.log('wrapper div element dblclicked');
            console.log(data);
        },
        contextmenu: function(data)
        {
            console.log('wrapper div element contextmenu');
            console.log(data);
        },
    }
}).addTo(map);

//some components