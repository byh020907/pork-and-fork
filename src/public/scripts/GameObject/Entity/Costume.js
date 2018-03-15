"use strict"

class Costume extends Entity{
  constructor(owner,x,y,model){
    super();
    this.owner=owner;
    if(x==0)
      x=0.000000001;
    this.fixedPos=new Vector2d(x,y);
    this.tempX=x;
    this.polygon=new Polygon(owner.body.pos.x+x,owner.body.pos.y+y);
    //body 크기 설정 // 직사각형만 해당
    var width=140;
    var height=100;
    this.body.width=width;
    this.body.height=height;

    this.polygon.setVertices([
      new Vector2d(-width/2,-height/2),
      new Vector2d(width/2,-height/2),
      new Vector2d(width/2,height/2),
      new Vector2d(-width/2,height/2),
    ]);
    this.body.owner=this.model.owner=this.collision.owner=this;

    this.model=model;
    if(this.model instanceof AnimationModel){
      this.model.start();
      this.model.loop=true;
    }

    this.isFixed=true;

    this.isReverse=false;
  }

  get ordinal(){
    if(this.polygon==undefined)
      return null;
    return this.polygon.ordinal;
  }

  get body(){
    if(this.polygon==undefined)
      return null;
    return this.polygon.body;
  }

  get model(){
    if(this.polygon==undefined)
      return null;
    return this.polygon.model;
  }

  get collision(){
    if(this.polygon==undefined)
      return null;
    return this.polygon.collision;
  }

  set model(model){
    this.polygon.model=model;
  }

  setFlip(value){
    //xor 연산을 통해 isReverse가 true면은 value가 true일 떄 isFlipped는 false, false일때는 true가된다.
    this.model.isFlipped=value^this.isReverse;
    if(value){
      this.fixedPos.x=-this.tempX;
    }else{
      this.fixedPos.x=this.tempX;
    }
  }

  update(){
    //모델이 Animation일때만 update
    if(this.model instanceof AnimationModel)
      this.model.update();
    this.polygon.update();

    if(this.isFixed)
      this.fixPosition();

  }

  fixPosition(){
    var p=this.owner.body.u.mul(this.fixedPos);
    this.body.pos.x=this.owner.body.pos.x+p.x;
    this.body.pos.y=this.owner.body.pos.y+p.y;

    if(this.model.isFlipped^this.isReverse){//isReverse일시 뒤집어 주기위함
      this.body.rotateAngle=Math.atan2(-p.y,-p.x);
      if(p.x>0)
        this.body.rotateAngle-=Math.PI;
    }
    else{
      this.body.rotateAngle=Math.atan2(p.y,p.x);
      if(p.x<0)
        this.body.rotateAngle-=Math.PI;
    }
  }

  render(pMtrx) {
    this.polygon.render(pMtrx);
  }

  hitProcess(e){
  }

}
