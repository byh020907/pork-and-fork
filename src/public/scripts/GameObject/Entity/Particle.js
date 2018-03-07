"use strict"
class Particle extends Entity{
  constructor(x,y){
    super();

    this.polygon=new Polygon(x||0,y||0);
    //body 크기 설정 // 직사각형만 해당
    var width=100;
    var height=100;
    this.body.width=width;
    this.body.height=height;

    this.polygon.setVertices([
      new Vector2d(-width/2,-height/2),
      new Vector2d(width/2,-height/2),
      new Vector2d(width/2,height/2),
      new Vector2d(-width/2,height/2),
    ]);

    this.model = new TextureModel(this, Sprite.BLANK_IMAGE);

    this.body.owner=this.model.owner=this.collision.owner=this;

    this.timer=200;
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

  update(){
    // if(--this.timer<=0)
    //   Particle.ObjectPool.free(this);
    this.polygon.update();
  }


}

// Particle.ObjectPool=new ObjectPool(Particle,100);

class ParticleFactory{
    constructor(size){
      this.pool=new ObjectPool(Particle,size);
    }
}
