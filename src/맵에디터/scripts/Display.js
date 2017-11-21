"use strict"
//static
var Display=function(width,height){

  this.canvas;
  this.canvasCtx;

  this.canvasBuffer;
  this.bufferCtx;

  this.canvas=document.createElement("canvas");
  this.canvas.id="gameScreen";
  this.canvas.style.position="absolute";
  this.canvas.style.left="0px";
  this.canvas.style.top="0px";
  this.canvas.style.border="3px solid red";
  this.canvas.width=width;
  this.canvas.height=height;
  //html body에 삽입
  document.body.appendChild(this.canvas);
  this.canvasCtx=this.canvas.getContext("2d");
  //createElement는 인자값으로 만들 요소의 id 가아니라 종류가들어간다.
  this.canvasBuffer=document.createElement("canvas");
  this.canvasBuffer.width=this.canvas.width;
  this.canvasBuffer.height=this.canvas.height;
  this.bufferCtx=this.canvasBuffer.getContext("2d");

}

Display.prototype.getWidth=function(){
  return this.canvas.width;
}

Display.prototype.getHeight=function(){
  return this.canvas.height;
}

Display.prototype.clear=function(){
  this.canvasCtx.clearRect(0,0,this.canvas.width,this.canvas.height);
  this.bufferCtx.clearRect(0,0,this.canvasBuffer.width,this.canvasBuffer.height);
}

//buffer에서 그린 그림을 내보낸다.
Display.prototype.flush=function(){
  this.canvasCtx.drawImage(this.canvasBuffer,0,0);
}

Display.prototype.save=function(){
  this.bufferCtx.save();
}

Display.prototype.restore=function(){
  this.bufferCtx.restore();
}

Display.prototype.translate=function(){
  var a=arguments;
  switch (a.length) {
    case 1:{
      var pos=a[0];
      this.bufferCtx.translate(pos.x,pos.y);
    }break;

    case 2:{
      var x=a[0];
      var y=a[1];
      this.bufferCtx.translate(x,y);
    }break;

    default:console.log("Display.translate()::overloding fail::woung parameter num");
  }
}

Display.prototype.rotate=function(angle){
  this.bufferCtx.rotate(angle);
}

Display.prototype.scale=function(xscale,yscale){

  var a=arguments;
  switch (a.length) {
    case 1:{
      var scale=a[0];
      this.bufferCtx.scale(scale.x,scale.y);
    }break;

    case 2:{
      var xscale=a[0];
      var yscale=a[1];
      this.bufferCtx.scale(xscale,yscale);
    }break;

    default:console.log("Display.scale()::overloding fail::woung parameter num");
  }
}

Display.prototype.renderBuffer=function(){
  var a=arguments;
  switch (a.length) {
    case 5:{
      var image=a[0];
      var x=a[1];
      var y=a[2];
      var width=a[3];
      var height=a[4];
      this.bufferCtx.drawImage(image,x,y,width,height);
    }break;

    case 5+2:{
      var camera=a[0];
      var image=a[0];
      var x=a[1];
      var y=a[2];
      var width=a[3];
      var height=a[4];
      var angle=a[5];
      var scale=a[6];

      this.bufferCtx.save();
      this.bufferCtx.translate(x,y);
      this.bufferCtx.rotate(angle);
      this.bufferCtx.scale(scale.x,scale.y);
      this.bufferCtx.drawImage(image,-width/2,-height/2,width,height);
      this.bufferCtx.restore();
    }break;

    case 9:{
      var image=a[0];
      var sx=a[1];
      var sy=a[2];
      var swidth=a[3];
      var sheight=a[4];
      var x=a[1+4];
      var y=a[2+4];
      var width=a[3+4];
      var height=a[4+4];
      this.bufferCtx.drawImage(image,sx,sy,swidth,sheight,x,y,width,height);
    }break;

    case 9+2:{
      var image=a[0];
      var sx=a[1];
      var sy=a[2];
      var swidth=a[3];
      var sheight=a[4];
      var x=a[1+4];
      var y=a[2+4];
      var width=a[3+4];
      var height=a[4+4];
      var angle=a[5+4];
      var scale=a[6+4];

      this.bufferCtx.save();
      this.bufferCtx.translate(x,y);
      this.bufferCtx.rotate(angle);
      this.bufferCtx.scale(scale.x,scale.y);
      this.bufferCtx.drawImage(image,sx,sy,swidth,sheight,-width/2,-height/2,width,height);
      this.bufferCtx.restore();
    }break;

    default:console.log("Display.renderBuffer()::overloding fail::woung parameter num");
  }

}

Display.prototype.renderCamera=function(){
  var a=arguments;
  switch (a.length) {
    case 6:{
      var camera=a[0];
      var image=a[0+1];
      var x=a[1+1];
      var y=a[2+1];
      var width=a[3+1];
      var height=a[4+1];

      var renderData=camera.getRenderData(x,y,width,height);
      this.bufferCtx.drawImage(image,renderData.x,renderData.y,renderData.width,renderData.height);
    }break;

    case 10:{
      var camera=a[0];
      var image=a[0+1];
      var sx=a[1+1];
      var sy=a[2+1];
      var swidth=a[3+1];
      var sheight=a[4+1];
      var x=a[1+4+1];
      var y=a[2+4+1];
      var width=a[3+4+1];
      var height=a[4+4+1];

      var renderData=camera.getRenderData(x,y,width,height);
      this.bufferCtx.drawImage(image,sx,sy,swidth,sheight,renderData.x,renderData.y,renderData.width,renderData.height);
    }break;

    case 6+2:{
      var camera=a[0];
      var image=a[0+1];
      var x=a[1+1];
      var y=a[2+1];
      var width=a[3+1];
      var height=a[4+1];
      var angle=a[5+1];
      var scale=a[6+1];

      var renderData=camera.getRenderData(x,y,width,height);
      this.bufferCtx.save();
      this.bufferCtx.translate(renderData.x,renderData.y);
      this.bufferCtx.rotate(angle);
      this.bufferCtx.scale(scale.x,scale.y);
      this.bufferCtx.drawImage(image,-renderData.width/2,-renderData.height/2,renderData.width,renderData.height);
      this.bufferCtx.restore();
    }break;

    case 10+2:{
      var camera=a[0];
      var image=a[0+1];
      var sx=a[1+1];
      var sy=a[2+1];
      var swidth=a[3+1];
      var sheight=a[4+1];
      var x=a[1+4+1];
      var y=a[2+4+1];
      var width=a[3+4+1];
      var height=a[4+4+1];
      var angle=a[5+4+1];
      var scale=a[6+4+1];

      var renderData=camera.getRenderData(x,y,width,height);
      this.bufferCtx.save();
      this.bufferCtx.translate(renderData.x,renderData.y);
      this.bufferCtx.rotate(angle);
      this.bufferCtx.scale(scale.x,scale.y);
      this.bufferCtx.drawImage(image,sx,sy,swidth,sheight,-renderData.width/2,-renderData.height/2,renderData.width,renderData.height);
      this.bufferCtx.restore();
    }break;

    default:console.log("Display.renderCamera()::overloding fail::woung parameter num");
  }
}

Display.prototype.fillRect=function(x,y,width,height,color){

  var a=arguments;
  switch (a.length) {
    case 5:{
      var x=a[0];
      var y=a[1];
      var width=a[2];
      var height=a[3];
      var color=a[4];
      this.bufferCtx.fillStyle=color;
      this.bufferCtx.fillRect(x,y,width,height);
    }break;

    case 6:{
      var camera=a[0];
      var x=a[0+1];
      var y=a[1+1];
      var width=a[2+1];
      var height=a[3+1];
      var color=a[4+1];

      var renderData=camera.getRenderData(x,y,width,height);
      this.bufferCtx.fillStyle=color;
      this.bufferCtx.fillRect(renderData.x,renderData.y,renderData.width,renderData.height);
    }break;

    default:console.log("Display.scale()::overloding fail::woung parameter num");
  }

}
