"use strict"

function PolygonModel(owner,body){
  Model.apply(this,[owner]);

  this.vertices=body.vertices;
  var verticesData=[];
  for(let i=0;i<this.vertices.length;i++){
    verticesData.push(this.vertices[i].x);
    verticesData.push(this.vertices[i].y);
    verticesData.push(0);
  }
  this.renderAble.setVertices(verticesData);

  var indicesData=[];
  for(let i=0;i<this.vertices.length-2;i++){
    indicesData.push(0);
    indicesData.push(i+1);
    indicesData.push(i+2);
  }
  this.renderAble.setIndices(indicesData);
}

inherit(Model,PolygonModel);

PolygonModel.prototype.setVertices=function(){

}

PolygonModel.prototype.render = function (pMtrx,body) {
  var a=arguments;
  switch (a.length) {
    case 2:{

      let pMtrx=a[0];
      let body=a[1];

      this.render(pMtrx,body.pos.x,body.pos.y,body.width,body.height,body.rotateAngle);

    }break;

    case 6:{

      let pMtrx=a[0];
      let x=a[1];
      let y=a[2];
      let width=a[3];
      let height=a[4];
      let rad=a[5];

      var mvMatrix=mat4.create();
      mat4.identity(mvMatrix);

      var translation = vec3.create();
      vec3.set(translation, x, y, 0);
      mat4.translate(mvMatrix, mvMatrix, translation);

      mat4.rotateZ(mvMatrix, mvMatrix, rad);

      this.renderAble.render(mvMatrix,pMtrx);
    }break;

    default: OverloadingException();

  }
};
