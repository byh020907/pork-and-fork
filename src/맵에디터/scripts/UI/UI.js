"use strict"
function UIButton(image,x,y,width,height,buttonListener){
  UIComponent.apply(this,[image,x,y,width,height]);
  this.buttonListener=buttonListener;
  this.inside=false;
  this.pressed=false;
}

inherit(UIComponent,UIButton);

UIButton.prototype.update=function(){
  if(hitTestPoint({pos:this.pos.add(this.panel.pos),width:this.width,height:this.height},new Vector2d(getMouseX(),getMouseY()) ) ){
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

function UITextField(image,x,y,width,height,buttonListener){
  UIComponent.apply(this,[image,x,y,width,height]);
  this.buttonListener=buttonListener;
  this.inside=false;
  this.pressed=false;
}

inherit(UIComponent,UITextField);

UITextField.prototype.update=function(){
  if(hitTestPoint({pos:this.pos.add(this.panel.pos),width:this.width,height:this.height},new Vector2d(getMouseX(),getMouseY()) ) ){
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
