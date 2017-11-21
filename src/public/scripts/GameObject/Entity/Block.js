"use strict"
function Block(sx,sy,fx,fy){
  Entity.apply(this,[]);
  this.body=new MoveBody(this);
  this.body.width=fx-sx;
  this.body.height=fy-sy;
  this.body.pos.x=sx+this.body.width/2;
  this.body.pos.y=sy+this.body.height/2;
  this.body.setMass(10);

  this.model=new Model(this,TextureLoader.get("images/blankImage.png"));

  this.collision=new AABB(this,this.body);
}

inherit(Entity,Block);

Block.prototype.update=function(){
  this.body.update();
}
