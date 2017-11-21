"use strict"

var STICKY_THRESHOLD=0.004;

function Entity(x,y,width,height){
  this.id=Math.random();
  this.pos=new Vector2d(x,y);
  this.width=width;
  this.height=height;

  Entity.list[this.id]=this;
}

Entity.list={};

Entity.prototype.render=function(camera,display){
  display.save();
  display.translate(this.pos);
  display.rotate(0*Math.PI/180);
  display.scale(1,1);
  display.renderBuffer(null,-this.width/2,-this.height/2,this.width,this.height);
  display.restore();
}

Entity.prototype.update=function(){

}

Entity.clear=function(){
  Entity.list={};
}

Entity.prototype.remove=function(){
  delete Entity.list[this.id];
}

Entity.renderAll=function(camera,display){
  for(var id in Entity.list){
    var e=Entity.list[id];
    e.render(camera,display);
  }
}

Entity.updateAll=function(){
  for(var id in Entity.list){
    var e=Entity.list[id];
    e.update();
  }
}

function MoveEntity(x,y,width,height,accel){
  Entity.apply(this,[x,y,width,height]);
  this.accel=accel;
  this.friction=0.89;
  this.velocity=new Vector2d(0,0);
  this.bound=0.2;

  this.G=new Vector2d(0,0.5);
}
//상속과정
inherit(Entity,MoveEntity);
// var F = function(){};
// F.prototype = new Entity();
// MoveEntity.prototype = new F();
// MoveEntity.prototype.constructor=MoveEntity;

MoveEntity.prototype.move=function(angle){
  var rad=angle*Math.PI/180;
  this.velocity.x+=Math.cos(rad)*this.accel;
  this.velocity.y+=Math.sin(rad)*this.accel;
}

MoveEntity.prototype.updateSpeed=function(){
  this.pos=this.pos.add(this.velocity);
  this.velocity=this.velocity.add(this.G);
  this.velocity.x*=this.friction;
}

MoveEntity.prototype.update=function(){
  this.updateSpeed();
  for(var id in Entity.list){
    var e=Entity.list[id];
    if(e instanceof MoveEntity&&this!=e&&hitTestBox(this,e)){
      this.collisionProcess(this,e);
    }
  }
}

MoveEntity.prototype.collisionProcess=function(self,other){
    collisionProcess(self,other);
}

function Mob(x,y,width,height,accel){
  MoveEntity.apply(this,[x,y,width,height,accel]);

  this.maxHealth=100;
  this.currentHealth=this.maxHealth;

  this.damage=10;
}

inherit(MoveEntity,Mob);

Mob.prototype.attack=function(){

}

function Player(x,y,size,accel){
  Mob.apply(this,[x,y,0,0,accel]);

  this.size=size;

  this.right=true;
  this.currentAnimation;

  this.moving=false;
  this.state=Player.STOP_STATE;

  this.attackFlag=false;

  this.stopAni=new Animation(imageLoader.get("cuby.png"),7,6,50/2,18,2,60);
  this.stopAni.start();
  this.stopAni.loop=true;

  this.width=this.stopAni.width*this.size;
  this.height=this.stopAni.height*this.size;

  this.moveAni=new Animation(imageLoader.get("cuby.png"),8.5,55,229/10,19,10,6);
  this.moveAni.finishFunction=(function(mob){
    return function(){
      if(!mob.moving){
        mob.setCurrentAnimation(Player.STOP_STATE);
      }
    }
  })(this);
  this.normalAttackAni1_1=new Animation(imageLoader.get("cuby.png"),8,175,132/5,21,5,3);
  this.normalAttackAni1_1.finishFunction=(function(mob){
    return function(){
      mob.currentAnimation=mob.normalAttackAni1_2;
      mob.normalAttackAni1_2.restart();
    }
  })(this);

  this.normalAttackAni1_2=new Animation(imageLoader.get("cuby.png"),143,176,80/2,19,2,12);
  this.normalAttackAni1_2.finishFunction=(function(mob){
    return function(){
      for(var id in Entity.list){
        var e=Entity.list[id];
        var hitBox={pos:new Vector2d(0,0),width:mob.width,height:mob.height}
        hitBox.pos.y=mob.pos.y;
        if(mob.right){
          hitBox.pos.x=mob.pos.x+mob.width/2;
        }else{
          hitBox.pos.x=mob.pos.x-mob.width/2;
        }

        if(e instanceof Mob&&e!=mob&&hitTestBox(e,hitBox)){
          e.attacked(mob);
        }
      }
      mob.setCurrentAnimation(Player.STOP_STATE);
      mob.attackFlag=false;
    }
  })(this);

  this.uppercutAttackAni=new Animation(imageLoader.get("cuby.png"),9,254,173/6,27,6,6);
  this.uppercutAttackAni.finishFunction=(function(mob){
    return function(){
      for(var id in Entity.list){
        var e=Entity.list[id];
        var hitBox={pos:new Vector2d(0,0),width:mob.width,height:mob.height}
        hitBox.pos.y=mob.pos.y;
        if(mob.right){
          hitBox.pos.x=mob.pos.x+mob.width/2;
        }else{
          hitBox.pos.x=mob.pos.x-mob.width/2;
        }

        if(e instanceof Mob&&e!=mob&&hitTestBox(e,hitBox)){
          e.attacked(mob);
          e.velocity.y=0;
          e.velocity=e.velocity.add(new Vector2d(0,-10));
        }
      }

      mob.velocity.y=0;
      mob.velocity=mob.velocity.add(new Vector2d(0,-10));
      mob.setCurrentAnimation(Player.STOP_STATE);
      mob.attackFlag=false;
    }
  })(this);

  this.jumpAni=new Animation(imageLoader.get("cuby.png"),7,105,243/10,21,10,6);
  this.jumpAni.finishFunction=(function(mob){
    return function(){
      mob.setCurrentAnimation(Player.STOP_STATE);
    }
  })(this);

  this.hurtAni=new Animation(imageLoader.get("cuby.png"),118,130,79/3,19,3,16);
  this.hurtAni.finishFunction=(function(mob){
    return function(){
      mob.setCurrentAnimation(Player.STOP_STATE);
    }
  })(this);

  this.currentAnimation=this.stopAni;
}

inherit(Mob,Player);

Player.STOP_STATE=0;
Player.MOVE_STATE=1;
Player.NORMAL_ATTACK_STATE=2;
Player.UPPERCUT_ATTACK_STATE=3;
Player.JUMP_STATE=4;
Player.HURT_STATE=5;

Player.prototype.render=function(camera,display){
  //healthbar
  display.fillRect(camera,this.pos.x-this.width/2,this.pos.y-this.height,this.width*this.currentHealth/this.maxHealth,10,"rgba(255,0,0,0.7)");

  if(this.right){
    this.currentAnimation.render(camera,display,this.pos.x,this.pos.y,this.size,new Vector2d(1,1));
  }else{
    this.currentAnimation.render(camera,display,this.pos.x,this.pos.y,this.size,new Vector2d(-1,1));
  }
}

Player.prototype.setCurrentAnimation=function(state){

  this.state=state;

  switch (state) {
    case Player.STOP_STATE:{
      this.currentAnimation=this.stopAni;
    }break;

    case Player.MOVE_STATE:{
      this.currentAnimation=this.moveAni;
    }break;

    case Player.NORMAL_ATTACK_STATE:{
      this.currentAnimation=this.normalAttackAni1_1;
    }break;

    case Player.UPPERCUT_ATTACK_STATE:{
      this.currentAnimation=this.uppercutAttackAni;
    }break;

    case Player.JUMP_STATE:{
      this.currentAnimation=this.jumpAni;
    }break;

    case Player.HURT_STATE:{
      this.currentAnimation=this.hurtAni;
    }break;

    default:console.log("Player.setCurrentAnimation()::unknown state");
  }

  return this.currentAnimation;

}

Player.prototype.update=function(){
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

Player.prototype.updateSpeed=function(){
  this.pos=this.pos.add(this.velocity);
  this.velocity=this.velocity.add(this.G);
  this.velocity.x*=this.friction;
}

Player.prototype.move=function(angle){
  this.moving=true;
  if(!(this.state==Player.NORMAL_ATTACK_STATE||this.state==Player.UPPERCUT_ATTACK_STATE||this.state==Player.HURT_STATE)){
    if(!(this.state==Player.JUMP_STATE)){
      this.setCurrentAnimation(Player.MOVE_STATE).play();
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

Player.prototype.jump=function(jumpSpeed){
  if(this.velocity.y>0&&!(this.state==Player.NORMAL_ATTACK_STATE||this.state==Player.UPPERCUT_ATTACK_STATE||this.state==Player.HURT_STATE)){
    this.setCurrentAnimation(Player.JUMP_STATE).restart();
    this.velocity.y-=jumpSpeed;
  }
}


Player.prototype.attack=function(mod){
  //mod==1->일반,mod==2->어퍼컷
  if(!this.attackFlag&&!(this.state==Player.HURT_STATE)){

    var speed=0;
    switch (mod) {

      case 1:{
        this.setCurrentAnimation(Player.NORMAL_ATTACK_STATE).restart();
        speed=3;
      }break;

      case 2:{
        this.setCurrentAnimation(Player.UPPERCUT_ATTACK_STATE).restart();
        speed=5;
      }break;

      default:

    }

    if(this.right){
      this.velocity=this.velocity.add(new Vector2d(speed,0));
    }else{
      this.velocity=this.velocity.add(new Vector2d(-speed,0));
    }

    this.attackFlag=true;

  }
}

Player.prototype.attacked=function(mob){
  this.attackFlag=false;
  if(this.currentHealth-mob.damage>0){
    this.setCurrentAnimation(Player.HURT_STATE).restart();
    var rad=getAngle(mob,this);
    var power=2;
    this.velocity=this.velocity.add(new Vector2d(Math.cos(rad)*power,Math.sin(rad)*power));
    this.currentHealth-=mob.damage;
  }else{
    this.remove();
  }
}
