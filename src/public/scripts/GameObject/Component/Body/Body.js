"use strict"

function Body(owner, vertices) {
    Component.apply(this, [owner]);
    this.width = 100;
    this.height = 100;
    this.radius = 50;

    this.vertices = vertices;

    this.pos = new Vector2d(0, 0);
    this.velocity = new Vector2d(0, 0);
    this.force = new Vector2d(0, 0);

    // Angular components
    this.rotateAngle = 0; // radians
    this.angularVelocity = 0;
    this.torque = 0;

    this.u = new Mat2d();

    this.mass = 1;
    this.inv_mass = 1 / this.mass;
    this.restitution = 0.5;

    this.inertia = 0;
    this.inv_inertia = 0;

    this.staticFriction = 0.5;
    this.dynamicFriction = 0.3;

    //중력 및 외부 힘
    this.G = new Vector2d();
}

inherit(Component, Body);

//각도는 적용하지않는다.
Body.prototype.getNormal = function(index) {
    var i = index;

    let p1 = this.vertices[i];
    // get the next vertex
    let p2 = this.vertices[i + 1 == this.vertices.length ? 0 : i + 1];
    // subtract the two to get the edge vector
    var edge = p1.sub(p2);

    // ===== 1. 지금 교차하는지 본다 =====
    // 지금 변에 수직인 축을 찾는다//시계방향
    var axis = new Vector2d(-edge.y, edge.x);
    axis.normalizeLocal();

    return axis;
}

Body.prototype.getSupport = function(dir) {
    var bestProjection = -Number.MAX_VALUE;
    var bestVertex = null;

    for (let i = 0; i < this.vertices.length; ++i) {
        let v = this.vertices[i];
        let projection = v.dot(dir);

        if (projection > bestProjection) {
            bestVertex = v;
            bestProjection = projection;
        }
    }

    return bestVertex;
}

Body.prototype.applyForce = function(f) {
    // force += f;
    this.force.addLocal(f);
}

Body.prototype.applyImpulse = function(impulse, contactVector) {
    this.velocity.addLocal(impulse.scale(this.inv_mass));
    this.angularVelocity += this.inv_inertia * contactVector.cross(impulse);
}

Body.prototype.getX = function() {
    return this.minX;
}

Body.prototype.getY = function() {
    return this.minY;
}

Body.prototype.getWidth = function() {
    return this.width;
}

Body.prototype.getHeight = function() {
    return this.height;
}

Body.prototype.update = function() {
        this.u.setRotation(this.rotateAngle);
        //aabb 경계구역 설정
        if (this.vertices != null) {
            let vertex = this.pos.add(this.u.mul(this.vertices[0]));
            let minX = vertex.x;
            let minY = vertex.y;
            let maxX = vertex.x;
            let maxY = vertex.y;
            for (let i = 0; i < this.vertices.length; i++) {
                vertex = this.pos.add(this.u.mul(this.vertices[i]));
                if (vertex.x < minX) {
                    minX = vertex.x;
                }
                if (vertex.x > maxX) {
                    maxX = vertex.x;
                }
                if (vertex.y < minY) {
                    minY = vertex.y;
                }
                if (vertex.y > maxY) {
                    maxY = vertex.y;
                }
            }
            this.width = maxX - minX;
            this.height = maxY - minY;
            this.minX = minX;
            this.minY = minY;
        }

        // this.updateSpeed();
    }
    //일단 회전적용 제거
Body.prototype.updateSpeed = function() {
    this.velocity.addLocal(this.force.scale(1.0 / this.mass));
    this.velocity.addLocal(this.G);
    // this.angularVelocity += this.torque * (1.0 / this.inertia);

    this.pos.addLocal(this.velocity);
    this.rotateAngle += this.angularVelocity;

    this.force.x = 0;
    this.force.y = 0;
    this.torque = 0;
}

Body.prototype.setMass = function(mass) {
    if (mass != 0) {
        this.mass = mass;
        this.inv_mass = 1 / this.mass;
        return;
    }
    this.mass = 0;
    this.inv_mass = 0;
}

Body.prototype.setInertia = function(inertia) {
    if (inertia != 0) {
        this.mass = inertia;
        this.inv_mass = 1 / this.mass;
        return;
    }
    this.inertia = 0;
    this.inv_inertia = 0;
}
