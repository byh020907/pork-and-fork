"use strict"

var TextureLoader=(function(){
  var self=function(){
    this.list={};
  }

  self.prototype.load=function(src){
    this.list[src]=new Texture(src);
  }

  self.prototype.get=function(src){
    return this.list[src];
  }

  return new self();
}());

TextureLoader.load("images/blankImage.png");
TextureLoader.load("images/cloud.png");
TextureLoader.load("images/bat.png");
TextureLoader.load("images/cuby.png");
TextureLoader.load("images/circle.png");
TextureLoader.load("images/Pig1-Sheet.png");
var healthbarShape=new Shape();
