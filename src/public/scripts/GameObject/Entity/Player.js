"use strict"
class Player extends Entity{
  constructor(name,x,y){
    //263*203
    super();
    this.tag="player";
    this.name=name;
    this.polygon=new Polygon(x,y);
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

    //ordinal 설정및 owner 재설정
    this.ordinal=1;
    this.body.owner=this.model.owner=this.collision.owner=this;

    this.nose=new PigNose(this,200,0);
    this.nameTag=new GameText(this,name,0,-100);
    this.costumes=[
      /*
      new Costume(this,0,0,new TextureModel(this,Sprite.PAF_LOGO)),
      new Costume(this,0,0,new TextureModel(this,Sprite.CHECK)),
       */
    ];
    // this.costumes[0].isReverse=true;

    this.idleAni=new AnimationModel(this,Sprite.PAF_SHEET,0,17,949/4,143,4,30);
    this.idleAni.loop=true;
    this.walkAni=new AnimationModel(this,Sprite.PAF_SHEET,2868,18,949/4,153,4,6);

    this.walkAni.finishFunction=(function(self){
      return function(){
        if(!self.isMoving){
          self.model=self.idleAni;
          self.idleAni.restart();
        }
      }
    }(this));

    this.hurtAni=new AnimationModel(this,Sprite.PAF_SHEET,118,130,79/3,19,3,8);
    this.hurtAni.finishFunction=(function(self){
      return function(){
        self.model=self.idleAni;
        self.idleAni.start();
      }
    }(this));

    //애니메이션 모델은 수시로 바뀌므로 렌더링할때 직접 호출을 한다.
    this.model=this.idleAni;
    this.model.start();

    this.jumpCount=0;
    this.maxJumpCount=1;

    this.speed=7;
    // this.maxSpeed=15;

    this.isMoving=false;
    this.counter=30;
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
    this.hurtAni.isFlipped=value;
    this.idleAni.isFlipped=value;
    this.walkAni.isFlipped=value;
    this.nose.setFlip(value);
    for(var costume of this.costumes){
      costume.setFlip(value);
    }
  }

  addCostume(costume){
    this.costumes.push(costume);
    this.body.world.removeBody(costume.body.id);
    costume.isFixed=true;
  }

  removeCostume(){
    if(this.costumes.length<=0){
      console.error("코스튬이 더이상 없습니다.");
      return;
    }
    //가장 위 코스튬을 제거한후 월드에 추가한다
    var pop=this.costumes.pop();
    this.body.world.addBody(pop.body);
    pop.isFixed=false;
  }

  setNose(camera){
      // mousePos.sub(new Vector2d(display.getWidth()/2,display.getHeight()/2)).add(camera.pos);
  }

  jump(amount){
    if(this.body.velocity.y>=0&&this.jumpCount<this.maxJumpCount){
      this.jumpCount++;
      this.body.velocity.y-=amount;
    }
  }

  move(rad) {
    this.isMoving=true;
    this.model=this.walkAni;
    this.walkAni.play();

    Player.SPEED.set(1,0);
    Player.SPEED.scaleLocal(this.speed);
    Player.SPEED.rotate(rad);

    this.body.applyForce(Player.SPEED);

    if(Math.PI/2<rad&&rad<Math.PI*1.5)
      this.setFlip(true);
    else
      this.setFlip(false);
  }

  update(){
    this.model.update();
    this.polygon.update();
    this.nose.update();
    for(var costume of this.costumes){
      costume.update();
    }
    this.nameTag.update();
    this.isMoving=false;
  }

  render(pMtrx) {
    this.nose.render(pMtrx);
    for(var costume of this.costumes){
      costume.update();
    }
    this.nameTag.render(pMtrx);
    super.render(pMtrx);
  }

  hitProcess(e){
    if(e instanceof Costume&&--this.counter<=0){
      this.addCostume(e);
      this.counter=30;
    }
    // if(e.tag=="ground")
      this.jumpCount=0;
    // this.model=this.hurtAni;
    // this.model.play();
  }
}
Player.SPEED=new Vector2d(1,0);
