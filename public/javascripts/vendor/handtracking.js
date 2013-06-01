
var HT = HT || {};

HT.Tracker = function(){

  this.mask = new CV.Image();
  this.skinner = new HT.Skinner();

};

HT.Tracker.prototype.detect = function(image){
  if( !this.image_old) this.image_old=image
  this.skinner.maskmove(image,this.image_old, this.mask);
  this.image_old=image


  a=this.mask
  return this.mask
};



HT.Skinner = function(){
};


HT.Skinner.prototype.maskmove = function(oldSrc,imageSrc, imageDst){
    var src = imageSrc.data, old = oldSrc.data, dst = imageDst.data, len = src.length,
        i = 0, j = 0,
        dr, dg, db, value;

    for(; i < len; i += 4){
        dr = Math.abs(src[i]-old[i]);
        dg = Math.abs(src[i+1]-old[i+1]);
        db = Math.abs(src[i+2]-old[i+2]);


        value = 0;

        if (dr+dg+db >50){
                        value=255
        }



        dst[j ++] = value;
    }

    imageDst.width = imageSrc.width;
    imageDst.height = imageSrc.height;

    return imageDst;
};

