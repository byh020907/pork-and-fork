"use strict"

function MainState(){

  this.camera=new Camera(new Vector2d(0,0),display);

  this.firstClickPos=new Vector2d(0,0);
  this.lastPos=new Vector2d(0,0);

  this.select=false;
}

inherit(GameState,MainState);

MainState.prototype.init=function(){
  console.log("MAIN_STATE");
  var mainPanel=new UIPanel(imageLoader.get("blankImage.png"),display.getWidth()-200,0,200,display.getHeight());
  mainPanel.addComponent(new UIButton(imageLoader.get("cloud.png"),0,0,200,100,{
    entered:function(uiButton){
      uiButton.width=200/1.1;
      uiButton.height=100/1.1;
      console.log("enter");
    },
    exited:function(uiButton){
      uiButton.width=200;
      uiButton.height=100;
      console.log("exit");
    },
    pressed:function(uiButton){
      var errorFlag=false;
      var content="";
      for(var id in Entity.list){
        var e=Entity.list[id];

        if(e.width<=0||e.height<=0)
          errorFlag=true;

        content+="new StaticBlock("+'imageLoader.get("castle_bricks.png"),'+
         Math.floor(e.pos.x) + "," +
         Math.floor(e.pos.y) + "," +
         Math.floor(e.width) + "," +
         Math.floor(e.height)+
         ");"
         content+="\n";
      }

      if(errorFlag)
        alert("크기가 음수인 오브젝트가 있습니다.(드래그를 왼쪽상단 부터 오른쪽 하단방향으로 하세요)");

      window.mapdata.value=content;
      console.log("press");
    },
    released:function(uiButton){
      console.log("release");
    }
  }));
  uiManager.addPanel(mainPanel);

  new StaticBlock(imageLoader.get("cloud.png"),0,0,50,50);

  var mapdata
}
MainState.prototype.reset=function(){
  Entity.clear();
  uiManager.clear();
}
MainState.prototype.update=function(){
  if(isMousePressed(1)){
    //create
    if(isKeyDown(67)){
      this.select=true;
      this.firstClickPos=new Vector2d(this.camera.pos.x+(-display.getWidth()/2+getMouseX())/this.camera.zoomScale.x,this.camera.pos.y+(-display.getHeight()/2+getMouseY())/this.camera.zoomScale.y);
    }
    //delete
    if(isKeyDown(68)){
      for(var id in Entity.list){
        var e=Entity.list[id];
        if(hitTestPoint(e,this.lastPos,1)){
          e.remove();
        }
      }
    }
  }

  this.lastPos=new Vector2d(this.camera.pos.x+(-display.getWidth()/2+getMouseX())/this.camera.zoomScale.x,this.camera.pos.y+(-display.getHeight()/2+getMouseY())/this.camera.zoomScale.y);

  if(isMouseReleased(1)){
    if(isKeyDown(67)){
      this.select=false;

      var width=this.lastPos.x-this.firstClickPos.x;
      var height=this.lastPos.y-this.firstClickPos.y;

      if(width>0&&height>0)
      new StaticBlock(imageLoader.get("castle_bricks.png"),this.firstClickPos.x+width/2,this.firstClickPos.y+height/2,width,height);
    }
  }

  //camera move
  if(isKeyDown(37)){
    this.camera.move(180,5);
  }

  if(isKeyDown(38)){
    this.camera.move(270,5);
  }

  if(isKeyDown(39)){
    this.camera.move(0,5);
  }

  if(isKeyDown(40)){
    this.camera.move(90,5);
  }

  //zoom
  if(isKeyPressed(90)){
    this.camera.setZoom(this.camera.zoomScale.add(new Vector2d(0.1,0.1)));
  }

  //unzoom
  if(isKeyPressed(88)){
    this.camera.setZoom(this.camera.zoomScale.add(new Vector2d(-0.1,-0.1)));
  }

  Entity.updateAll();
  uiManager.update();
}
MainState.prototype.render=function(display){
  if(this.select){
    display.fillRect(this.camera,this.firstClickPos.x,this.firstClickPos.y,this.lastPos.x-this.firstClickPos.x,this.lastPos.y-this.firstClickPos.y,"rgba(255,255,0,0.5)");
  }
  Entity.renderAll(this.camera,display);
  uiManager.render(display);
}
