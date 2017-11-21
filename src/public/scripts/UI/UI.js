"use strict"
function UIButton(texture,x,y,width,height,buttonListener){
  UIComponent.apply(this,[texture,x,y,width,height]);
  this.buttonListener=buttonListener;
  this.inside=false;
  this.pressed=false;
}

inherit(UIComponent,UIButton);

UIButton.prototype.update=function(){
  if(hitTestPoint(this.collision,mousePos)){
    if(!this.inside){
      this.buttonListener.entered(this);
    }
    this.inside=true;

    if(!this.pressed&&isMouseDown(1)){
      this.buttonListener.pressed(this);
      this.pressed=true;
    }else if(this.pressed&&!isMouseDown(1)){
      this.buttonListener.released(this);
      this.pressed=false;
    }
  }else{
    if(this.inside){
      this.buttonListener.exited(this);
      this.pressed=false;
    }
    this.inside=false;
  }

}

function UIList(texture,x,y,width,height){
  UIPanel.apply(this,[texture,x,y,width,height]);
}

inherit(UIPanel,UIList);

UIList.prototype.addComponent=function(component){
  component.init(this);
  component.setX(0);
  component.setY(0);
  var result=0;
  for(var c of this.components){
    result+=c.body.height;
  }
  component.body.pos.y+=result;
  this.components.push(component);
}

UIList.prototype.deleteComponent=function(index){
  this.components.splice(index,1);
  for(var i=0;i<this.components.length;i++){
    let component=this.components[i];
    component.setX(0);
    component.setY(0);
    var result=0;
    for(var j=0;j<i;j++){
      let c=this.components[j];
      result+=c.body.height;
    }
    component.body.pos.y+=result;
  }

}
