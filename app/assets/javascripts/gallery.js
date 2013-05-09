
var current=0;
var max=4;

function loadImages() {
    var highlightContainer = document.getElementById("highlight");

    var imageContainer = document.getElementById("list");

    images=new Array();
    images[0] = "/assets/images/pic1.jpg";
    images[1] = "/assets/images/pic2.jpg";
    images[2] = "/assets/images/pic3.jpg";
    images[3] = "/assets/images/pic4.jpg";
    images[4] = "/assets/images/pic5.jpg";

    var tmpImage = document.createElement("img");
    tmpImage.setAttribute("src", images[0]);
    tmpImage.setAttribute("width", "400px");
    tmpImage.setAttribute("height", "400px");
    tmpImage.setAttribute("id", "thePicture");
    highlightContainer.appendChild(tmpImage);

    for(var i = 0; i < images.length; i++) {
        var newImage = document.createElement("img");
        newImage.setAttribute("src", images[i]);
        newImage.setAttribute("width", "200px");
        newImage.setAttribute("height", "200px");


//        newImage.onclick = function() {
//            console.log("clicked!");
//            var tmpImage = document.createElement("img");
//            var src=this.getAttribute("src");
//            tmpImage.setAttribute("src", src);
//            tmpImage.setAttribute("width", "400px");
//            tmpImage.setAttribute("height", "400px");
//            $('#highlight').empty();
//            highlightContainer.appendChild(tmpImage);
//        };


        imageContainer.appendChild(newImage);
    }

}

function right() {
      if(current<max){
          var highlightContainer = document.getElementById("thePicture");
          current++;
          var tmpImage = document.getElementById("thePicture");
          tmpImage.setAttribute("src", images[current]);
      }
}

function left() {
    if(current>0){
        current--;
        var tmpImage = document.getElementById("thePicture");
        tmpImage.setAttribute("src", images[current]);
    }
}