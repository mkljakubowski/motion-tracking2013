video = document.getElementById('video')
canvas = document.getElementById('canvas')
ctx = canvas.getContext('2d')
ccanvas = document.getElementById('comp')
cctx = ccanvas.getContext('2d')
compression = 3
width = height = 0
last = false
thresh = 140
down = false
wasdown = false
movethresh = 2
brightthresh = 300
overthresh = 1000
avg = 0
state = 0  //States: 0 waiting for gesture, 1 waiting for next move after gesture, 2 waiting for gesture to end

navigator.webkitGetUserMedia({audio: true, video: true}, function (stream) {
    video.src = window.webkitURL.createObjectURL(stream)
    video.addEventListener('play',
        function () {
            setInterval(dump, 1000 / 25)
        }
    )
}, function () {
    console.log('OOOOOOOH! DEEEEENIED!')
})

function dump() {
    if (canvas.width != video.videoWidth) {
        width = Math.floor(video.videoWidth / compression)
        height = Math.floor(video.videoHeight / compression)
        canvas.width = ccanvas.width = width
        canvas.height = ccanvas.height = height
    }
    ctx.drawImage(video, 0, height, width, -height)
    draw = ctx.getImageData(0, 0, width, height)
    test()
}

function test() {
    delt = ctx.createImageData(width, height)
    if (last !== false) {
        var totalx = 0,
            totaly = 0,
            totald = 0,
            totaln = delt.width * delt.height,
            pix = totaln * 4;
        while (pix -= 4) {
            var d = Math.abs(draw.data[pix] - last.data[pix]) +
                    Math.abs(draw.data[pix + 1] - last.data[pix + 1]) +
                    Math.abs(draw.data[pix + 2] - last.data[pix + 2])
            if (d > thresh) {
                delt.data[pix]     = 160
                delt.data[pix + 1] = 255
                delt.data[pix + 2] = 255
                delt.data[pix + 3] = 255
                totald += 1
                totalx += ((pix / 4) % width)
                totaly += (Math.floor((pix / 4) / delt.height))
            } else {
                delt.data[pix]     = 0
                delt.data[pix + 1] = 0
                delt.data[pix + 2] = 0
                delt.data[pix + 3] = 0
            }
        }
    }
    if (totald) {
        down = {
            x: totalx / totald,
            y: totaly / totald,
            d: totald
        }
        handledown()
    }
    last = draw
    cctx.putImageData(delt, 0, 0) //shadow of motion
}

function calibrate() {
    wasdown = {
        x: down.x,
        y: down.y,
        d: down.d
    }
}

function handledown() {
    avg = 0.9 * avg + 0.1 * down.d
    var davg = down.d - avg
    var good = davg > brightthresh
    switch (state) {
        case 0:
            if (good) { //Found a gesture, waiting for next move
                state = 1
                calibrate()
            }
            break;
        case 2: //Wait for gesture to end
            if (!good) { //Gesture ended
                state = 0
            }
            break;
        case 1: //Got next move, do something based on direction
            var dx = down.x - wasdown.x,
                dy = down.y - wasdown.y;
            var dirx = Math.abs(dy) < Math.abs(dx) //(dx,dy) is on a bowtie
            if (dx < -movethresh && dirx) {
                left()
            } else if (dx > movethresh && dirx) {
                right()
            }
            if (dy > movethresh && !dirx) {
                if (davg > overthresh) {
                    Controls.steady()
                } else {
                    Controls.down()
                }
            } else if (dy < -movethresh && !dirx) {
                if (davg > overthresh) {
                    Controls.steady()
                } else {
                    Controls.up()
                }
            }
            state = 2
            break;
    }
}
