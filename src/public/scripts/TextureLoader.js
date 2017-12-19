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
TextureLoader.load("images/P&F-Sprite.png");

Sprite.PAF_LOGO=new Sprite(TextureLoader.get("images/P&F-Sprite.png"),0,0,556,335,true);
Sprite.BROWN=new Sprite(TextureLoader.get("images/P&F-Sprite.png"),0,335/1024,87/1024,422/1024);
Sprite.YELLOW=new Sprite(TextureLoader.get("images/P&F-Sprite.png"),0,0,1,1);
Sprite.SLIGHTLY_GRAY=new Sprite(TextureLoader.get("images/P&F-Sprite.png"),0,0,1,1);
Sprite.GREEN=new Sprite(TextureLoader.get("images/P&F-Sprite.png"),261,335,348,422,1);
Sprite.BEIGE=new Sprite(TextureLoader.get("images/P&F-Sprite.png"),0,0,1,1);
Sprite.WHITE=new Sprite(TextureLoader.get("images/P&F-Sprite.png"),0,0,1,1);
Sprite.GRAY=new Sprite(TextureLoader.get("images/P&F-Sprite.png"),0,0,1,1);
