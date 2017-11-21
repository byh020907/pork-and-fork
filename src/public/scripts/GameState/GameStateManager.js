"use strict"

var GameStateManager=function(){
  this.list=[];
  this.currentState=GameState.MENU_STATE;

  this.list.push(new TitleState());
  this.list.push(new MainGameState());

  this.setState(GameState.MENU_STATE);
}

GameStateManager.prototype.setState=function(state){
  this.list[this.currentState].reset();
	this.currentState = state;
	this.list[this.currentState].init();
  console.log(this.list[this.currentState]);
}

GameStateManager.prototype.update=function(){
	this.list[this.currentState].update();
}

GameStateManager.prototype.render=function(display) {
	this.list[this.currentState].render(display);
}





//GameState






function GameState(){

}

GameState.MENU_STATE=0;
GameState.MAINGAME_STATE=1;

//미구현 함수(상속)
GameState.prototype.init=function(){}
GameState.prototype.reset=function(){}
GameState.prototype.update=function(){}
GameState.prototype.render=function(display){}
