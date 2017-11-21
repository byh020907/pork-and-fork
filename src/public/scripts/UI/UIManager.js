"use strict"
function UIManager(){
  this.panels=[];
}

UIManager.prototype.clear=function(){
  this.panels=[];
}

UIManager.prototype.addPanel=function(panel){
  this.panels.push(panel);
}

UIManager.prototype.render=function(display){
  for(var panel of this.panels){
    panel.render(display);
  }
}

UIManager.prototype.update=function(){
  for(var panel of this.panels){
    panel.update();
  }
}






//UIComponent





function UIComponent(texture,x,y,width,height){
  GameObject.apply(this,[]);

  if(texture!=null)
      this.model=new Model(this,texture);

  this.body=new UIBody(this);
  this.body.pos.x=x+width/2;
  this.body.pos.y=y+height/2;
  this.body.width=width;
  this.body.height=height;

  this.collision=new AABB(this,this.body);

  this.panel;

}

inherit(GameObject,UIComponent);

UIComponent.prototype.super_render=function(){
  GameObject.prototype.render.apply(this,arguments);
}

UIComponent.prototype.setTexture=function(texture){
  this.model.setTexture(texture);
}

UIComponent.prototype.init=function(uiPanel){
  this.panel=uiPanel;
}

//Body의 pos는 실제 렌더링 할때의 값, 실제 사용할때는 아래 메서드 사용하여 왼쪽상단의 좌표를 리턴해준다//UI는 무조건 왼쪽상단이 기준
UIComponent.prototype.getX=function(){
  return this.body.pos.x-this.body.width/2;
}

UIComponent.prototype.getY=function(){
  return this.body.pos.y-this.body.height/2;
}

UIComponent.prototype.setX=function(x){
  this.body.pos.x=x+this.body.width/2;
}

UIComponent.prototype.setY=function(y){
  this.body.pos.y=y+this.body.height/2;
}

UIComponent.prototype.render=function(display, xOffset, yOffset){
  this.model.render(display.getProjection(),xOffset+this.body.pos.x,yOffset+this.body.pos.y,this.body.width,this.body.height,this.body.rotateAngle);

  this.collision.update(xOffset+this.body.pos.x,yOffset+this.body.pos.y,this.body.width,this.body.height);
}

UIComponent.prototype.update=function(){

}




//UIPanel



function UIPanel(texture,x,y,width,height){
  UIComponent.apply(this,[texture,x,y,width,height]);
  this.components=[];
  this.hasTexture;
  if(texture!=null)this.hasTexture=true;
        else this.hasTexture=false;
}

inherit(UIComponent,UIPanel);

UIPanel.prototype.addComponent=function(component){
  component.init(this);
  this.components.push(component);
}

UIPanel.prototype.clear=function(){
  this.components=[];
}

//루트 판넬일때만
UIPanel.prototype.render=function(display,xOffset,yOffset){
  var a=arguments;
  switch (a.length) {
    case 1:{
      if(this.hasTexture)
      this.super_render(display.getProjection());

      for(var i in this.components){
        this.components[i].render(display,this.getX(),this.getY());
      }
    }break;

    case 3:{
      if(this.hasTexture) {
          this.model.render(display.getProjection(),xOffset+this.body.pos.x,yOffset+this.body.pos.y,this.body.width,this.body.height,this.body.rotateAngle);
      }

      for(var i in this.components){
        this.components[i].render(display,xOffset+this.getX(),yOffset+this.getY());
      }
    }break;

    default: OverloadingException();

  }

}

UIPanel.prototype.update=function(){
  for(var i in this.components){
    this.components[i].update();
  }
}
