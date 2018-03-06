"use strict"

class PoolObject{
  constructor(){
    this.isFree=false;
  }

  //will overriding method
  init(){
  }

  //객체값 초기화
  destructor(){

  }
}

class ObjectPool{
  constructor(clazz,size){
    this.clazz=clazz;
    this.pool=[];
    for(let i=0;i<size;i++){
      this.pool[i]=Reflect.construct(this.clazz,[]);
      this.pool[i].isFree=true;
    }
  }

  alloc(){
    var a=arguments;
    if(a.length==0){//나중에 값을 초기화 하는경우

      for(let i=0;i<this.pool.length;++i){
        if(this.pool[i].isFree){
          this.pool[i].isFree=false;
          return this.pool[i];
        }
      }

      let temp=Reflect.construct(this.clazz,[]);
      temp.isFree=false;
      this.pool.push(temp);
      console.error("alloc"+this.pool.length,this.pool);
      return temp;

    }else{//바로 값을 초기화 하는경우
      for(let i=0;i<this.pool.length;i++){
        if(this.pool[i].isFree){
          Reflect.apply(this.clazz.prototype.init,this.pool[i],a);
          this.pool[i].isFree=false;
          return this.pool[i];
        }
      }

      let temp=Reflect.construct(this.clazz,[]);
      temp.init(a);
      this.pool.push(temp);
      return temp;
    }

  }

  //object는 pool에 들어가 있는 객체이다.
  free(object){
    if(object.isFree)
      return;
    object.isFree=true;
    object.destructor();
  }
}
