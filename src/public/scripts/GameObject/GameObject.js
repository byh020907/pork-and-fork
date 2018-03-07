"use strict"

class GameObject{

  constructor(){
    this.body;
    this.model;
    this.collision;
  }

  render(pMtrx) {
    if(this.model!=null)
    this.model.render(pMtrx,this.body);
  }

  update() {

  }

  remove() {

  }

}
