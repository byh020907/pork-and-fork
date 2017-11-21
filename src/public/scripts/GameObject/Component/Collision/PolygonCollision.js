"use strict"

function PolygonCollision(owner, body) {
    Collision.apply(this, [owner]);
    this.body=body;
}

inherit(Collision, PolygonCollision);

PolygonCollision.prototype.hitTest = function(collision) {
    if (collision instanceof PolygonCollision)
        return PolygonvsPolygon(this.owner.body, collision.owner.body);
    if (collision instanceof CircleCollision)
        return CirclevsPolygon(collision.owner.body, this.owner.body);
}

// 축에 대한 다각형의 정사영을 계산하고 [min, max] 간격을 반환한다.
function ProjectPolygon(axis, polygon) {
    // 점을 축에 정사영하기 위해 내적을 쓴다

    var dotProduct = axis.dot(polygon.pos.add(polygon.u.mul(polygon.vertices[0])));
    var min = dotProduct;
    var max = dotProduct;
    for (let i = 0; i < polygon.vertices.length; i++) {
        dotProduct = axis.dot(polygon.pos.add(polygon.u.mul(polygon.vertices[i])));
        if (dotProduct < min) {
            min = dotProduct;
        } else if (dotProduct > max) {
            max = dotProduct;
        }
    }

    return {
        min: min,
        max: max
    };
}

// 축에 대한 다각형의 정사영을 계산하고 [min, max] 간격을 반환한다.
function ProjectCircle(axis, circle) {
    // 점을 축에 정사영하기 위해 내적을 쓴다

    var dotProduct = axis.dot(circle.pos);
    var min = dotProduct - circle.radius;
    var max = dotProduct + circle.radius;

    return {
        min: min,
        max: max
    };
}

// [minA, maxA]와 [minB, maxB] 사이의 거리를 계산한다
// 구간이 겹치면 거리는 음수다
function IntervalDistance(minA, maxA, minB, maxB) {
    if (minA < minB) {
        return minB - maxA;
    } else {
        return minA - maxB;
    }
}

//구버전(ContactPoint 고려x)
function PolygonvsPolygon(m, A, B) {

    // var contacts = []; //길이는 최대 2
    // var contactCount = 0;
    var normal;
    var penetration = Number.MAX_VALUE;

    var edgeCountA = A.vertices.length;
    var edgeCountB = B.vertices.length;

    // 두 다각형의 모든 변에 대해 루프
    for (let edgeIndex = 0; edgeIndex < edgeCountA + edgeCountB; edgeIndex++) {
        var axis;
        // ===== 1. 지금 교차하는지 본다 =====
        // 지금 변에 수직인 축을 찾는다
        if (edgeIndex < edgeCountA) {
            axis = A.u.mul(A.getNormal(edgeIndex));
        } else {
            axis = B.u.mul(B.getNormal(edgeIndex-edgeCountA));
        }

        // 지금 축에 다각형을 정사영한다
        var ADot = ProjectPolygon(axis, A);
        var BDot = ProjectPolygon(axis, B);

        var minA = ADot.min;
        var minB = BDot.min;
        var maxA = ADot.max;
        var maxB = BDot.max;

        var intervalDistance = IntervalDistance(minA, maxA, minB, maxB);
        // 지금 교차하는지 검사한다
        if (intervalDistance > 0)
            return;

        intervalDistance = Math.abs(intervalDistance);

        // if ((minA<minB&&maxB<maxA) || (minB<minA&&maxA<maxB)) {
        //   // get the overlap plus the distance from the minimum end points
        //   let mins = Math.abs(minA - minB);
        //   let maxs = Math.abs(maxA - maxB);
        //   // NOTE: depending on which is smaller you may need to
        //   // negate the separating axis!!
        //   if (mins < maxs) {
        //     intervalDistance += mins;
        //   } else {
        //     intervalDistance += maxs;
        //   }
        //   console.log("겹침");
        // }

        // 지금 간격이 최소 간격인지 확인한다. 최소 옮김 벡터를 구하는 데 쓴다
        if (intervalDistance < penetration) {
            penetration = intervalDistance;
            normal = axis;

            let d = B.pos.sub(A.pos);
            if (normal.dot(d) < 0)
                normal = normal.scale(-1);
        }
    }
    // console.log(normal,penetration);

    m.normal=normal;
    m.penetration=penetration;
    m.contactCount=1;
}

function findAxisLeastPenetration(faceIndex, A, B) {
    var bestDistance = -Number.MAX_VALUE;
    var bestIndex = 0;

    for (let i = 0; i < A.vertices.length; ++i) {
        // Retrieve a face normal from A
        // Vec2 n = A->m_normals[i];
        // Vec2 nw = A->u * n;
        var n=A.getNormal(i);
        var nw = A.u.mul(n);

        // Transform face normal into B's model space
        // Mat2 buT = B->u.Transpose( );
        // n = buT * nw;
        var buT = B.u.transpose();
        n = buT.mul(nw);

        // Retrieve support point from B along -n
        // Vec2 s = B->GetSupport( -n );
        var s = B.getSupport(n.scale(-1));

        // Retrieve vertex on face from A, transform into
        // B's model space
        // Vec2 v = A->m_vertices[i];
        // v = A->u * v + A->body->position;
        // v -= B->body->position;
        // v = buT * v;
        var v = A.vertices[i];
        v=A.u.mul(v).add(A.pos);
        v.subLocal(B.pos);
        v=buT.mul(v);

        // Compute penetration distance (in B's model space)
        // real d = Dot( n, s - v );
        let d = n.dot(s.sub(v));

        // Store greatest distance
        if (d > bestDistance) {
            bestDistance = d;
            bestIndex = i;
        }
    }

    faceIndex[0] = bestIndex;
    return bestDistance;
}

function findIncidentFace(v, RefPoly, IncPoly, referenceIndex) {
    var referenceNormal = RefPoly.getNormal(referenceIndex);

    // Calculate normal in incident's frame of reference
    // referenceNormal = RefPoly->u * referenceNormal; // To world space
    // referenceNormal = IncPoly->u.Transpose( ) * referenceNormal; // To
    // incident's model space
    referenceNormal = RefPoly.u.mul(referenceNormal); // To world space
    referenceNormal = IncPoly.u.transpose().mul(referenceNormal); // To incident's model space

    // Find most anti-normal face on incident polygon
    var incidentFace = 0;
    var minDot = Number.MAX_VALUE;
    for (let i = 0; i < IncPoly.vertices.length; ++i) {
        // real dot = Dot( referenceNormal, IncPoly->m_normals[i] );
        let dot = referenceNormal.dot(IncPoly.getNormal(i));

        if (dot < minDot) {
            minDot = dot;
            incidentFace = i;
        }
    }

    // Assign face vertices for incidentFace
    // v[0] = IncPoly->u * IncPoly->m_vertices[incidentFace] +
    // IncPoly->body->position;
    // incidentFace = incidentFace + 1 >= (int32)IncPoly->m_vertexCount ? 0 :
    // incidentFace + 1;
    // v[1] = IncPoly->u * IncPoly->m_vertices[incidentFace] +
    // IncPoly->body->position;

    v[0] = IncPoly.u.mul(IncPoly.vertices[incidentFace]).add(IncPoly.pos);
    incidentFace = (incidentFace + 1 == IncPoly.vertices.length) ? 0 : incidentFace + 1;
    v[1] = IncPoly.u.mul(IncPoly.vertices[incidentFace]).add(IncPoly.pos);
}

function clip(n, c, face) {
    var sp = 0;
    var out = [
        face[0].clone(),
        face[1].clone()
    ];

    // Retrieve distances from each endpoint to the line
    // d = ax + by - c
    // real d1 = Dot( n, face[0] ) - c;
    // real d2 = Dot( n, face[1] ) - c;
    var d1 = n.dot(face[0]) - c;
    var d2 = n.dot(face[1]) - c;

    // If negative (behind plane) clip
    // if(d1 <= 0.0f) out[sp++] = face[0];
    // if(d2 <= 0.0f) out[sp++] = face[1];
    if (d1 <= 0.0) out[sp++].set(face[0]);
    if (d2 <= 0.0) out[sp++].set(face[1]);

    // If the points are on different sides of the plane
    if (d1 * d2 < 0.0) // less than to ignore -0.0f
    {
        // Push intersection point
        // real alpha = d1 / (d1 - d2);
        // out[sp] = face[0] + alpha * (face[1] - face[0]);
        // ++sp;

        let alpha = d1 / (d1 - d2);

        out[sp++]=face[0].add(face[1].sub(face[0]).scale(alpha));
    }

    // Assign our new converted values
    face[0] = out[0];
    face[1] = out[1];

    // assert( sp != 3 );

    return sp;
}

function PolygonvsPolygon(m,A, B) {

    var contacts = [new Vector2d(),new Vector2d()]; //길이는 최대 2
    var contactCount = 0;
    var normal;
    var penetration = Number.MAX_VALUE;

    // Check for a separating axis with A's face planes
    var faceA = [0];
    var penetrationA = findAxisLeastPenetration(faceA, A, B);
    if (penetrationA >= 0.0) {
        return false;
    }

    // Check for a separating axis with B's face planes
    var faceB = [0];
    var penetrationB = findAxisLeastPenetration(faceB, B, A);
    if (penetrationB >= 0.0) {
        return false;
    }

    var referenceIndex;
    var flip; // Always point from a to b

    var RefPoly; // Reference
    var IncPoly; // Incident

    // Determine which shape contains reference face
    if (penetrationA>=penetrationB*0.95+penetrationA*0.01) {
        RefPoly = A;
        IncPoly = B;
        referenceIndex = faceA[0];
        flip = false;
    } else {
        RefPoly = B;
        IncPoly = A;
        referenceIndex = faceB[0];
        flip = true;
    }

    //여기 까진 문제 없어 보임(console.log()로 찍어보았다)

    // World space incident face
    var incidentFace = [new Vector2d(0,0),new Vector2d(0,0)];

    findIncidentFace(incidentFace, RefPoly, IncPoly, referenceIndex);
    // y
    // ^ .n ^
    // +---c ------posPlane--
    // x < | i |\
    // +---+ c-----negPlane--
    // \ v
    // r
    //
    // r : reference face
    // i : incident poly
    // c : clipped point
    // n : incident normal


    // Setup reference face vertices
    var v1 = RefPoly.vertices[referenceIndex];
    referenceIndex = (referenceIndex + 1 == RefPoly.vertices.length) ? 0 : referenceIndex + 1;
    var v2 = RefPoly.vertices[referenceIndex];

    // Transform vertices to world space
    // v1 = RefPoly->u * v1 + RefPoly->body->position;
    // v2 = RefPoly->u * v2 + RefPoly->body->position;
    v1 = RefPoly.u.mul(v1).add(RefPoly.pos);
    v2 = RefPoly.u.mul(v2).add(RefPoly.pos);

    // Calculate reference face side normal in world space
    // Vec2 sidePlaneNormal = (v2 - v1);
    // sidePlaneNormal.Normalize();
    var sidePlaneNormal = v2.sub(v1);
    sidePlaneNormal.normalizeLocal();

    // Orthogonalize
    // Vec2 refFaceNormal( sidePlaneNormal.y, -sidePlaneNormal.x );
    var refFaceNormal = new Vector2d(sidePlaneNormal.y, -sidePlaneNormal.x);

    // ax + by = c
    // c is distance from origin
    // real refC = Dot( refFaceNormal, v1 );
    // real negSide = -Dot( sidePlaneNormal, v1 );
    // real posSide = Dot( sidePlaneNormal, v2 );
    var refC = refFaceNormal.dot(v1);
    var negSide = -sidePlaneNormal.dot(v1);
    var posSide = sidePlaneNormal.dot(v2);

    // Clip incident face to reference face side planes
    // if(Clip( -sidePlaneNormal, negSide, incidentFace ) < 2)
    if (clip(sidePlaneNormal.scale(-1), negSide, incidentFace) < 2) {
        return; // Due to floating point error, possible to not have required
        // points
    }

    // if(Clip( sidePlaneNormal, posSide, incidentFace ) < 2)
    if (clip(sidePlaneNormal, posSide, incidentFace) < 2) {
        return; // Due to floating point error, possible to not have required
        // points
    }

    // Flip
    normal=refFaceNormal.clone();
    if (flip) {
        normal=normal.scale(-1);
    }

    // Keep points behind reference face
    var cp = 0; // clipped points behind reference face
    var separation = refFaceNormal.dot(incidentFace[0]) - refC;
    if (separation <= 0.0) {
        contacts[cp]=incidentFace[0];
        penetration = -separation;
        ++cp;
    } else {
        penetration = 0;
    }

    separation = refFaceNormal.dot(incidentFace[1]) - refC;

    if (separation <= 0.0) {
        contacts[cp]=incidentFace[1];

        penetration += -separation;
        ++cp;

        // Average penetration
        penetration /= cp;
    }

    contactCount = cp;

    m.normal=normal;
    m.penetration=penetration;
    m.contacts=contacts;
    m.contactCount=contactCount;

    return true;
}

function CirclevsPolygon(m,A, B) {

    var normal;
    var penetration = Number.MAX_VALUE;

    var edgeCount = B.vertices.length;

    var edge;

    var center = A.pos;

    var separation = -Number.MAX_VALUE;
    var faceNormalIndex = 0;
    var faceNormal;


    // 두 다각형의 모든 변에 대해 루프
    for (let edgeIndex = 0; edgeIndex < edgeCount; edgeIndex++) {
        // get the current vertex
        let axis = B.u.mul(B.getNormal(edgeIndex));

        let s = axis.dot(center.sub(B.pos.add(p1)));

        if (s > A.radius)
            return;

        if (s > separation) {
            separation = s;
            faceNormalIndex = edgeIndex;
            faceNormal = axis;
        }
    }

    var v1 = B.pos.add(B.u.mul(B.vertices[faceNormalIndex]));
    var v2 = B.pos.add(B.u.mul(B.vertices[faceNormalIndex + 1 == B.vertices.length ? 0 : faceNormalIndex + 1]));

    // Check to see if center is within polygon
    if (separation < 0.0001) {
        normal = faceNormal.scale(-1);
        penetration = A.radius;

        m.normal=normal;
        m.penetration=penetration;
        m.contactCount=1;
        return;
    }

    var dot1 = center.sub(v1).dot(v2.sub(v1));
    var dot2 = center.sub(v2).dot(v1.sub(v2));

    penetration = A.radius - separation;

    // Closest to v1
    if (dot1 <= 0.0) {
        if (center.sub(v1).lengthSquared() > A.radius * A.radius)
            return;
        let n = v1.sub(center);
        penetration = Math.abs(n.length() - A.radius);
        n.normalizeLocal();
        normal = n;
    }

    // Closest to v2
    else if (dot2 <= 0.0) {
        if (center.sub(v2).lengthSquared() > A.radius * A.radius)
            return;
        let n = v2.sub(center);
        penetration = Math.abs(n.length() - A.radius);
        n.normalizeLocal();
        normal = n;
    }

    // Closest to face
    else {
        let n = faceNormal;
        if (center.sub(v1).dot(n) > A.radius)
            return;
        normal = n.scale(-1);
    }

    m.normal=normal;
    m.penetration=penetration;
    m.contactCount=1;
}

function PolygonvsCircle(m,A, B) {
  return CirclevsPolygon(m,B, A);
}

Collision.dispatch=[
  [CirclevsCircle,CirclevsPolygon],
  [PolygonvsCircle,PolygonvsPolygon]
];
