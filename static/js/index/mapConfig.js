//LEAFLET.JS
var mapTitle = "タイトル未設定"
var authorName = "unknown user"
//ベースレイヤーを定義
var osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution: '© <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
});
var kokudoLayer = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/ort/{z}/{x}/{y}.jpg',{
    attribution: '© <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>',
});
var mieruneLayer = L.tileLayer('https://tile.mierune.co.jp/mierune_mono/{z}/{x}/{y}.png',{
    attribution: "Maptiles by <a href='http://mierune.co.jp/' target='_blank'>MIERUNE</a>, under CC BY. Data by <a href='http://osm.org/copyright' target='_blank'>OpenStreetMap</a> contributors, under ODbL."
});
var baseLayer = {
	"OpenStreetMap":osmLayer,
    "国土地理院オルソ":kokudoLayer,
    "MIERUNE MONO":mieruneLayer
};
//オーバーレイレイヤーを定義
var kokudoHeightLayer = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/relief/{z}/{x}/{y}.png',{
	attribution: '© <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>',
});
var kokudoContourLayer = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/slopemap/{z}/{x}/{y}.png',{
	attribution: '© <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>',
});
var kokudoCrackLayer = L.tileLayer('https://cyberjapandata.gsi.go.jp/xyz/afm/{z}/{x}/{y}.png',{
	attribution: '© <a href="https://maps.gsi.go.jp/development/ichiran.html">国土地理院</a>',
});
kokudoHeightLayer.setOpacity(0.5);
kokudoContourLayer.setOpacity(0.5);
kokudoCrackLayer.setOpacity(0.5);

//手書き図形のためのオーバーレイ
var drawLayer = new L.FeatureGroup();
drawLayer.options.name = "手書きレイヤー"

var overlayLayer = {
    "色別標高図":kokudoHeightLayer,
    "傾斜量図":kokudoContourLayer,
    "活断層図":kokudoCrackLayer,
	"手書きレイヤー":drawLayer,
}

//地図を表示するdiv要素のidを設定
var map = L.map('map_container',{
    preferCanvas:true,
	//デフォルトのタイルマップを定義
	layers:[osmLayer, drawLayer],
});
//地図の中心とズームレベルを指定
map.setView([44.2,142.4], 5);
//スケールを表示
L.control.scale({"imperial":false,
                "position":"bottomright"}).addTo(map);

//自作コントロール
var appearanceControl = L.control.appearance(baseLayer, overlayLayer, [], {opacity:true,
                                                                        remove:true,
                                                                        color:true});
appearanceControl.addTo(map);

//map title window
var titleAuthorUI = L.control.custom({
                        position: 'topleft',
                        content : '<div>'+
                                    mapTitle + '\n\n' + '<a href="https://twitter.com/'+ authorName + '">@' + authorName + '</a>' +
                                  '</div>',
                        classes : 'card border-secondary',
                        style   :
                        {
                            cursor: 'pointer',
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
                                titleEdit.addTo(map);
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
                    });
titleAuthorUI.addTo(map);

//title edit ui
var titleEdit = L.control.custom({
                                    position: 'topleft',
                                    content : '<form name="titleForm">'+
                                                'タイトル:<input type="text" name="titleInput" value="" placeholder="Map Title">' +
                                                '作者:<input type="text" name="authorInput" value="" placeholder="Twitter ID">' +
                                                '<input type="button" id="editOk" value="OK" onclick="applyEdit()">' +
                                                '<input type="button" id="editCancel" value="キャンセル" onclick="map.removeControl(titleEdit)">' +
                                              '</form>',
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
                                        },
                                        dblclick: function(data)
                                        {
                                        },
                                        contextmenu: function(data)
                                        {
                                        },
                                    }
                                });

//タイトルと作者の編集を反映
function applyEdit(){
    var form = document.forms.titleForm; 
    mapTitle = form.titleInput.value;
    authorName = form.authorInput.value;
    map.removeControl(titleEdit);
    map.removeControl(titleAuthorUI);
    if (mapTitle != "" && authorName != ""){
        titleAuthorUI.options.content = '<div>'+
                                        mapTitle + '\n\n' + '<a href="https://twitter.com/'+ authorName + '">@' + authorName + '</a>' +
                                '</div>'
    };
    titleAuthorUI.addTo(map);
}