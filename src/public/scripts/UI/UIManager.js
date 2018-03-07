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

UIManager.prototype.removePanel=function(panelId){
  for(let i=0;i<this.panels.length;i++){
    if(this.panels[i].id==panelId){
      this.panels.splice(i, 1);
      return;
    }
  }

  console.error("존재하지않는 panel입니다.");
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

//UITextField의 입력 커서 초기화를 위한 함수
UIManager.prototype.mouseDown=function(e){
  for(var panel of this.panels){
    this.loopComponent(panel,function(){
      this.isFocus=false;
    },e);
  }
}

UIManager.prototype.keyDown=function(e){
  //이벤트가 발생하지 않은 이유는 component가 uiPanel인 경우를 간과해서이다.
  for(var panel of this.panels){
    this.loopComponent(panel,UITextField.prototype.keyDown,e);
  }
}

UIManager.prototype.loopComponent=function(component,func,e){
  if(component instanceof UIPanel){
    for(var c of component.components)
      this.loopComponent(c,func,e);
  }else{
    if(component instanceof UITextField)
      Reflect.apply(func,component,[e]);
  }
}

UIManager.prototype.keyUp=function(e){
  for(var panel of this.panels){
    this.loopComponent(panel,UITextField.prototype.keyUp,e);
  }
}

UIManager.prototype.isKeyUp=function(e){
  for(var panel of this.panels){
    panel.update();
  }
}





//UIComponent





class UIComponent extends GameObject{
  constructor(sprite,x,y,width,height){
    super();
    this.id=Math.random();
    if(sprite!=null)
        this.model=new TextureModel(this,sprite);

    //local 좌표//렌더링용//기본적으로 입력한값을 토대로 왼쪽 상단을 기준으로 잡는다.
    this.body=new UIBody(this);
    this.body.pos.x=x+width/2;
    this.body.pos.y=y+height/2;
    this.body.width=width;
    this.body.height=height;

    //월드 좌표
    this.collision=new UICollision(this,this.body);

    this.panel;

  }

  init(uiPanel){
    this.panel=uiPanel;
    this.collision.setPos(this.getX()+uiPanel.getWorldX(),this.getY()+uiPanel.getWorldY());
  }

  //0~1 사이의 수가 파라메터로 들어감//addComponent를 사용한 객체만 적용가능
  setBound(sx,sy,fx,fy){
    if(!this.panel){
      console.error("panel에 소속된 component가 아닙니다.");
    }
    this.body.width=(fx-sx)*this.panel.body.width;
    this.body.height=(fy-sy)*this.panel.body.height;
    this.setX(sx*this.panel.body.width);
    this.setY(sy*this.panel.body.height);
    //collision 재설정
    this.collision.setBound(this.getX()+this.panel.getWorldX(),this.getY()+this.panel.getWorldY(),this.body.width,this.body.height);
  }

  //Body의 pos는 실제 모델좌표의 중심, 실제 사용할때는 아래 메서드 사용하여 왼쪽상단의 좌표를 리턴해준다//UI는 무조건 왼쪽상단이 기준
  getX(){
    return this.body.pos.x-this.body.width/2;
  }

  getY(){
    return this.body.pos.y-this.body.height/2;
  }

  getWorldX(){
    var sum=0;

    //for문 동작순서는
    //1. let component=this;        //초기화(처음 한번만)
    //2. component!=null;           //조건
    //3. sum+=component.getX();     //실행 블록
    //4. component=component.panel  //증감자

    for(let component=this;component!=null;component=component.panel){
      sum+=component.getX();
    }

    return sum;
  }

  getWorldY(){
    var sum=0;
    for(let component=this;component!=null;component=component.panel){
      sum+=component.getY();
    }

    return sum;
  }

  //body의 실제 좌표는 중심좌표//collision는 왼쪽 상단
  setX(x){
    this.body.pos.x=x+this.body.width/2;
  }

  setY(y){
    this.body.pos.y=y+this.body.height/2;
  }

  render(display, xOffset, yOffset){
    this.model.render(display.getProjection(),xOffset+this.body.pos.x,yOffset+this.body.pos.y,this.body.width,this.body.height,this.body.rotateAngle);
  }

  update(){
    //collision bound 업데이트
    this.collision.setBound(this.getWorldX(),this.getWorldY(),this.body.width,this.body.height);
  }

}



//UIPanel



class UIPanel extends UIComponent{
  constructor(sprite,x,y,width,height){
    super(sprite,x,y,width,height);
    this.components=[];
    this.hasTexture;
    if(sprite!=null)this.hasTexture=true;
          else this.hasTexture=false;
  }

  addComponent(component){
    component.init(this);
    this.components.push(component);
  }

  removeComponent(componentId){
    for(let i=0;i<this.components.length;i++){
      if(this.components[i].id==componentId){
        this.components.splice(i, 1);
        console.log("remove"+componentId);
        return;
      }
    }

    console.error("존재하지않는 component입니다.");
  }

  getComponent(id){
    return this.components[id];
  }

  init(uiPanel){
    this.panel=uiPanel;
    this.collision.setPos(this.getX()+uiPanel.getWorldX(),this.getY()+uiPanel.getWorldY());
    for(let component of this.components){
      component.init(this);
    }
  }

  clear(){
    this.f(this);
  }

  //component는 components를 가진 판넬을 최초인자로 가진다
  f(panel){
    if(panel instanceof UIPanel){
      for(var c of panel.components){
        this.f(c);
      }
      panel.components=[];//초기화
    }else{
      //만약 UIPanel이 아니면
      //아무것도 안함
    }
  }

  //루트 판넬일때만
  render(display,xOffset,yOffset){
    var a=arguments;
    switch (a.length) {
      case 1:{
        if(this.hasTexture)//offset을 0으로 설정
          super.render(display,0,0);

        for(let component of this.components){
          component.render(display,this.getX(),this.getY());
        }
      }break;

      case 3:{
        if(this.hasTexture)
          super.render(display,xOffset,yOffset);

        for(let component of this.components){
          component.render(display,xOffset+this.getX(),yOffset+this.getY());
        }
      }break;

      default: OverloadingException();

    }

  }

  update(){
    super.update();
    for(var component of this.components){
        component.update();
    }
  }

}
