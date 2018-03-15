"use strict"

class MainGameState{
  constructor(){
    this.game;
  }

  init(){
    this.game=new Game(this);
    var game=this.game;
    this.game.init(/*this.receivedData.Users*/null);
    var mainPanel=new UIPanel(null,0,0,display.getWidth(),display.getHeight());

    //메뉴창 버튼
    var menuBtn=new UIButton(Sprite.CHECK, display.getWidth()-100, 0, 100, 100, {
      entered: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.1);
      },
      exited: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.0);
      },
      pressed: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.2);
        var menuPanel=new UIPanel(Sprite.BLANK_IMAGE,display.getWidth()/2-300,display.getHeight()/2-200,600,400);
        mainPanel.addComponent(menuPanel);

        var btn=new UIButton(Sprite.BLANK_IMAGE, 300-100, 200-35, 200, 70, {
          entered: function(uiButton) {
            uiButton.label.setColor(0,0,0,0.1);
          },
          exited: function(uiButton) {
            uiButton.label.setColor(0,0,0,0.0);
          },
          pressed: function(uiButton) {
            uiButton.label.setColor(0,0,0,0.2);
            mainPanel.removeComponent(menuPanel.id);
            gsm.setState(GameState.TITLE_STATE);
          },
          released: function(uiButton) {
            uiButton.label.setColor(0,0,0,0.1);
          }
        });
        btn.setText("메인으로");

        menuPanel.addComponent(btn);
      },
      released: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.1);
      }
    });

    var selectPanel=new UIPanel(null,0,display.getHeight()-150,display.getWidth(),150);
    var selectBtn1=new UIButton(Sprite.CHECK, 0, 0, 0, 0, {
      entered: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.1);
      },
      exited: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.0);
      },
      pressed: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.2);
        game.doAction(function(){
          this.player.removeCostume();
        });
      },
      released: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.1);
      }
    });

    selectPanel.addComponent(selectBtn1);
    selectBtn1.setBound(1/7,0,1/7+1/7,1);
    selectBtn1.setText("sel");

    var selectBtn2=new UIButton(Sprite.CHECK, 0, 0, 0, 0, {
      entered: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.1);
      },
      exited: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.0);
      },
      pressed: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.2);
        game.doAction(function(){
        });
      },
      released: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.1);
      }
    });

    selectPanel.addComponent(selectBtn2);
    selectBtn2.setBound(3/7,0,3/7+1/7,1);
    selectBtn2.setText("sel");

    var selectBtn3=new UIButton(Sprite.CHECK, 0, 0, 0, 0, {
      entered: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.1);
      },
      exited: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.0);
      },
      pressed: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.2);
        game.doAction(function(){
        });
      },
      released: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.1);
      }
    });

    selectPanel.addComponent(selectBtn3);
    selectBtn3.setBound(5/7,0,5/7+1/7,1);
    selectBtn3.setText("sel");



    mainPanel.addComponent(menuBtn);
    mainPanel.addComponent(selectPanel);
    uiManager.addPanel(mainPanel);
  }

  //Game 클래스와의 연결 메서드
  doAction(func,arg){
    if(arg==undefined){
      Reflect.apply(func,this,[]);
      return;
    }
    Reflect.apply(func,this,arg);
  }

  reset(){
    this.game.reset();
    this.game=null;
    uiManager.clear();
  }

  update(){
    var msg=networkManager.pollMessage();
    if(msg!=null){
      this.messageProcess(msg);
    }

    this.game.update();
    uiManager.update();
  }

  messageProcess(message) {
    this.game.messageProcess(message);
  }

  render(display){
    // search(this.game.camera,this.game.world.rootQuad);

    // 쿼드트리 감지영역표시용
    // for(var id in Entity.list){
    //   let bound=Entity.list[id].body.bound;
    //
    //   let w=bound.getWidth();
    //   let h=bound.getHeight();
    //   let x=bound.getX()+w/2;
    //   let y=bound.getY()+h/2;
    //   this.game.camera.render(TextureLoader.get("images/blankImage.png"),x,y,w,h,0);
    // }

    this.game.render();
    uiManager.render(display);
  }

}

function search(camera,node){
  if(node==null)
    return;

  let w=node.bounds.getWidth();
  let h=node.bounds.getHeight();
  let x=node.bounds.getX()+w/2;
  let y=node.bounds.getY()+h/2;
  camera.render(TextureLoader.get("images/blankImage.png"),x,y,w,h,0);

  for(let i=0;i<4;i++){
    search(camera,node.nodes[i]);
  }
}
