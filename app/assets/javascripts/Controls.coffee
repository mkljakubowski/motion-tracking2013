class Controls
  constructor: ->
    Controls.steady()
    $(document).keydown(Controls.handleKeys)

  @left: ->
    $("#arrows").html(" &larr;");

  @right: ->
    $("#arrows").html(" &rarr;");

  @down: ->
    $("#arrows").html(" &darr;");

  @up: ->
    $("#arrows").html(" &uarr;");

  @clear: ->
    $("#arrows").html("");

  @steady: ->
    $("#arrows").html("&middot;");

  @handleKeys: (e) ->
    e = e || window.event

    if e.keyCode == 38
      Controls.up()
    else if e.keyCode == 40
      Controls.down()
    else if e.keyCode == 37
      Controls.left()
    else if e.keyCode == 39
      Controls.right()
    else if e.keyCode == 27
      Controls.clear()

new Controls() #to invoke constructor