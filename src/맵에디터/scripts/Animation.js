"use strict"
function Animation(){

  var a=arguments;

  this.currentFrame=0;

  this.mod=a.length;
  this.aspectRatio=0;

  this.finishFunction=function(){};

  switch (a.length) {

    case 2:{
      this.images=a[0];
      this.frameDelay=a[1];
      this.maxFrame=this.images.length-1;
    }break;

    case 6:{
      this.image=a[0];
      this.xSegment=a[1];
      this.ySegment=a[2];
      this.startFrame=this.currentFrame=a[3];
      this.maxFrame=a[4];
      this.frameDelay=a[5];
    }break;

    case 7:{
      this.image=a[0];
      this.startX=a[1];
      this.startY=a[2];
      this.width=a[3];
      this.height=a[4];
      this.maxFrame=a[5];
      this.frameDelay=a[6];
    }break;

    default:console.log("Animation()::overloding fail::woung parameter num");

  }

  this.frameCounter=this.currentFrame*this.frameDelay;
  this.stop=true;
  this.loop=false;

}

Animation.prototype.start=function(){
  if(this.stop){
    this.stop=false;
  }
}

Animation.prototype.restart=function(){
  if(this.stop){
    this.stop=false;
  }
  this.frameCounter=0;
}

Animation.prototype.play=function(){
  if(Math.floor(this.frameCounter++/this.frameDelay)>=this.maxFrame){
    this.frameCounter=0;
  }else if(this.stop){
    this.stop=false;
  }
}

Animation.prototype.stop=function(){
  if(!this.stop){
    this.stop=true;
    this.frameCounter=0;
  }
}

Animation.prototype.pause=function(){
  if(!this.stop){
    this.stop=true;
  }
}

Animation.prototype.render=function(camera,display,x,y,size,scale){
  var width=size;
  var height=size;

  if(this.mod==2){
    display.renderBuffer(this.images[this.currentFrame],-width/2,-height/2,width,height);
  }else if(this.mod==6){
    display.renderBuffer(this.image,(this.currentFrame%this.xSegment)*(this.image.width/this.xSegment),Math.floor(this.currentFrame/this.ySegment)*(this.image.height/this.ySegment),(this.image.width/this.xSegment),(this.image.height/this.ySegment),-width/2,-height/2,width,height);
  }else if(this.mod==7){
    // display.renderBuffer(this.image,this.startX+this.currentFrame*this.width,this.startY,this.width,this.height,-this.width*size/2,-this.height*size/2,this.width*size,this.height*size);
    display.renderCamera(camera,this.image,this.startX+this.currentFrame*this.width,this.startY,this.width,this.height,x,y,this.width*size,this.height*size,0,scale);
  }
}

Animation.prototype.update=function(){

  if(!this.stop){

    if(Math.floor(this.frameCounter++/this.frameDelay)<this.maxFrame){
      this.currentFrame=Math.floor(this.frameCounter++/this.frameDelay);
    }else{
      this.finishFunction();
      if(this.mod==2||this.mod==7){
        if(this.loop){
          this.frameCounter=0;
        }else{
          this.stop=true;
        }
      }else if(this.mod==6){
        if(this.loop){
          this.frameCounter=this.startFrame*this.frameDelay;
        }else{
          this.stop=true;
        }
      }
    }

  }

}
