"use strict"

function Camera(pos,display){
  this.pos=pos
  this.zoomScale=new Vector2d(1,1);
  this.width=display.getWidth();
  this.height=display.getHeight();
}

Camera.prototype.follow=function(entity,rate){
  this.pos.x+=(entity.pos.x-this.pos.x)*rate;
  this.pos.y+=(entity.pos.y-this.pos.y)*rate;
}

Camera.prototype.move=function(angle,speed){
  var rad=angle*Math.PI/180;
  this.pos.x+=Math.cos(rad)*speed;
  this.pos.y+=Math.sin(rad)*speed;
}

Camera.prototype.setPos=function(pos){
  this.pos=pos.clone();
}

Camera.prototype.setZoom=function(scale){
  this.zoomScale=scale.clone();
}

Camera.prototype.getRenderData=function(){
  var a=arguments;
  switch (a.length) {

    case 3:{
      var pos=new Vector2d((a[0].x-this.pos.x)*this.zoomScale.x+this.width/2,(a[0].y-this.pos.y)*this.zoomScale.y+this.height/2);
      var width=a[1]*this.zoomScale.x;
      var height=a[2]*this.zoomScale.y;

      return {pos:pos,width:width,height:height};
    }break;

    case 4:{
      var x=(a[0]-this.pos.x)*this.zoomScale.x+this.width/2;
      var y=(a[1]-this.pos.y)*this.zoomScale.y+this.height/2;
      var width=a[2]*this.zoomScale.x;
      var height=a[3]*this.zoomScale.y;

      return {x:x,y:y,width:width,height:height};
    }break;

    default:console.log("Camera.getRenderData()::overloding fail::woung parameter num");
  }

}
