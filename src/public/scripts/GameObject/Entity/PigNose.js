"use strict"

class PigNose extends Entity{
  constructor(owner,x,y){
    super();
    this.owner=owner;
    this.fixedPos=new Vector2d(x,y);
    this.polygon=new Polygon(owner.body.pos.x+x,owner.body.pos.y+y);
    this.body=this.polygon.body;
    this.polygon.setVertices([
      new Vector2d(-7,-5),
      new Vector2d(7,-5),
      new Vector2d(7,5),
      new Vector2d(-7,5),
    ]);

    this.polygon.model=new AnimationModel(this,TextureLoader.get("images/Pig1-Sheet.png"),0,17,949/4,143,4,30);

    this.collision=this.polygon.collision;
  }

  setFlip(value){
    this.hurtAni.isFlipped=value;
    this.idleAni.isFlipped=value;
    this.walkAni.isFlipped=value;
  }

  update(){
    this.polygon.update();
    console.log(this.body.pos,this.owner.body.pos);
    this.body.pos.x+=this.owner.body.pos.x-this.body.pos.x;
    this.body.pos.y+=this.owner.body.pos.y-this.body.pos.y;
  }

  render(pMtrx) {
    this.polygon.render(pMtrx);
  }

  hitProcess(e){
  }

}
