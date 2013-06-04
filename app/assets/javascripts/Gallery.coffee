class Gallery
  constructor: ->
    @load()
    @selected = 0
    @canvas = document.getElementById("content")
    @camera = document.getElementById("camera")
    @canvas.height = $('#content').height()
    @canvas.width = $('#content').width()
    @ctx = @canvas.getContext("2d")
    @imageCount = 0
    @pictures = []
    @stage = new createjs.Stage(@canvas)
#    @canvas.onmousemove = @onMouseMove
    createjs.Ticker.addListener(@)
    @pos = 0
    @maxPos = 100

  load: ->
    par = @
    $.get '/images', (data) ->
      par.appendImages(data)

  appendImages: (paths) ->
    for path in paths then do =>
      image = new Image()
      image.src = path
      image.onload = @imageLoaded
      @pictures.push(image)

  onMouseMove: (e) ->
    e = kalmanize(e)
    gallery.stage.mouseX = e.pageX - gallery.camera.width/2
    gallery.stage.mouseY = e.pageY - gallery.camera.height/2
#    gallery.stage.mouseX = e.pageX - gallery.canvas.offsetLeft
#    gallery.stage.mouseY = e.pageY - gallery.canvas.offsetTop

  imageLoaded: () ->
    gallery.imageCount++
    if (gallery.imageCount >= gallery.pictures.length)
      gallery.createBitMaps()

  createBitMaps: () ->
    x = 0
    for i in [0..@pictures.length-1]
      bitmap = new createjs.Bitmap(@pictures[i])
      bitmap.x = x
      bitmap.y = 0
      bitmap.scaleX = @canvas.height / @pictures[i].height
      bitmap.scaleY = @canvas.height / @pictures[i].height
      x += (@canvas.height / @pictures[i].height * @pictures[i].width) + 10
      @stage.addChild(bitmap)
    @maxPos = x - @canvas.width

  tick: () ->
#    direction = -(gallery.stage.mouseX - (gallery.canvas.width / 2 ) ) / ((gallery.canvas.width / 2)/ 10)
    direction = -(gallery.stage.mouseX - (gallery.camera.width / 2 ) ) / ((gallery.camera.width / 2)/ 10) - 10
    console.log(direction)
    if (@pos + direction > -@maxPos && @pos + direction < 0 )
      @pos += direction
    if (@pos + direction <= -@maxPos)
      direction = -@pos - @maxPos
      @pos = -@maxPos
    if (@pos + direction >= 0)
      direction = -@pos
      @pos = 0
    for i in [0..gallery.pictures.length-1]
      gallery.stage.children[i].x = gallery.stage.children[i].x + direction
    gallery.stage.tick()

gallery = new Gallery