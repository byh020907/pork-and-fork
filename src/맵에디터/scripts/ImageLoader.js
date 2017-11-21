"use strict"

var ImageLoader=function(){
  this.images={};
}

ImageLoader.prototype.load=function(src){
  var image=new Image();
  image.src=src;

  var names=src.split('/');
  var name=names[names.length-1];

  this.images[name]=image;
}

ImageLoader.prototype.get=function(name){
  return this.images[name];
}

var imageLoader=new ImageLoader();
imageLoader.load("../images/cloud.png");
imageLoader.load("../images/blankImage.png");
imageLoader.load("../images/회오리.png");
imageLoader.load("../images/player6.png");
imageLoader.load("../images/cuby.png");
imageLoader.load("../images/Cutter Kirby.png");
imageLoader.load("../images/flyingGhost.png");
imageLoader.load("../images/castle_bricks.png");
