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
    console.log('animation start');
    var animation_url = "https://www.asus.com/support/images/support-loading.gif";
    var loading_animation_html = "<img src='"+ animation_url + "' height='50px' width='50px'>";
    mini_window.innerHTML = loading_animation_html;

    // ドロップされたファイルのfilesプロパティを参照
    var files = event.dataTransfer.files;
    for (var i=0; i<files.length; i++) {
        // 一件ずつアップロード
        get_geojson(files[i]);
    }
}

// ファイルアップロード
function get_geojson(f) {
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
        console.log(JSON.stringify(data1));
        add_geojson(data1);
    })
    .catch(function(err1) {
        console.log("err=" + err1);
    });
}

function add_geojson(geojson){
    var randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
    var myStyle = {
        "color": randomColor,
        "weight": 1,
        "opacity": 0.65
    };
    var geojson_layer = L.geoJSON(geojson,{
                        style:myStyle,
                         onEachFeature: function (feature, layer) {
                            //地物ごとにプロパティをポップアップに表示(HTML)
                            var properties = feature.properties;
                            var popup_text = ""
                            for (key in properties) {
                                popup_text += String(key) + ":" + String(properties[key]) + "<br>"
                            };
                            layer.bindPopup(popup_text);
                            }
                        });
    geojson_layer.setStyle(
        function(feature){
        }
    );
    geojson_layer.name = geojson.name
    //GEOJSONレイヤーをオーバーレイレイヤーに追加（layer_controlはmain.jsで定義）
    layer_control.addOverlay(geojson_layer,geojson_layer.name);
    map.addLayer(geojson_layer);
    custom_layer_group.push(geojson_layer);
    //地物追加処理終了時にアニメーションを削除
    console.log('animation stop');
    mini_window.innerHTML = "";
}
