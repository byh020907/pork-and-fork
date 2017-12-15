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

UIManager.prototype.keyDown=function(e){
  for(var panel of this.panels){
    for(var component of panel.components){
      if(component instanceof UITextField)
        component.keyDown(e);
    }
  }
}

UIManager.prototype.keyUp=function(e){
  for(var panel of this.panels){
    for(var component of panel.components){
      if(component instanceof UITextField)
        component.keyUp(e);
    }
  }
}

UIManager.prototype.isKeyUp=function(e){
  for(var panel of this.panels){
    panel.update();
  }
}





//UIComponent





class UIComponent extends GameObject{
  constructor(texture,x,y,width,height){
    super();
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

  super_render(){
    GameObject.prototype.render.apply(this,arguments);
  }

  setTexture(texture){
    this.model.setTexture(texture);
  }

  init(uiPanel){
    this.panel=uiPanel;
  }

  //Body의 pos는 실제 렌더링 할때의 값, 실제 사용할때는 아래 메서드 사용하여 왼쪽상단의 좌표를 리턴해준다//UI는 무조건 왼쪽상단이 기준
  getX(){
    return this.body.pos.x-this.body.width/2;
  }

  getY(){
    return this.body.pos.y-this.body.height/2;
  }

  setX(x){
    this.body.pos.x=x+this.body.width/2;
  }

  setY(y){
    this.body.pos.y=y+this.body.height/2;
  }

  render(display, xOffset, yOffset){
    this.model.render(display.getProjection(),xOffset+this.body.pos.x,yOffset+this.body.pos.y,this.body.width,this.body.height,this.body.rotateAngle);

    this.collision.update(xOffset+this.body.pos.x,yOffset+this.body.pos.y,this.body.width,this.body.height);
  }

  update(){

  }

}




//UIPanel



class UIPanel extends UIComponent{
  constructor(texture,x,y,width,height){
    super(texture,x,y,width,height);
    this.components=[];
    this.hasTexture;
    if(texture!=null)this.hasTexture=true;
          else this.hasTexture=false;
  }

  addComponent(component){
    component.init(this);
    this.components.push(component);
  }

  clear(){
    this.components=[];
  }

  //루트 판넬일때만
  render(display,xOffset,yOffset){
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

  update(){
    for(var i in this.components){
      this.components[i].update();
    }
  }

}
