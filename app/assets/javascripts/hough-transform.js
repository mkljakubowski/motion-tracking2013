'use strict';

var numAngleCells = 360;
var drawingWidth = 800;
var drawingHeight = 600;
var rhoMax = Math.sqrt(drawingWidth * drawingWidth + drawingHeight * drawingHeight);

// Precalculate tables.
var cosTable = Array(numAngleCells);
var sinTable = Array(numAngleCells);
for (var theta = 0, thetaIndex = 0; thetaIndex < numAngleCells; theta += Math.PI / numAngleCells, thetaIndex++) {
  cosTable[thetaIndex] = Math.cos(theta);
  sinTable[thetaIndex] = Math.sin(theta);
}

// Implementation with lookup tables.
function hough(image){
    var accum = Array(numAngleCells);

    for(var x = 0 ; x < image.length ; x++){
        for(var y = 0 ; y < image[x].length ; y++){
            if(image[x][y]){
                houghAcc(x, y);
            }
        }
    }

    function houghAcc(x, y) {
        var rho;
        var thetaIndex = 0;
        x -= drawingWidth / 2;
        y -= drawingHeight / 2;
        for (; thetaIndex < numAngleCells; thetaIndex++) {
            rho = rhoMax + x * cosTable[thetaIndex] + y * sinTable[thetaIndex];
            rho >>= 1;
            if (accum[thetaIndex] == undefined) accum[thetaIndex] = [];
            if (accum[thetaIndex][rho] == undefined) {
                accum[thetaIndex][rho] = 1;
            } else {
                accum[thetaIndex][rho]++;
            }
        }
    }

    return accum;
}
