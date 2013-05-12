class Gallery
  constructor: ->
    @load()

  load: ->
    par = @
    $.get '/images', (data) ->
      par.appendImages(data)

  appendImages: (paths) ->
    s = @
    for path in paths then do (path) =>
      $("#thumbTmpl").tmpl({path: path}).appendTo("#listOfThumbs")

    $("#listOfThumbs").resize () ->
      x = $("#scene").width() / 2 - $("#listOfThumbs").width() / 2
      y = $("#scene").height() / 2 - $("#listOfThumbs").height() / 2
      s.setStripPos(x, y)

    $("#scene").resize () ->
      x = $("#scene").width() / 2 - $("#listOfThumbs").width() / 2
      y = $("#scene").height() / 2 - $("#listOfThumbs").height() / 2
      s.setStripPos(x, y)

  setStripPos: (x, y) ->
    $("#strip").css("webkitTransform",  "translate("+x+"px,"+y+"px)")

gallery = new Gallery