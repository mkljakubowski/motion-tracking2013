$(document).ready(function() { $.getJSON('images', function(data) {
    var items = [];

    $.each(data, function(key, val) {
        items.push('<a href="' + val +'"><img src="'+ val + '" alt="some_text" width="250" height="250"/> </a>');
    });

    $('<ul/>', {
        'class': 'my-new-list',
        html: items.join('')
    }).appendTo('div');

    });
});


