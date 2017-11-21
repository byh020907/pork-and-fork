"use strict"

function AABB(owner){
  var a=arguments;
  switch (a.length) {

    case 2:{
      let body=a[1];
      AABB.apply(this,[owner,body.pos,body.width,body.height]);
    }break;

    case 4:{
      Collision.apply(this,[owner]);
      this.pos=a[1].clone();
      this.width=a[2];
      this.height=a[3];
    }break;

    default:

  }
}

inherit(Collision,AABB);

AABB.prototype.update=function(x,y,width,height){

  var a=arguments;
  switch (a.length) {
    case 1:{
      let body=a[0];
      this.update(body.pos.x,body.pos.y,body.width,body.height);
    }break;

    case 4:{
      this.pos.x=x;
      this.pos.y=y;
      this.width=width;
      this.height=height;
    }break;

    default: OverloadingException();

  }

}

AABB.prototype.hitTest=function(collision){
  if(collision instanceof AABB)
    return AABBvsAABB(this.owner.body,collision.owner.body);
  if(collision instanceof CircleCollision)
    return AABBvsCircle(this.owner.body,collision.owner.body);
}

function AABBvsAABB(A,B)
{

  var normal;
  var penetration;

  // Vector from A to B
  var n = B.pos.sub(A.pos);

  // Calculate half extents along x axis for each object
  let a_extent = A.width/2;
  let b_extent = B.width/2;

  // Calculate overlap on x axis
  var x_overlap = a_extent + b_extent - Math.abs( n.x );

  // SAT test on x axis
  if(x_overlap > 0)
  {
    // Calculate half extents along x axis for each object
    let a_extent = A.height/2;
    let b_extent = B.height/2;

    // Calculate overlap on y axis
    var y_overlap = a_extent + b_extent - Math.abs( n.y );

    // SAT test on y axis
    if(y_overlap > 0)
    {
      // Find out which axis is axis of least penetration
      if(x_overlap < y_overlap)
      {
        // Point towards B knowing that n points from A to B
        if(n.x < 0)
          normal = new Vector2d(-1,0);
        else
          normal = new Vector2d(1,0);
        penetration = x_overlap;
      }
      else
      {
        // Point toward B knowing that n points from A to B
        if(n.y < 0)
          normal = new Vector2d( 0, -1);
        else
          normal = new Vector2d( 0, 1 );
        penetration = y_overlap;
      }
    }
    else
      return false;
  }
  else
    return false;

  if(normal!=undefined&&penetration!=undefined){
    PositionalCorrection(A,B,normal,penetration);
    ResolveCollision(A,B,normal);
  }

  return true;
}
