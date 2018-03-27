"use strict"

class PigNose extends Entity{
  constructor(owner,x,y){
    super();
    this.owner=owner;
    this.fixedPos=new Vector2d(x,y);
    this.polygon=new Polygon(owner.body.pos.x+x,owner.body.pos.y+y);
    //body 크기 설정 // 직사각형만 해당
    var width=70*4;
    var height=10*4;
    this.body.width=width;
    this.body.height=height;

    this.extraAngle=45*Math.PI/180;

    this.extraPos=new Vector2d(0,0);

    this.polygon.setVertices([
      new Vector2d(-width/2,-height/2),
      new Vector2d(width/2,-height/2),
      new Vector2d(width/2,height/2),
      new Vector2d(-width/2,height/2),
    ]);
    this.body.owner=this.model.owner=this.collision.owner=this;

    this.model=new AnimationModel(this,Sprite.PAF_SHEET,956,59,1910/8,60,8,7);
    this.model.start();
    this.model.loop=true;
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
    this.model.isFlipped=value;
    if(value){
      this.fixedPos.x=-Math.abs(this.fixedPos.x);
    }else{
      this.fixedPos.x=Math.abs(this.fixedPos.x);
    }
  }

  update(){
    this.model.update();
    this.polygon.update();
    var p=this.owner.body.u.mul(this.fixedPos);
    var a=this.body.rotateAngle;
    this.extraPos.set(-this.body.width/2+(this.body.width/2)*Math.cos(a),0+(this.body.width/2)*Math.sin(a));
    this.body.pos.x=this.owner.body.pos.x+p.x+this.extraPos.x;
    this.body.pos.y=this.owner.body.pos.y+p.y+this.extraPos.y;
    if(this.model.isFlipped){
      this.extraPos.set(this.body.width/2-(this.body.width/2)*Math.cos(a),0-(this.body.width/2)*Math.sin(a));
      this.body.pos.x=this.owner.body.pos.x+p.x+this.extraPos.x;
      this.body.pos.y=this.owner.body.pos.y+p.y+this.extraPos.y;
      this.body.rotateAngle=Math.atan2(-p.y,-p.x)-this.extraAngle;
    }
    else
      this.body.rotateAngle=Math.atan2(p.y,p.x)+this.extraAngle;
  }

  render(pMtrx) {
    this.polygon.render(pMtrx);
  }

  hitProcess(e){
  }

}
