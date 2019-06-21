//メソッドを指定してPOST
function fetchPost(methodUrl, formData) {
    fetch(methodUrl, {
        method:"POST",
        body:formData
    })
    .then(function(response) {
        console.log("status=" + response.status); //例 200
    })
    .catch(function(err) {
        console.log("err=" + err);
    });
}
/*
//store Edit to DB
function sendLayersToPython(layerGroup){
	var exportGeojsons = []
	//Copy layerGroup(geojsons) to export_geojsons from layerGroup defiend in main.js
    for (layerNum in layerGroup) {
    	//only ACTIVE overlays will be send to Python
    	if(!map.hasLayer(layerGroup[layerNum])){continue}
        var added_geojson = layerGroup[layerNum].toGeoJSON()
        added_geojson.name = layerGroup[layerNum].name
        exportGeojsons.push(added_geojson)
    }
    var strLayerGeojsons = JSON.stringify(exportGeojsons);
    var formdata = new FormData();
    formdata.append('geojsons', strLayerGeojsons);
    formdata.append('mapTitle', mapTitle);
    formdata.append('authorName', authorName);
    console.log(fetchPost("/save", formdata));
}
//GUI
L.control.custom({
    position: 'bottomright',
    content : '<div>'+
                'URL生成'+
              '</div>',
    classes : 'card border-secondary',
    style   :
    {
        padding: '5px',
        cursor: 'pointer',
        opacity: '1.0',
    },
    events:
    {
        click: function(data)
        {
            sendLayersToPython(customLayerGroup);
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
*/

//export GeoJSON file
function exportGeojson(layers){
	var exportData = {
						"type":"FeatureCollection",
						"features":[]
					}
	//Copy layerGroup(geojsons) to export_geojsons from layerGroup defiend in main.js
    for (i = 0; i < layers.length; i++) {
    	//only ACTIVE overlays will be send to Python
        if(!map.hasLayer(layers[i].layer)){continue};
        var layerGroup = new L.featureGroup();
        layerGroup.addLayer(layers[i].layer);
        var addFeatures = layerGroup.toGeoJSON().features
        for (j = 0; j < addFeatures.length; j++) {
			exportData.features.push(addFeatures[j]);
        }
    }
    var formdata = new FormData();
    formdata.append('geojsons', JSON.stringify(exportData));
    formdata.append('mapTitle', mapTitle);
    fetch("/export", {
        method:"POST",
        body:formdata
    })
    .then(response => response.blob())
    .then(blob => {
        let anchor = document.createElement("a");
        anchor.download = String(Date.now()) + '.geojson'
        anchor.href = window.URL.createObjectURL(blob);
        anchor.click();
    })
    .catch(function(err) {
        console.log("err=" + err);
    });
    miniWindowChanger("");
}
//GUI
L.control.custom({
    position: 'bottomright',
    content : '<div>'+
                '<span>GeoJSONエクスポート</span>'+
              '</div>',
    classes : 'card border-secondary',
    style   :
    {
        padding: '5px',
        cursor: 'pointer',
        opacity: '1.0',
    },
    events:
    {
        click: function(data)
        {
            miniWindowChanger("https://www.asus.com/support/images/support-loading.gif");
            var outputLayers = []
            var layers = appearanceControl._layers;
            for (i = 0; i < layers.length; i++) {
                if (layers[i].overlay && layers[i].name != "色別標高図"
                                    && layers[i].name != "傾斜量図"
                                    && layers[i].name != "活断層図") {
                    outputLayers.push(layers[i]);
                }
            }
            exportGeojson(outputLayers);
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