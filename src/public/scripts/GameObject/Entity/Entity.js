"use strict"

class Entity extends GameObject{

  constructor(){
    super();
    this.id=Math.random();
    Entity.list[this.id]=this;
  }

  update(){

  }

  remove(){
    delete Entity.list[this.id];
  }

  hitProcess(e){

  }

}

Entity.list={};

Entity.clear=function(){
  Entity.list={};
}

Entity.renderAll=function(camera){
  for(var id in Entity.list){
    var e=Entity.list[id];
    e.render(camera.getProjection());
  }
}

Entity.updateAll=function(){
  for(var id in Entity.list){
    var e=Entity.list[id];
    e.update();
  }
}
