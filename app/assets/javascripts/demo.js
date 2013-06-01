var DEMO = function(){};

DEMO.prototype.start = function() {
    var that = this;

    this.tracker = new HT.Tracker( {fast: true} );

    this.video = document.getElementById("video");
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
    this.context.scale(1, -1);

    this.canvas.width = parseInt(this.canvas.style.width) / 2;
    this.canvas.height = parseInt(this.canvas.style.height) / 2;

    that.image = that.context.createImageData(that.canvas.width * 0.2, that.canvas.height * 0.2);

    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia;
    if (navigator.getUserMedia){
        navigator.getUserMedia({video:true},
            function(stream){ return that.videoReady(stream); },
            function(error){ return that.videoError(error); } );
    }
    this.middle = {x:0,y:0};
};

DEMO.prototype.videoReady = function(stream){
    if (window.webkitURL) {
        this.video.src = window.webkitURL.createObjectURL(stream);
    } else {
        this.video.src = stream;
    }

    this.tick();
};

DEMO.prototype.videoError = function(error){ };

DEMO.prototype.tick = function(){
    var that = this, image, candidate;

    requestAnimationFrame( function() { return that.tick(); } );

    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA){
        image = this.snapshot();
        candidate = this.tracker.detect(image);
        this.draw(candidate);
    }
};

DEMO.prototype.snapshot = function(){
    this.context.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
    return this.context.getImageData(0, 0, this.canvas.width, this.canvas.height);
};

DEMO.prototype.draw = function(candidate){
    if(candidate){
        var newAvg = {x:0, y:0};
        for(var i = 0 ; i < candidate.contour.length ; i++){
            newAvg.x += candidate.contour[i].x;
            newAvg.y += candidate.contour[i].y;
        }
        newAvg.x /= candidate.contour.length;
        newAvg.y /= candidate.contour.length;
        this.drawHull(candidate.hull, "red");
    }
};

DEMO.prototype.drawHull = function(hull, color){
    var len = hull.length, i = 1;

    if (len > 0){
        this.context.beginPath();
        this.context.strokeStyle = color;

        this.context.moveTo(hull[0].x, hull[0].y);
        for (; i < len; ++ i){
            this.context.lineTo(hull[i].x, hull[i].y);
        }

        this.context.stroke();
        this.context.closePath();
    }
};

DEMO.prototype.drawDefects = function(defects, color){
    var len = defects.length, i = 0, point;

    if (len > 0){
        this.context.beginPath();
        this.context.strokeStyle = color;

        for (; i < len; ++ i){
            point = defects[i].depthPoint;
            this.context.strokeRect(point.x - 2, point.y - 2, 4, 4);
        }

        this.context.stroke();
        this.context.closePath();
    }
};

DEMO.prototype.createImage = function(imageSrc, imageDst){
    var src = imageSrc.data, dst = imageDst.data,
        width = imageSrc.width, span = 4 * width,
        len = src.length, i = 0, j = 0, k = 0;

    for(i = 0; i < len; i += span){

        for(j = 0; j < width; j += 5){

            dst[k] = dst[k + 1] = dst[k + 2] = src[i];
            dst[k + 3] = 255;
            k += 4;

            i += 5;
        }
    }

    return imageDst;
};

window.onload = function(){
    var demo = new DEMO();
    demo.start();
};