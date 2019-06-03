function send_layers_to_python(geojsons){
    //LayersオブジェクトをPythonに渡す
    var str_layer_object = JSON.stringify(geojsons);
    var formdata = new FormData();
    formdata.append('geojsons', str_layer_object);
    fetch("/save",{
        method:"POST",
        body:formdata
    })
    .then(function(response1) {
        console.log("status=" + response1.status); //例 200
        return response1.json();
    })
    .then(function(data1) {
        console.log(JSON.stringify(data1));
    })
    .catch(function(err1) {
        console.log("err=" + err1);
    });
}

function make_layer_object(layer){
	var obj = new Object()
	obj.name = layer.name

}