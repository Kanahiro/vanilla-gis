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

    // ドロップされたファイルのfilesプロパティを参照
    var files = event.dataTransfer.files;
    for (var i=0; i<files.length; i++) {
        // 一件ずつアップロード
        get_geojson(files[i]);
    }
}

// ファイルアップロード
function get_geojson(f) {
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
        console.log(JSON.stringify(data1));
        add_geojson(data1);
    })
    .catch(function(err1) {
        console.log("err=" + err1);
    });
}

function add_geojson(geojson){
    var shapes = geojson;
    var myStyle = {
        "color": "#000000",
        "weight": 1,
        "opacity": 0.65
    };
    var geojson_layer = L.geoJSON(shapes,{
                    style:myStyle,
                     onEachFeature: function (feature, layer) {
                        //地物ごとにプロパティをポップアップに表示
                        var properties = feature.properties;
                        var popup_text = ""
                        for (key in properties) {
                            popup_text += String(key) + ":" + String(properties[key]) + "\n\n"
                        };
                        layer.bindPopup(popup_text);
                        }
                    });
    geojson_layer.setStyle(
        function(feature){
            return {color: 'red'};
        }
    );
    //GEOJSONレイヤーをオーバーレイレイヤーに追加（layer_controlはmain.jsで定義）
    layer_control.addOverlay(geojson_layer,geojson.name);
    map.addLayer(geojson_layer);
}
