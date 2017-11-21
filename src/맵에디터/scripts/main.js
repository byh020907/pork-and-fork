"use strict"
window.addEventListener("load",init,false);
var display;
var mapdata;
var gsm;
var uiManager;
function init(){
  display=new Display(window.innerWidth-400,window.innerHeight-10);

  mapdata=document.createElement("textarea");
  mapdata.rows=50;
  mapdata.cols=50;
  document.body.appendChild(mapdata);
  mapdata.style.position="absolute";
  mapdata.style.left=""+ (display.getWidth()+10) +"px";
  mapdata.style.top="0px";
  mapdata.value="hello";

  uiManager=new UIManager();
  gsm=new GameStateManager();

  gameLoop();
}

function gameLoop(){
  update();
  render();
  requestAnimationFrame(gameLoop);
}

function render(){
  display.clear();
  gsm.render(display);
  display.flush();
}

function update(){
  gsm.update();
  inputLoop();
}
