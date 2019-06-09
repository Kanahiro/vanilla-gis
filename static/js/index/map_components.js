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