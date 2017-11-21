"use strict"
var UIManager=function(){
  this.panels=[];
}

UIManager.prototype.clear=function(){
  this.panels=[];
}

UIManager.prototype.addPanel=function(panel){
  this.panels.push(panel);
}

UIManager.prototype.render=function(display){
  for(var i in this.panels){
    this.panels[i].render(display);
  }
}

UIManager.prototype.update=function(){
  for(var i in this.panels){
    this.panels[i].update();
  }
}



//UIPanel




function UIPanel(image,x,y,width,height){
  this.components=[];
  this.image=image;
  this.pos=new Vector2d(x,y);
  this.width=width;
  this.height=height;
}

UIPanel.prototype.addComponent=function(component){
  component.init(this);
  this.components.push(component);
}

UIPanel.prototype.render=function(display){
  if(this.image!==null){
    display.renderBuffer(this.image,this.pos.x,this.pos.y,this.width,this.height);
  }
  for(var i in this.components){
    this.components[i].render(display,this.pos.x,this.pos.y);
  }
}

UIPanel.prototype.update=function(){
  for(var i in this.components){
    this.components[i].update();
  }
}






//UIComponent






function UIComponent(image,x,y,width,height){
  this.image=image;
  this.pos=new Vector2d(x,y);
  this.width=width;
  this.height=height;
  this.panel;
}

UIComponent.prototype.init=function(uiPanel){
  this.panel=uiPanel;
}

UIComponent.prototype.render=function(display,xOffset,yOffset){
  display.renderBuffer(this.image,xOffset+this.pos.x,yOffset+this.pos.y,this.width,this.height);
}

UIComponent.prototype.update=function(){

}
