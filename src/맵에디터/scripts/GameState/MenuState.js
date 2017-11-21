"use strict"

function MenuState(){

}

inherit(GameState,MenuState);

MenuState.prototype.init=function(){
  console.log("MENU_STATE");
  var mainPanel=new UIPanel(imageLoader.get("blankImage.png"),display.getWidth()/2-100,100,200,700);
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
      gsm.setState(GameState.MAIN_STATE);
      console.log("press");
    },
    released:function(uiButton){
      console.log("release");
    }
  }));
  uiManager.addPanel(mainPanel);
}
MenuState.prototype.reset=function(){
  Entity.clear();
  uiManager.clear();
}
MenuState.prototype.update=function(){
  uiManager.update();
  if(isKeyPressed(32)){
    gsm.setState(GameState.MAIN_STATE);
  }
}
MenuState.prototype.render=function(display){
  uiManager.render(display);
}
