"use strict"
function Block(image,x,y,width,height,accel){
  MoveEntity.apply(this,[x,y,width,height,accel]);
  this.image=image;
  this.G=0;
}

//상속과정
inherit(MoveEntity,Block);

function StaticBlock(image,x,y,width,height){
  Block.apply(this,[image,x,y,width,height,0]);
}

//상속과정
inherit(Block,StaticBlock);

StaticBlock.prototype.update=function(){

};

StaticBlock.prototype.render=function(camera,display){
  display.renderCamera(camera,this.image,this.pos.x,this.pos.y,this.width,this.height,0,new Vector2d(1,1));
}
