"use strict"
class InRoomState extends GameState {

  constructor(){
    super();
    this.isReady=false;
  }

  reloadFunc(roomPanel){
    var self=this;

    var startX=50;
    var startY=80;
    var width=250;
    var height=250;

    roomPanel.clear();

    var readyBtn=new UIButton(Sprite.BROWN, this.roomPanel.body.width/2, 10, 200, 50, {
      entered: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.1);
      },

      exited: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.0);
      },

      pressed: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.2);
      },

      released: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.1);
        self.setReady(uiButton);
      }
    });
    readyBtn.setText("READY");

    var quitBtn=new UIButton(Sprite.BROWN, this.roomPanel.body.width/2+220, 10, 200, 50, {
      entered: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.1);
      },

      exited: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.0);
      },

      pressed: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.2);
      },

      released: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.1);
        var data={};
        data.Protocol="QuitRoomRequest";
        data.RoomID=self.receivedData.Room.id;
        networkManager.send(data);
        gsm.setState(GameState.LOBBY_STATE);
      }
    });
    quitBtn.setText("Quit");

    //우측 상단 자신의 자리
    let smallPanel=new UIPanel(Sprite.WHITE,startX, startY, width, height);

    let playerName=new UIButton(Sprite.GRAY, 0, height*(3/4), width, height/4, null);
    playerName.setText(this.userID);

    let btn=new UIButton(Sprite.VOID, 0, 0, width, height, {
      entered: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.1);
      },

      exited: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.0);
      },

      pressed: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.2);
      },

      released: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.1);
      }
    });

    smallPanel.addComponent(playerName);
    smallPanel.addComponent(btn);
    roomPanel.addComponent(smallPanel);

    roomPanel.addComponent(readyBtn);
    roomPanel.addComponent(quitBtn);

    startX=350;
    startY=80;
    width=120;
    height=120;
    var xMargin=30;
    var yMargin=30;

    var num=0;

    for(let i=0;i<self.playerList.users.length;i++){
      let x=num%2;
      let y=Math.floor(num/2);

      if(self.playerList.users[i].id==this.userID)
        continue;
      else ++num;

      let smallPanel=new UIPanel(Sprite.WHITE, startX+x*(width+xMargin), startY+y*(height+yMargin), width, height);

      let playerName=new UIButton(Sprite.GRAY, 0, height*(3/4), width, height/4, null);
      playerName.setText(self.playerList.users[i].id);

      let btn=new UIButton(Sprite.VOID, 0, 0, width, height, {
        entered: function(uiButton) {
          uiButton.label.setColor(0,0,0,0.1);
        },

        exited: function(uiButton) {
          uiButton.label.setColor(0,0,0,0.0);
        },

        pressed: function(uiButton){
          uiButton.label.setColor(0,0,0,0.2);
        },

        released: function(uiButton) {
          uiButton.label.setColor(0,0,0,0.1);
        }
      });

      smallPanel.addComponent(playerName);
      smallPanel.addComponent(btn);
      roomPanel.addComponent(smallPanel);

    }

  }

  setReady(uiButton){
    this.isReady=!this.isReady;
    if(this.isReady)
      uiButton.setText("READY true");
    else uiButton.setText("READY false");
  }

  init() {
    console.log(this.receivedData);
    this.userID=gsm.cookie.UserID;
    let users=[];
    for(var id in this.receivedData.Room.list){
      users.push(this.receivedData.Room.list[id]);
    }
    this.playerList={
      master:this.receivedData.Room.master.id,
      users:users
    };

    var self=this;

    //메인 판넬//백그라운드
    var mainPanel = new UIPanel(Sprite.GREEN, 0, 0, display.getWidth(), display.getHeight());

    this.roomPanel=new UIPanel(Sprite.BEIGE, display.getWidth()/4, 50, display.getWidth()/2, 700);

    this.reloadFunc(this.roomPanel);

    mainPanel.addComponent(this.roomPanel);
    uiManager.addPanel(mainPanel);
  }

  reset() {
    uiManager.clear();
    this.userID=null;
    this.playerList={};
    this.isReady=false;
  }

  update() {
    var msg=networkManager.pollMessage();
    if(msg!=null){
      this.messageProcess(msg);
    }
    uiManager.update();
  }

  messageProcess(message) {
    switch (message.Protocol) {

      case "JoinRoomUser":{
        this.playerList.users.push(message.User);
        this.reloadFunc(this.roomPanel);
      }break;

      case "QuitRoomReport":{
        let index=-1;
        for(index=0;index<this.playerList.users.length;index++){
          if(this.playerList.users[index].id==message.UserID){
            break;
          }
        }

        this.playerList.users.splice(index,1);
        this.reloadFunc(this.roomPanel);
      }break;

      case "KickRoomReport":{
        gsm.setState(GameState.LOBBY_STATE);
      }break;

      case "StartGameReport":{

      }break;

      default:console.log("UnknownProtocol",message);

    }
  }

  render(display) {
    uiManager.render(display);
  }
}
