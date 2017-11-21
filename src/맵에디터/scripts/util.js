"use strict"

//상속함수
var inherit = (function(){
  var F = function(){};
  return function( Parent, Child ){
    F.prototype = new Parent();
    Child.prototype = new F();
    Child.prototype.constructor = Child;

    console.log(Parent.prototype,Child.prototype);
  }
})();

function hitTestPoint(box,point,flag){

  if(flag==undefined){
    //UI용
    if(box.pos.x<point.x&&point.x<box.pos.x+box.width&&
      box.pos.y<point.y&&point.y<box.pos.y+box.height){
        return true;
      }
    return false;
  }else{
    switch (flag) {
      case 1:{
        //Entity용
        if(box.pos.x-box.width/2<point.x&&point.x<box.pos.x+box.width/2&&
          box.pos.y-box.height/2<point.y&&point.y<box.pos.y+box.height/2){
            return true;
          }
        return false;
      }break;

      default:console.log("hitTestPoint::flag error(unknown flag)");

    }
  }
}

function hitTestBox(){
  //Entity용
  var a=arguments;

  switch (a.length) {
    case 2:{
      var box1=a[0];
      var box2=a[1];
      if(box1.pos.x-box1.width/2<box2.pos.x+box2.width/2&&box2.pos.x-box2.width/2<box1.pos.x+box1.width/2&&
      box1.pos.y-box1.height/2<box2.pos.y+box2.height/2&&box2.pos.y-box2.height/2<box1.pos.y+box1.height/2){
        return true;
      }
      return false;
    }break;

    case 3:{
      var box1=a[0];
      var box2=a[1];
      var bound=a[2];
      if(box1.size!=undefined&&box2.size!=undefined){

        var box1Size=box1.size;
        var box2Size=box2.size;
        if(box1.pos.x-box1.width/2+box1Size*bound<box2.pos.x+box2.width/2-box2Size*bound&&box2.pos.x-box2.width/2+box2Size*bound<box1.pos.x+box1.width/2-box1Size*bound&&
        box1.pos.y-box1.height/2+box1Size*bound<box2.pos.y+box2.height/2-box2Size*bound&&box2.pos.y-box2.height/2+box2Size*bound<box1.pos.y+box1.height/2-box1Size*bound){
          return true;
        }
        return false;

      }else{

        if(box1.pos.x-box1.width/2+bound<box2.pos.x+box2.width/2-bound&&box2.pos.x-box2.width/2+bound<box1.pos.x+box1.width/2-bound&&
        box1.pos.y-box1.height/2+bound<box2.pos.y+box2.height/2-bound&&box2.pos.y-box2.height/2+bound<box1.pos.y+box1.height/2-bound){
          return true;
        }
        return false;

      }

    }break;

    default:console.log("util.js/hitTestBox()::overloding fail::woung parameter num");

  }
}

function collisionProcess(self,other){

    // To find the side of entry calculate based on
    // the normalized sides
    if(other instanceof MoveEntity){

      var dx = (other.pos.x - self.pos.x) / ((self.width+other.width)*0.5);
      var dy = (other.pos.y - self.pos.y) / ((self.height+other.height)*0.5);

      // Calculate the absolute change in x and y
      var absDX = Math.abs(dx);
      var absDY = Math.abs(dy);

      var newPos=self.pos.clone();

      // If the distance between the normalized x and y
      // position is less than a small threshold (.1 in this case)
      // then this object is approaching from a corner
      if (absDX > absDY) {

          // If the self is approaching from positive X
          if (dx < 0) {
              newPos.x = other.pos.x+(self.width+other.width)/2;
          } else {
              newPos.x = other.pos.x-(self.width+other.width)/2;
          }

          // Velocity component
          other.velocity.x+=self.velocity.x;
          self.velocity.x = -self.velocity.x * other.bound;

          if (Math.abs(self.velocity.x) < STICKY_THRESHOLD) {
              self.velocity.x = 0;
          }
      } else {

          // If the self is approaching from positive Y
          if (dy < 0) {
              newPos.y = other.pos.y+(self.height+other.height)/2;
          } else {
              newPos.y = other.pos.y-(self.height+other.height)/2;
          }

          // Velocity component
          other.velocity.y+=self.velocity.y;
          self.velocity.y = -self.velocity.y * other.bound;
          if (Math.abs(self.velocity.y) < STICKY_THRESHOLD) {
              self.velocity.y = 0;
          }
      }

      self.pos=newPos;

    }

}
