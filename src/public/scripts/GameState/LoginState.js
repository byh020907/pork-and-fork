"use strict"
class LoginState extends GameState {

  constructor(){
    super();
    this.blankImage=TextureLoader.get("images/blankImage.png");
  }

  init() {
    //메인 판넬//백그라운드
    var mainPanel = new UIPanel(null, 0, 0, display.getWidth(), display.getHeight());

    var loginPanel=new UIPanel(this.blankImage, display.getWidth() / 2 - 350, display.getHeight() / 2 - 200, 700, 500);

    var goToLoginBtn=new UIButton(this.blankImage, 0, -100, 150, 100,null);

    var goToRegisterBtn=new UIButton(this.blankImage, 150, -100, 150, 100, {
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
        gsm.setState(GameState.MAINGAME_STATE);
      }
    });

    var idText=new UITextField(this.blankImage, 150, 200, 400, 50, {
      entered: function(uiButton) {
        uiButton.label.setColor(0,0,0,0.1);
      },
      exited: function(uiButton) {
        uiButton.isFocus=false;
        uiButton.label.setColor(0,0,0,0.0);
      },
      pressed: function(uiButton) {
        uiButton.isFocus=true;
        uiButton.label.setColor(0,0,0,0.2);
      },
      released: function(uiButton) {
      }
    });

    //빨리 넣을수록 아래로간다
    loginPanel.addComponent(goToLoginBtn);
    loginPanel.addComponent(goToRegisterBtn);
    loginPanel.addComponent(idText);
    mainPanel.addComponent(loginPanel);
    uiManager.addPanel(mainPanel);
  }

  reset() {
    uiManager.clear();
  }

  update() {
    uiManager.update();
  }

  render(display) {
    uiManager.render(display);
  }
}
