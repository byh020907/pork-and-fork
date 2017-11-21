"use strict"

function CircleCollision(owner,body){
  Collision.apply(this,[owner]);
  this.body=body;
}

inherit(Collision,CircleCollision);

CircleCollision.prototype.hitTest=function(collision){
  if(collision instanceof CircleCollision)
    return CirclevsCircle(this.owner.body,collision.owner.body);
  if (collision instanceof PolygonCollision)
    return CirclevsPolygon(this.owner.body, collision.owner.body);
}

function CirclevsCircle(m,A,B)
{

  var normal;
  var penetration;

  // Vector from A to B
  var n = B.pos.sub(A.pos);

  var r = A.radius + B.radius;
  var r2=r*r;

  if(n.lengthSquared() > r2)
    return;

  // Circles have collided, now compute manifold
  var d = n.length() // perform actual sqrt

  // If distance between circles is not zero
  if(d != 0)
  {
    // Distance is difference between radius and distance
    penetration = r - d;

    // Utilize our d since we performed sqrt on it already within Length( )
    // Points from A to B, and is a unit vector
    normal=n.scale(1/d);
  }

  // Circles are on same position
  else
  {
    // Choose random (but consistent) values
    penetration = A.radius;
    normal = new Vector2d(1,0);
  }

  m.normal=normal;
  m.penetration=penetration;
  m.contactCount=1;
}
