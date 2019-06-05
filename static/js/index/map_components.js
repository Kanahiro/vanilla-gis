L.control.custom({
    position: 'bottomright',
    content : '<div>'+
                mapTitle + '<a href="https://twitter.com/'+ authorName + '">@' + authorName + '</a>' +
              '</div>',
    classes : 'card',
    style   :
    {
        margin: '0px 0 5 0',
        padding: '5px',
        cursor: 'pointer',
        opacity: '1.0',
    },
    events:
    {
        click: function(data)
        {
            console.log('wrapper div element clicked');
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
})
.addTo(map);

L.control.custom({
    position: 'bottomright',
    content : '<div>'+
                'URL生成'+
              '</div>',
    classes : 'card',
    style   :
    {
        margin: '0px 0 5 0',
        padding: '5px',
        cursor: 'pointer',
        opacity: '1.0',
    },
    events:
    {
        click: function(data)
        {
            send_layers_to_python();
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
})
.addTo(map);

L.control.custom({
    position: 'bottomleft',
    content : '<div id="mini_window" style="height:100%">'+
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
            console.log('wrapper div element clicked');
            console.log(layer_control._layers)
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
})
.addTo(map);

//画面右下のミニウィンドウに載せるデータを設定
function mini_window_changer(html){
    mini_window.innerHTML = html;
}