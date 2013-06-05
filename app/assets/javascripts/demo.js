var DEMO = function () {
};

DEMO.prototype.start = function () {
    var that = this;
    this.video = document.getElementById("video");

    this.canvas = document.getElementById("canvas");
    this.canvas.height = $("#canvas").height();
    this.canvas.width = $("#canvas").width();
    this.context = this.canvas.getContext("2d");
    this.cameraCanvas = document.getElementById("camera");
    this.cameraCanvas.height = $("#camera").height();
    this.cameraCanvas.width = $("#camera").width();
    this.cameraCtx = this.cameraCanvas.getContext("2d");
    this.colorToSwap = 50;
    $('#threshold').prop("value", this.colorToSwap);

    this.oldImage = undefined;
    this.oldFiltered = undefined;

    this.pixelsToSwap = 1000;

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
    this.ready = true;
    if (window.webkitURL) {
        this.video.src = window.webkitURL.createObjectURL(stream);
    } else {
        this.video.src = stream;
    }
    this.tick();
};

DEMO.prototype.videoError = function (error) {
    console.error("Video access refused!");
};

DEMO.prototype.moveTo = function (center) {
    gallery.onMouseMove({pageX: center.x, pageY: center.Y});
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
        this.blackBoreder(filtered);
        this.dropSingle(filtered);
        var avg = this.weightCenter(filtered);
        this.drawCross(filtered, avg.x, avg.y, 255, 0, 0);
        this.context.putImageData(filtered, 0, 0);
        this.moveTo(avg);
    }
};

DEMO.prototype.drawCross = function(imageData, x, y, r, g, b) {
    this.setPixel(imageData, x, y, 255, 0, 0, 255);
    this.setPixel(imageData, x-1, y, 255, 0, 0, 255);
    this.setPixel(imageData, x+1, y, 255, 0, 0, 255);
    this.setPixel(imageData, x, y-1, 255, 0, 0, 255);
    this.setPixel(imageData, x, y+1, 255, 0, 0, 255);
};

DEMO.prototype.setPixel = function(imageData, x, y, r, g, b, a) {
    var index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
};

DEMO.prototype.getPixel = function(imageData, x, y) {
    var index = (x + y * imageData.width) * 4;
    return { r: imageData.data[index+0], g: imageData.data[index+1], b: imageData.data[index+2]};
};

DEMO.prototype.filter = function (image) {
    if (this.oldImage) {
        var data = image.data, output = this.cameraCtx.createImageData(image.width, image.height), i = 0, r, g, b, diff = 0;
        for (i = 0; i < image.data.length; i += 4) {
            r = Math.abs(data[i] - this.oldImage.data[i]);
            g = Math.abs(data[i+1] - this.oldImage.data[i+1]);
            b = Math.abs(data[i+2] - this.oldImage.data[i+2]);
            if (r + g + b > this.colorToSwap) {
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
        if(diff > this.pixelsToSwap || !this.oldFiltered){
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

DEMO.prototype.perPixel = function (image, fn) {
    var data = image.data, i, x=0, y=0, w = image.width;
    for(i = 0 ; i < data.length ; i+=4){
        var ret = fn(x, y, data[i], data[i+1], data[i+2]);
        if(ret !== undefined){
            data[i] = ret.r;
            data[i+1] = ret.g;
            data[i+2] = ret.b;
            data[i+3] = 255;
        }
        x++;
        if(x>=w){
            x-=w;
            y++;
        }
    }
};

DEMO.prototype.blackBoreder = function(image){
    this.perPixel(image, function(x, y, r, g, b){
        if(x==0 || x==image.width-1 || y==0 || y==image.height-1){
            return {r:0,g:0,b:0};
        }else{
            return {r:r,g:g,b:b};
        }
    });
};

DEMO.prototype.dropSingle = function(image){
    var self = this;
    this.perPixel(image, function(x, y, r, g, b){
        if(x==0 || x==image.width-1 || y==0 || y==image.height-1){
        }else{
            if(r==255 && g==255 && b==255){
                if(self.getPixel(image,x,y+1).r==0 && self.getPixel(image,x,y-1).r==0 && self.getPixel(image,x+1,y).r==0 && self.getPixel(image,x-1,y).r==0){
                    return {r:0,g:0,b:0};
                }
            }
        }
    });
};

DEMO.prototype.weightCenter = function (image) {
    var xa=0, ya= 0, c=0;
    this.perPixel(image, function(x, y, r, g, b){
        if(r>100){
            xa+=x;
            ya+=y;
            c++;
        }
    });
    xa/=c;
    ya/=c;
    return {x: Math.floor(xa), y: Math.floor(ya)};
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
    demo = new DEMO();
    demo.start();
};

$('#threshold').change(function (){
    demo.colorToSwap = parseInt($('#threshold').prop("value"));
});