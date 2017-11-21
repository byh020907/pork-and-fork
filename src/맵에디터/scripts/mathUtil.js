"use strict"

function Vector2d(x,y){
  this.x=x;
  this.y=y;
}

Vector2d.prototype.clone = function(v) {
    return new Vector2d(this.x,this.y);
};

Vector2d.prototype.add = function(v) {
    return new Vector2d(v.x + this.x, v.y + this.y);
};

Vector2d.prototype.subtract = function(v) {
    return new Vector2d(this.x - v.x, this.y - v.y);
};

Vector2d.prototype.scale = function(s) {
    return new Vector2d(this.x * s, this.y * s);
};

Vector2d.prototype.dot = function(v) {
    return (this.x * v.x + this.y * v.y);
};

/* Normally the vector cross product function returns a vector. But since we know that all our vectors will only be 2D (x and y only), any cross product we calculate will only have a z-component. Since we don't have a 3D vector class, let's just return the z-component as a scalar. We know that the x and y components will be zero. This is absolutely not the case for 3D. */
Vector2d.prototype.cross = function(v) {
    return (this.x * v.y - this.y * v.x);
};

Vector2d.prototype.rotate = function(angle, vector) {
    var x = this.x - vector.x;
    var y = this.y - vector.y;

    var x_prime = vector.x + ((x * Math.cos(angle)) - (y * Math.sin(angle)));
    var y_prime = vector.y + ((x * Math.sin(angle)) + (y * Math.cos(angle)));

    return new Vector2d(x_prime, y_prime);
};


function getAngle(){

  var a=arguments;

  var result;
  switch (a.length) {
    case 2:{
      var e1=a[0];
      var e2=a[1];

      result=Math.atan2((e2.pos.y-e1.pos.y),(e2.pos.x-e1.pos.x));
    }break;

    default:console.log("mathUtil.js/getAngle()::overloding fail::woung parameter num");

  }

  return result;
}
