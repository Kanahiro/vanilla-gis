//対応データ形式
FILE_TYPES = ['.geojson', '.zip']
//データ対応判定
function checkFileType(fileName){
    var filename = fileName.toLowerCase();
    for (type in FILE_TYPES) {
        if (filename.endsWith(FILE_TYPES[type])){return true}
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
    // ドロップされたファイルのfilesプロパティを参照
    var files = event.dataTransfer.files;
    for (var i=0; i<files.length; i++) {
        var name = String(files[i].name);
        //対応していないデータ形式の場合
        if (!checkFileType(name)){
            alert(name + "の形式には対応していません。\n対応データ：" + String(FILE_TYPES));
            continue
        }
        // 一件ずつ追加
        getGeojson(files[i]);
    }
}

//対応データをドラッグドロップするとサーバに投げてgeojsonが返ってくる
function getGeojson(f) {
    miniWindowChanger("https://www.asus.com/support/images/support-loading.gif");
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
    .then(function() {
        //地物追加処理終了時にアニメーションを削除
        console.log('animation stop');
        miniWindowChanger("");
    })
    .catch(function(err1) {
        console.log("err=" + err1);
        alert('Import Error');
        miniWindowChanger("");
    });
}
//geojsonを入力するとmapに追加する
function addGeojson(geojson){
    var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    var geojsonLayer = L.geoJSON(geojson,{
                         onEachFeature: function (feature, layer) {
                            //地物ごとにプロパティをポップアップに表示(HTML)
                            //Props table
                            var properties = feature.properties;
                            var propHtml = "<table cellpadding='3' width='300px' style='table-layout:auto; font-size:9.5pt;' >"
                            for (key in properties) {
                                propHtml += "<tr><td>" + String(key) + "</td><td>" + String(properties[key]) + "</td></tr>"
                            };
                            propHtml+= "</table>"
                            //TODO 地物削除ボタン
                            var popupHtml = "<div>"
                                                + propHtml
                                                + "<input type='button' value='削除' onclick='removetest()'>"
                                            +"</div>";
                            layer.bindPopup(popupHtml);

                            //簡素化
                            layer.options.smoothFactor = 2;

                            //地物ごとのスタイルの設定
                            var layerStyle = makeGoodStyle(layer);
                            layerStyle.color = randomColor;
                            layer.setStyle(layerStyle);
                        }
    });
    geojsonLayer.name = geojson.name
    //GEOJSONレイヤーをオーバーレイレイヤーに追加（layer_controlはmain.jsで定義）
    layerControl.addOverlay(geojsonLayer,geojsonLayer.name);
    map.addLayer(geojsonLayer);
    customLayerGroup.push(geojsonLayer);
}

//地物ごとに最適なスタイルを返す
function makeGoodStyle(layer){
    //default
    var style = {
        "weight": 1,
        "opacity": 0.65
    };
    var type = layer.feature.geometry.type; //Point Polyline Polygon
    switch(type){
        case "Point":
            break;
        case "LineString":
            style.weight = 3;
            break;
        case "MultiLineString":
            style.weight = 3;
            break;
    }
    return style
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

//画面右下のミニウィンドウに載せるデータを設定
function miniWindowChanger(url=null){
    if (url) {
        var loadingAnimationHtml = "<img src='"+ url + "' height='50px' width='50px'>";
        miniWindow.innerHTML = loadingAnimationHtml;
    }else{
        miniWindow.innerHTML = "";};
}