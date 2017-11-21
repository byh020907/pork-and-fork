"use strict"

function Box(x,y,width,height){
  Entity.apply(this,[]);
  this.body=new MoveBody(this);
  this.body.pos.x=x;
  this.body.pos.y=y;
  this.body.width=width;
  this.body.height=height;

  this.model=new Model(this,TextureLoader.get("images/blankImage.png"));

  this.collision=new AABB(this,this.body);
}

inherit(Entity,Box);

Box.prototype.setBounds=function(){

}

Box.prototype.move = function (rad) {
  this.body.move(rad);
};

Box.prototype.update=function(){
  this.body.update();
}

Box.prototype.hitProcess=function(e){
  // this.body.width=this.body.height=(200-this.body.width)*0.05+this.body.width;
  // if(this.body.width>190)
  //   this.remove();

  this.body.height+=5;
  if(this.body.height>990)
    this.remove();
}
