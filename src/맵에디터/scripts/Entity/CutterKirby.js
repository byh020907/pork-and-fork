"use strict"

function CutterKirby(x,y,size,speed){
  Mob.apply(this,[x,y,0,0,speed]);

  this.size=size;

  this.right=true;
  this.currentAnimation;

  this.moving=false;
  this.state=CutterKirby.STOP_STATE;

  this.attackFlag=false;

  this.stopAni=new Animation(imageLoader.get("Cutter Kirby.png"),6,20,23,25,1,60);
  this.stopAni.start();
  this.stopAni.loop=true;

  this.width=this.stopAni.width*this.size;
  this.height=this.stopAni.height*this.size;

  this.moveAni=new Animation(imageLoader.get("Cutter Kirby.png"),320,21,259/10,27,10,6);
  this.moveAni.finishFunction=(function(mob){
    return function(){
      if(!mob.moving){
        mob.setCurrentAnimation(CutterKirby.STOP_STATE);
      }
    }
  })(this);

  this.attackAni=new Animation(imageLoader.get("Cutter Kirby.png"),204,367,200/6,29,6,6);
  this.attackAni.finishFunction=(function(mob){
    return function(){
      var angle;
      var direction=mob.width;
      if(mob.right){
        angle=0;
      }else{
        angle=180;
        direction*=-1;
      }

      var cutter=new Cutter(mob.pos.x+direction,mob.pos.y,mob.size,2,mob,angle);
      mob.setCurrentAnimation(CutterKirby.STOP_STATE);
      mob.attackFlag=false;
    }
  })(this);

  this.jumpAni1=new Animation(imageLoader.get("Cutter Kirby.png"),251,58,23,28,1,6);
  this.jumpAni1.finishFunction=(function(mob){
    return function(){
      mob.currentAnimation=mob.jumpAni2;
      mob.jumpAni2.restart();
    }
  })(this);

  this.jumpAni2=new Animation(imageLoader.get("Cutter Kirby.png"),293,59,167/6,32,6,6);
  this.jumpAni2.finishFunction=(function(mob){
    return function(){
      mob.currentAnimation=mob.jumpAni3;
      mob.jumpAni3.restart();
    }
  })(this);

  this.jumpAni3=new Animation(imageLoader.get("Cutter Kirby.png"),478,60,52/2,26,2,6);
  this.jumpAni3.finishFunction=(function(mob){
    return function(){
      mob.setCurrentAnimation(CutterKirby.STOP_STATE);
    }
  })(this);

  this.currentAnimation=this.stopAni;
}

inherit(Mob,CutterKirby);

CutterKirby.STOP_STATE=0;
CutterKirby.MOVE_STATE=1;
CutterKirby.ATTACK_STATE=2;
CutterKirby.JUMP_STATE=3;

CutterKirby.prototype.render=function(camera,display){
  //healthbar
  display.fillRect(camera,this.pos.x-this.width/2,this.pos.y-this.height,this.width*this.currentHealth/this.maxHealth,10,"rgba(255,0,0,0.7)");

  if(this.right){
    this.currentAnimation.render(camera,display,this.pos.x,this.pos.y,this.size,{x:1,y:1});
  }else{
    this.currentAnimation.render(camera,display,this.pos.x,this.pos.y,this.size,{x:-1,y:1});
  }
}

CutterKirby.prototype.setCurrentAnimation=function(state){

  this.state=state;

  switch (state) {
    case CutterKirby.STOP_STATE:{
      this.currentAnimation=this.stopAni;
    }break;

    case CutterKirby.MOVE_STATE:{
      this.currentAnimation=this.moveAni;
    }break;

    case CutterKirby.ATTACK_STATE:{
      this.currentAnimation=this.attackAni;
    }break;

    case CutterKirby.JUMP_STATE:{
      this.currentAnimation=this.jumpAni1;
    }break;

    default:console.log("CutterKirby.setCurrentAnimation()::unknown state");
  }

  return this.currentAnimation;

}

CutterKirby.prototype.update=function(){
  this.updateSpeed();
  this.currentAnimation.update();
  for(var id in Entity.list){
    var e=Entity.list[id];
    if(e instanceof MoveEntity&&this!=e&&hitTestBox(this,e)){
      this.collisionProcess(this,e);
    }
  }
  this.moving=false;
}


CutterKirby.prototype.move=function(angle){
  this.moving=true;
  if(!(this.state==CutterKirby.ATTACK_STATE)){
    if(!(this.state==CutterKirby.JUMP_STATE)){
      this.setCurrentAnimation(CutterKirby.MOVE_STATE).play();
    }

    if(angle==90||angle==270){

    }else if(90<angle&&angle<270){
      this.right=false;
    }else if(270<angle||angle<90){
      this.right=true;
    }
    var rad=angle*Math.PI/180;
    this.velocity.x+=Math.cos(rad)*this.accel;
    this.velocity.y+=Math.sin(rad)*this.accel;
  }

}

CutterKirby.prototype.jump=function(jumpSpeed){
  if(this.velocity.y>0&&!(this.state==CutterKirby.ATTACK_STATE)){
    this.setCurrentAnimation(CutterKirby.JUMP_STATE).restart();
    this.velocity.y-=jumpSpeed;
  }
}


CutterKirby.prototype.attack=function(){
  if(!this.attackFlag){

    var speed=0;
    this.setCurrentAnimation(CutterKirby.ATTACK_STATE).restart();

    if(this.right){
      this.velocity=this.velocity.add(new Vector2d(speed,0));
    }else{
      this.velocity=this.velocity.add(new Vector2d(-speed,0));
    }

    this.attackFlag=true;

  }
}

CutterKirby.prototype.attacked=function(mob){
  if(this.currentHealth-mob.damage>0){
    var rad=getAngle(mob,this);
    var power=2;
    this.velocity=this.velocity.add(new Vector2d(Math.cos(rad)*power,Math.sin(rad)*power));
    this.currentHealth-=mob.damage;
  }else{
    this.remove();
  }
}



function Cutter(x,y,size,accel,parent,angle){
  MoveEntity.apply(this,[x,y,0,0,accel]);

  this.size=size;

  this.parent=parent;

  this.angle=angle;



  this.right=true;

  this.damage=10;

  this.timer=80;

  this.friction=1;
  this.G=new Vector2d(0,0);

  this.currentAnimation;

  this.moveAni=new Animation(imageLoader.get("Cutter Kirby.png"),21,364,139/4,22,4,6);
  this.moveAni.finishFunction=(function(mob){
    return function(){

    }
  })(this);
  this.moveAni.loop=true;
  this.moveAni.start();

  this.width=this.moveAni.width*this.size;
  this.height=this.moveAni.height*this.size;

  this.currentAnimation=this.moveAni;
}

inherit(MoveEntity,Cutter);

Cutter.prototype.render=function(camera,display){

  if(this.right){
    this.currentAnimation.render(camera,display,this.pos.x,this.pos.y,this.size,{x:1,y:1});
  }else{
    this.currentAnimation.render(camera,display,this.pos.x,this.pos.y,this.size,{x:-1,y:1});
  }

}

Cutter.prototype.update=function(){
  this.updateSpeed();
  this.currentAnimation.update();

  if(this.timer-- > 65){
    this.move(this.angle);
  }else if(this.timer>0){
    this.move(180+this.angle);
  }else{
    this.remove();
  }
  for(var id in Entity.list){
    var e=Entity.list[id];
    if(e instanceof MoveEntity&&this!=e&&hitTestBox(this,e)){
      this.collisionProcess(this,e);
    }
  }
}

Cutter.prototype.collisionProcess=function(self,other){
  if(other instanceof Mob)
    other.attacked(self);
  collisionProcess(self,other);
}

Cutter.prototype.move=function(angle){

  if(angle==90||angle==270){

  }else if(90<angle&&angle<270){
    this.right=false;
  }else if(270<angle||angle<90){
    this.right=true;
  }
  var rad=angle*Math.PI/180;
  this.velocity.x+=Math.cos(rad)*this.accel;
  this.velocity.y+=Math.sin(rad)*this.accel;

}

Cutter.prototype.attacked=function(mob){

}
