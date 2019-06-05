function send_layers_to_python(){
	var export_geojsons = []
    for (layer_num in custom_layer_group) {
    	if(!map.hasLayer(custom_layer_group[layer_num])){continue}
        var added_geojson = custom_layer_group[layer_num].toGeoJSON()
        added_geojson.name = custom_layer_group[layer_num].name
        export_geojsons.push(added_geojson)
    }
    var str_layer_object = JSON.stringify(export_geojsons);
    var formdata = new FormData();
    formdata.append('geojsons', str_layer_object);
    formdata.append('mapTitle', mapTitle);
    formdata.append('authorName', authorName);
    fetch("/save",{
        method:"POST",
        body:formdata
    })
    .then(function(response1) {
        console.log("status=" + response1.status); //例 200
        return response1;
    })
    .then(function(data1) {
        console.log(data1);
    })
    .catch(function(err1) {
        console.log("err=" + err1);
    });
}