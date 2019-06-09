//対応データ形式
FILE_TYPES = ['.geojson', '.zip']
//データ対応判定
function checkFileType(fileName){
    for (type in FILE_TYPES) {
        if (fileName.endsWith(FILE_TYPES[type])){return true}
    }
    return false
}
// File APIに対応していない場合はエリアを隠す
if (!window.File) {
    document.getElementById('import_section').style.display = "none";
}
// ブラウザ上でファイルを展開する挙動を抑止
function onDragOver(event) {
    event.preventDefault();
}
// Drop領域にドロップした際のファイルのプロパティ情報読み取り処理
function onDrop(event) {
    // ブラウザ上でファイルを展開する挙動を抑止
    event.preventDefault();
    //地物追加処理中にアニメーションを再生
    miniWindowChanger("https://www.asus.com/support/images/support-loading.gif");
    // ドロップされたファイルのfilesプロパティを参照
    var files = event.dataTransfer.files;
    for (var i=0; i<files.length; i++) {
        var name = String(files[i].name);
        //対応していないデータ形式の場合
        if (!checkFileType(name)){
            alert(name + "の形式には対応していません。\n対応データ：" + String(FILE_TYPES));
            miniWindowChanger("");
            continue
        }
        // 一件ずつ追加
        getGeojson(files[i]);
    }
}

//対応データをドラッグドロップするとサーバに投げてgeojsonが返ってくる
function getGeojson(f) {
    //APIからGEOJSON取得処理
    var formdata = new FormData();
    formdata.append('datafile', f);
    fetch("/",{
        method:"POST",
        body:formdata
    })
    .then(function(response1) {
        console.log("status=" + response1.status); //例 200
        return response1.json();
    })
    .then(function(data1) {
        addGeojson(data1);
    })
    .catch(function(err1) {
        console.log("err=" + err1);
        alert('Import Error');
        miniWindowChanger("");
    });
}
//geojsonを入力するとmapに追加する
function addGeojson(geojson){
    miniWindowChanger("http://kuraline.jp/read/content/images/common/loading.gif");
    var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    var myStyle = {
        "color": randomColor,
        "weight": 3,
        "opacity": 0.65
    };
    var geojsonLayer = L.geoJSON(geojson,{
                        style:myStyle,
                         onEachFeature: function (feature, layer) {
                            //地物ごとにプロパティをポップアップに表示(HTML)
                            var properties = feature.properties;
                            var propHtml = "<table cellpadding='3' width='300px' style='table-layout:auto; font-size:9pt;' >"
                            for (key in properties) {
                                propHtml += "<tr><td>" + String(key) + "</td><td>" + String(properties[key]) + "</td></tr>"
                            };
                            propHtml+= "</table>"
                            console.log(layer)
                            //TODO 地物削除ボタン
                            console.log(layer._leaflet_id)
                            var popupHtml = "<div>"
                                                + propHtml
                                                + "<input type='button' value='削除' onclick='removetest()'>"
                                            +"</div>";
                            layer.bindPopup(popupHtml);
                            }
                        });
    geojsonLayer.setStyle(
        function(feature){
        }
    );
    geojsonLayer.name = geojson.name
    //GEOJSONレイヤーをオーバーレイレイヤーに追加（layer_controlはmain.jsで定義）
    layerControl.addOverlay(geojsonLayer,geojsonLayer.name);
    map.addLayer(geojsonLayer);
    customLayerGroup.push(geojsonLayer);
    //地物追加処理終了時にアニメーションを削除
    console.log('animation stop');
    miniWindowChanger("");
}

//読み込み中のくるくるGUI
L.control.custom({
    position: 'bottomleft',
    content : '<div id="miniWindow" style="height:100%">'+
              '</div>',
    classes : 'card',
    style   :
    {
        margin: '10px',
        padding: '0px 0 0 0',
        cursor: 'pointer',
        opacity: '0.5',
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
})
.addTo(map);