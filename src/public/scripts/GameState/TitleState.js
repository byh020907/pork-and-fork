"use strict"
// 오늘해결할것-> 1.text출력의 일원화
//               2.ui출력할때 정렬되는거 잘되게
//               3.해상도 조절 자유롭게 되게만들기
class TitleState extends GameState{
  constructor(){
    super();
    this.camera=new Camera(new Vector2d(0,0),gl.viewportWidth,gl.viewportHeight);
  }

  init(){

    var self = this;
    //투명 메인 판넬
    var mainPanel=new UIPanel(Sprite.GREEN,0,0,display.getWidth(),display.getHeight());

    //메인 로고
    mainPanel.addComponent(new UIButton(Sprite.PAF_LOGO,display.getWidth()/2-210,display.getHeight()/2-250,400,300,{
      entered:function(uiButton){
        // uiButton.body.width=200/1.5;
        // uiButton.body.height=100/1.5;
      },
      exited:function(uiButton){
        // uiButton.body.width=200;
        // uiButton.body.height=100;
      },
      pressed:function(uiButton){},
      released:function(uiButton){}
    }));

    var nameBackground=new UIComponent(Sprite.WHITE,display.getWidth()/2-200,display.getHeight()/2+50,400, 50);

    this.nameText=new UITextField(Sprite.INPUT_LINE,display.getWidth()/2-200,display.getHeight()/2+50,400, 50, {
      entered: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.1);
      },
      exited: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.0);
      },
      pressed: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.2);
        uiButton.isFocus=true;
      },
      released: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.1);
      }
    });

    this.nameText.setText("EnterName");

    var startBtn=new UIButton(Sprite.BROWN,display.getWidth()/2-100,display.getHeight()/2+150,200,100,{
      entered:function(uiButton){
        uiButton.body.width=200/1.1;
        uiButton.body.height=100/1.1;
        uiButton.label.body.width=uiButton.body.width/1.1;
        uiButton.label.body.height=uiButton.body.height/1.1;
        uiButton.textLabel.body.width=uiButton.body.width/2/1.1;
        uiButton.textLabel.body.height=uiButton.body.height/2/1.1;
      },
      exited:function(uiButton){
        uiButton.body.width=200;
        uiButton.body.height=100;
        uiButton.label.body.width=uiButton.body.width;
        uiButton.label.body.height=uiButton.body.height;
        uiButton.textLabel.body.width=uiButton.body.width/2;
        uiButton.textLabel.body.height=uiButton.body.height/2;
      },
      pressed:function(uiButton){

      },
      released:function(uiButton){
        let name = self.nameText.textLabel.text;

        if (name) {
          networkManager.send({
              'head': 'join_game_request',
              'body': { name }
          });
        }

        self.nameText.setText("");
      }
    });
    startBtn.setText("Start");

    mainPanel.addComponent(nameBackground);
    mainPanel.addComponent(this.nameText);
    //start버튼
    mainPanel.addComponent(startBtn);

    uiManager.addPanel(mainPanel);
  }
  reset(){
    uiManager.clear();
  }

  update(){
    let msg = networkManager.pollMessage();

    if (msg != null) {
      this.messageProcess(msg);
    }

    uiManager.update();
  }

  render(display){
    uiManager.render(display);
  }

  messageProcess(message){
    switch(message.head) {
        case "join_game_response": {
          if (message.body.result) {
            let { clients } = message.body;
            gsm.setState(GameState.MAINGAME_STATE, { clients });
          }

          break;
        }

        default: {
          console.log("Unknown Protocol");
        }
    }
  }
}
