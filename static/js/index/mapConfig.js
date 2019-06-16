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
var drawLayer = new L.FeatureGroup();

var overlayLayer = {
	"傾斜量図":kokudoContourLayer,
	"手書きレイヤー":drawLayer,
}

//地図を表示するdiv要素のidを設定
var map = L.map('map_container',{
	//デフォルトのタイルマップを定義
	layers:[osmLayer, drawLayer],
});
//地図の中心とズームレベルを指定
map.setView([44.2,142.4], 5);
//スケールを表示
L.control.scale({"imperial":false}).addTo(map);


//自作コントロール
var appearanceControl = L.control.appearance(baseLayer, overlayLayer, [], {opacity:true,
                                                                    remove:true});
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