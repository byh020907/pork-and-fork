"use strict"

class Game{
  constructor(mgs){
    this.mainGameState=mgs;
    this.camera=new Camera(new Vector2d(0,0),gl.viewportWidth,gl.viewportHeight);
    this.player;
    this.players=[];
    this.world=new World(new Rectangle(-1500,-1500,3000,3000));

    this.particles=[];
  }

  init(players){
    this.camera.setZoom(new Vector2d(1,1));
    this.camera.setPos(new Vector2d(0,0));

    this.player=new Player(gsm.cookie.userName, Math.random()*500-250,0);
    this.world.addBody(this.player.body);

    var ps=[];
    for(let p of players){
      let player=new Player(p.name, Math.random()*500-250,0);
      this.world.addBody(player);
      ps.push(player);
    }
    this.players=ps;


    var ground=new Polygon(0,400);
    ground.setVertices([
      new Vector2d(-1000,-50),
      new Vector2d(1000,-50),
      new Vector2d(1000,50),
      new Vector2d(-1000,50),
    ]);

    ground.setStatic();
    ground.setColor(0,0,0,0.5);
    ground.tag="ground";
    ground.body.rotateAngle=Math.PI*0.05;

    this.world.addBody(ground.body);

    ground=new Polygon(-1000,400);
    ground.setVertices([
      new Vector2d(-50,-1000),
      new Vector2d(50,-1000),
      new Vector2d(50,1000),
      new Vector2d(-50,1000),
    ]);
    ground.setStatic();
    ground.setColor(0,0,0,0.5);
    this.world.addBody(ground.body);

    ground=new Polygon(1000,400);
    ground.setVertices([
      new Vector2d(-50,-1000),
      new Vector2d(50,-1000),
      new Vector2d(50,1000),
      new Vector2d(-50,1000),
    ]);
    ground.setStatic();//setStatic은 항상 마지막에
    ground.setColor(0,0,0,0.5);
    this.world.addBody(ground.body);

    var centerPoint=new Polygon(0,0);
    centerPoint.setRegularPolygon(5,100);
    centerPoint.setStatic();//setStatic은 항상 마지막에
    centerPoint.setColor(0,0,0,0.5);
    this.world.addBody(centerPoint.body);

    this.timer = setInterval(() => {
      let { pos, velocity } = this.player.body;
      let position = pos;

      networkManager.send({
        'head': 'sync_character_request',
        'body': { position, velocity }
      });
    }, 100);

    // let c=new Circle(0,0);
    // c.setRadius(50);
    // c.body.angularVelocity=0.1;
    // c.setStatic();
    // this.world.addBody(c.body);
  }

  //MainGameState 클래스와의 연결 메서드
  doAction(func,arg){
    if(arg==undefined){
      Reflect.apply(func,this,[]);
      return;
    }

    Reflect.apply(func,this,arg);
  }

  reset(){
    clearInterval(this.timer);

    Entity.clear();
    this.world=null;
  }

  getWorldMousePos(){
    return mousePos.sub(new Vector2d(display.getWidth()/2,display.getHeight()/2)).add(this.camera.pos);
  }

  update(){
    this.camera.follow(this.player.body,0.05);

    this.player.body.angularVelocity+=0.05*(-this.player.body.rotateAngle);

    this.world.update();

    Entity.updateAll();

    if(isMousePressed(1)){
      /* for(let i=0;i<1;i++){
        let c=new Circle(this.player.nose.body.pos.x,this.player.nose.body.pos.y,25);
        c.body.angularVelocity=1.1;
        c.body.setMass(1);
        console.log(this.getWorldMousePos());
        console.log(this.player.body.pos);
        let v=this.getWorldMousePos().sub(this.player.nose.body.pos).normalize().scale(20);
        c.body.applyForce(v);
        this.world.addBody(c.body);
      } */
    }

    if(isKeyDown(65)){
      this.player.move(Math.PI);
    }

    if(isKeyDown(87)){
      this.player.jump(15);
    }

    if(isKeyDown(68)){
      this.player.move(0);
    }

    if(isKeyPressed(32)){

    }

    //zoom
    if(isKeyPressed(90)){
      this.camera.setZoom(this.camera.zoomScale.add(new Vector2d(0.1,0.1)));
    }

    //unzoom
    if(isKeyPressed(88)){
      this.camera.setZoom(this.camera.zoomScale.add(new Vector2d(-0.1,-0.1)));
    }

  }

  messageProcess(message) {
    switch (message.head) {
      case "quit_game_response": {
        if (message.body.result) {
          gsm.cookie.userName = "";
          gsm.setState(GameState.TITLE_STATE);
        }
      }break;

      case "join_game_report": {
          let { client } = message.body;
          let p=new Player(client.name,Math.random()*500-250,0);
          this.world.addBody(p.body);
          this.players.push(p);
      }break;

      case "sync_character_report":{
        for(let p of this.players){
          let clientName = message.body['client_name'];

          if(p.name===clientName){
            let { position, velocity } = message.body;

            p.body.pos.set(position.x, position.y);
            p.body.velocity.set(velocity.x, velocity.y);
          }
        }
      }break;

      case "invoke_input_report":{
        for(let p of this.players){
          let clientName = message.body['client_name'];

          if(p.name === clientName) {
            let { key, pressed } = message.body;
            p.keys[key] = pressed;
          }
        }
      }break;

      case "quit_game_report": {
        let clientName = message.body['client_name'];

        for (let p of this.players) {
          if (clientName===p.name) {
            console.log(`${p.name} quited`);

            this.world.removeBody(p.body.id);
            p.remove();
            this.players = this.players.filter(m => m.name !== p.name);

            break;
          }
        }
      }break;

      default:console.log("UnknownProtocol",message);
    }
  }

  render(){
    Entity.renderAll(this.camera);
  }
}
