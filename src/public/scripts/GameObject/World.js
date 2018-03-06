"use strict"

class World {

    constructor(bound) {
        this.rootQuad = new QuadTree(0, bound);
        this.bodyList = [];
        this.iterations = 1;
    }

    update() {
        let contacts = [];

        this.rootQuad.clear();
        for (let body of this.bodyList) {
            this.rootQuad.insert(body);
        }

        var returnObjects = [];
        for (let body of this.bodyList) {
            returnObjects = [];
            this.rootQuad.retrieve(returnObjects, body);

            for (let x = 0; x < returnObjects.length; x++) {
                let r = returnObjects[x];
                if (body == r)
                    continue;
                //manifold 얻기
                let contact = Contact.ObjectPool.alloc();
                contact.init(body,r);
                contact.solve();
                //둘다 static 물체이면 NaN오류가 발생한다.
                if (contact.contactCount >= 1&&(body.inv_mass!==0||r.inv_mass!==0)) {
                    contacts.push(contact);
                    body.owner.hitProcess(r.owner);
                }else{
                    Contact.ObjectPool.free(contact);
                }
            }

        }

        for (let body of this.bodyList) {
            this.integrateForce(body);
        }

        for (let contact of contacts) {
            contact.initialize();
        }

        for (let i = 0; i < this.iterations; i++) {
            for (let contact of contacts) {
                contact.resolveCollision();
            }
        }

        for (let body of this.bodyList) {
            this.integrateVelocity(body);
        }
        for (let contact of contacts) {
            contact.positionalCorrection();
        }

        for (let body of this.bodyList) {
            body.force.set(0, 0);
            body.torque = 0;
        }

        //free
        for (let i=0;i<contacts.length;++i) {
            Contact.ObjectPool.free(contacts[i]);
        }
        // console.log(contacts.length);
    }

    //0.5만큼만 진행
    integrateForce(body) {

        if (body.inv_mass == 0)
            return;

        body.velocity.addLocal(body.force.scale(body.inv_mass * 0.5));
        body.velocity.addLocal(World.GRAVITY.scale(0.5));
        body.angularVelocity += body.torque * body.inv_inertia * 0.5;
    }

    integrateVelocity(body) {

        if (body.inv_mass == 0)
            return;

        body.pos.addLocal(body.velocity);
        body.rotateAngle += body.angularVelocity;

        //한번더 해서 1을 만든다.
        this.integrateForce(body);
    }

    addBody(body) {
        this.bodyList.push(body);
    }

    clear() {
        this.bodyList = [];
    }
}

World.GRAVITY = new Vector2d(0, 0.4);
