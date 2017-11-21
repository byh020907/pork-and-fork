"use strict"
function FlyMob(x,y,size,speed){
  Mob.apply(this,[x,y,0,0,speed]);

  this.size=size;

  this.right=true;
  this.currentAnimation;

  this.moving=false;
  this.state=FlyMob.STOP_STATE;

  this.attackFlag=false;

  this.stopAni=new Animation(imageLoader.get("flyingGhost.png"),0,0,64,64,5,6);
  this.stopAni.start();
  this.stopAni.loop=true;

  this.width=this.stopAni.width*this.size;
  this.height=this.stopAni.height*this.size;

  this.moveAni=new Animation(imageLoader.get("flyingGhost.png"),0,0,64,64,5,6);
  this.moveAni.finishFunction=(function(mob){
    return function(){
      if(!mob.moving){
        mob.setCurrentAnimation(FlyMob.STOP_STATE);
      }
    }
  })(this);

  this.attackAni=new Animation(imageLoader.get("flyingGhost.png"),0,64,64,64,5,6);
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
      mob.setCurrentAnimation(FlyMob.STOP_STATE);
      mob.attackFlag=false;
    }
  })(this);

  this.jumpAni=new Animation(imageLoader.get("flyingGhost.png"),0,0,64,64,5,6);
  this.jumpAni.finishFunction=(function(mob){
    return function(){
      mob.setCurrentAnimation(FlyMob.STOP_STATE);
    }
  })(this);

  this.hurtAni=new Animation(imageLoader.get("flyingGhost.png"),0,128,64,64,3,6);
  this.hurtAni.finishFunction=(function(mob){
    return function(){
      mob.setCurrentAnimation(FlyMob.STOP_STATE);
    }
  })(this);

  this.currentAnimation=this.stopAni;
}

inherit(Mob,FlyMob);

FlyMob.STOP_STATE=0;
FlyMob.MOVE_STATE=1;
FlyMob.ATTACK_STATE=2;
FlyMob.JUMP_STATE=3;
FlyMob.HURT_STATE=4;

FlyMob.prototype.render=function(camera,display){
  //healthbar
  display.fillRect(camera,this.pos.x-this.width/2,this.pos.y-this.height,this.width*this.currentHealth/this.maxHealth,10,"rgba(255,0,0,0.7)");

  if(this.right){
    this.currentAnimation.render(camera,display,this.pos.x,this.pos.y,this.size,{x:1,y:1});
  }else{
    this.currentAnimation.render(camera,display,this.pos.x,this.pos.y,this.size,{x:-1,y:1});
  }
}

FlyMob.prototype.setCurrentAnimation=function(state){

  this.state=state;

  switch (state) {
    case FlyMob.STOP_STATE:{
      this.currentAnimation=this.stopAni;
    }break;

    case FlyMob.MOVE_STATE:{
      this.currentAnimation=this.moveAni;
    }break;

    case FlyMob.ATTACK_STATE:{
      this.currentAnimation=this.attackAni;
    }break;

    case FlyMob.JUMP_STATE:{
      this.currentAnimation=this.jumpAni;
    }break;

    case FlyMob.HURT_STATE:{
      this.currentAnimation=this.hurtAni;
    }break;

    default:console.log("FlyMob.setCurrentAnimation()::unknown state");
  }

  return this.currentAnimation;

}

FlyMob.prototype.update=function(){
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

FlyMob.prototype.move=function(angle){
  this.moving=true;
  if(!(this.state==FlyMob.ATTACK_STATE||this.state==FlyMob.HURT_STATE)){
    if(!(this.state==FlyMob.JUMP_STATE)){
      this.setCurrentAnimation(FlyMob.MOVE_STATE).play();
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

FlyMob.prototype.jump=function(jumpSpeed){
  if(this.velocity.y>0&&!(this.state==FlyMob.ATTACK_STATE||this.state==FlyMob.HURT_STATE)){
    this.setCurrentAnimation(FlyMob.JUMP_STATE).restart();
    this.velocity.y-=jumpSpeed;
  }
}


FlyMob.prototype.attack=function(){
  if(!this.attackFlag&&!(this.state==FlyMob.HURT_STATE)){

    var speed=0;
    this.setCurrentAnimation(FlyMob.ATTACK_STATE).restart();

    if(this.right){
      this.velocity=this.velocity.add(new Vector2d(speed,0));
    }else{
      this.velocity=this.velocity.add(new Vector2d(-speed,0));
    }

    this.attackFlag=true;

  }
}

FlyMob.prototype.attacked=function(mob){
  this.attackFlag=false;
  if(this.currentHealth-mob.damage>0){
    this.setCurrentAnimation(FlyMob.HURT_STATE).restart();
    var rad=getAngle(mob,this);
    var angle=rad*180/Math.PI;
    //-180~180->0~360
    if(angle<0)
      angle+=360;

    if(90<angle&&angle<270){
      this.right=true;
    }else if(270<angle||angle<90){
      this.right=false;
    }

    var power=2;
    this.velocity=this.velocity.add(new Vector2d(Math.cos(rad)*power,Math.sin(rad)*power));
    this.currentHealth-=mob.damage;
  }else{
    this.remove();
  }
}
