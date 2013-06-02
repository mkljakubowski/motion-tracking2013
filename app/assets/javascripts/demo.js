var DEMO = function () {
};

DEMO.prototype.start = function () {
    var that = this;

    this.video = document.getElementById("video");
    this.canvas = document.getElementById("canvas");
    this.cameraCanvas = document.getElementById("camera");
    this.context = this.canvas.getContext("2d");
    this.cameraCtx = this.cameraCanvas.getContext("2d");
    this.oldImage = undefined;
    this.oldFiltered = undefined;

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    if (navigator.getUserMedia) {
        navigator.getUserMedia({video: true},
            function (stream) {
                return that.videoReady(stream);
            },
            function (error) {
                return that.videoError(error);
            });
    }
};

DEMO.prototype.videoReady = function (stream) {
    if (window.webkitURL) {
        this.video.src = window.webkitURL.createObjectURL(stream);
    } else {
        this.video.src = stream;
    }
    this.tick();
};

DEMO.prototype.videoError = function (error) {
};

DEMO.prototype.tick = function () {
    var that = this, image, candidate;

    requestAnimationFrame(function () {
        return that.tick();
    });

    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
        image = this.snapshot();
        this.draw(this.filter(image));
    }
};

DEMO.prototype.snapshot = function () {
    this.cameraCtx.drawImage(this.video, 0, 0, this.cameraCanvas.width, this.cameraCanvas.height);
    return this.cameraCtx.getImageData(0, 0, this.cameraCanvas.width, this.cameraCanvas.height);
};

DEMO.prototype.draw = function (filtered) {
    if (filtered) {
        this.context.putImageData(filtered, 0, 0);
    }
};

DEMO.prototype.filter = function (image) {
    if (this.oldImage) {
        var data = image.data, output = this.cameraCtx.createImageData(image.width, image.height), i = 0, r, g, b, diff = 0;
        for (i = 0; i < image.data.length; i += 4) {
            r = Math.abs(data[i] - this.oldImage.data[i]);
            g = Math.abs(data[i+1] - this.oldImage.data[i+1]);
            b = Math.abs(data[i+2] - this.oldImage.data[i+2]);
            if (r + g + b > 50) {
                output.data[i] = 255;
                output.data[i+1] = 255;
                output.data[i+2] = 255;
                output.data[i+3] = 255;
                diff++;
            }else{
                output.data[i] = 0;
                output.data[i+1] = 0;
                output.data[i+2] = 0;
                output.data[i+3] = 255;
            }
        }
        this.oldImage = image;
        if(diff > 500 || !this.oldFiltered){
            this.oldFiltered = output;
            return output;
        }else{
            return this.oldFiltered;
        }
    } else {
        this.oldImage = image;
        return image;
    }
};

DEMO.prototype.createImage = function (imageSrc, imageDst) {
    var src = imageSrc.data, dst = imageDst.data,
        width = imageSrc.width, span = 4 * width,
        len = src.length, i = 0, j = 0, k = 0;

    for (i = 0; i < len; i += span) {
        for (j = 0; j < width; j += 5) {
            dst[k] = dst[k + 1] = dst[k + 2] = src[i];
            dst[k + 3] = 255;
            k += 4;
            i += 5;
        }
    }
    return imageDst;
};

window.onload = function () {
    var demo = new DEMO();
    demo.start();
};