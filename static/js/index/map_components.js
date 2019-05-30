	//button
    L.control.custom({
        position: 'bottomright',
        content : '<div style="height:100px">'+
                  '    <p>AAAAAAAAAAAAAAAAAAAAAAAAAAA</p>'+
                  '</div>',
        classes : 'card',
        style   :
        {
            margin: '10px',
            padding: '0px 0 0 0',
            cursor: 'pointer'
        },
        datas   :
        {
            'foo': 'bar',
        },
        events:
        {
            click: function(data)
            {
                console.log('wrapper div element clicked');
                console.log(map);
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