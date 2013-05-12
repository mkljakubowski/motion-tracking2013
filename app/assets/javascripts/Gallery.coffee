class Gallery
  constructor: ->
    @load()
    @selected = 0

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
      s.setListOfThumbsPos(x, y)

    $("#scene").resize () ->
      x = $("#scene").width() / 2 - $("#listOfThumbs").width() / 2
      y = $("#scene").height() / 2 - $("#listOfThumbs").height() / 2
      s.setListOfThumbsPos(x, y)

    @thumbs = $(".thumb")
    @grow @selected

  setListOfThumbsPos: (x, y) ->
    $("#listOfThumbs").css("webkitTransform",  "translate("+x+"px,"+y+"px)")

  grow: (i) ->
    thumb = @thumbs[i]
    $(thumb).height($("#scene").height() - 100)

  shrink: (i) ->
    thumb = @thumbs[i]
    thumb.style.height = "200px"

  next: ->
    @shrink(@selected)
    if @selected == @thumbs.length - 1
      @selected = 0
    else
      @selected += 1
    @grow(@selected)

  prev: ->
    @shrink(@selected)
    if @selected == 0
      @selected = @thumbs.length - 1
    else
      @selected -= 1
    @grow(@selected)

gallery = new Gallery