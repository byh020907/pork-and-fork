"use strict"

window.addEventListener("keydown",keyDown,false);
window.addEventListener("keyup",keyUp,false);
window.addEventListener("mousedown",mouseDown,false);
window.addEventListener("mouseup",mouseUp,false);
window.addEventListener("mousemove",mouseMove,false);

var keys=[];
var currentKeys=[];
var mouses=[];
var currentMouses=[];
var mouseXY={x:0,y:0};

function isKeyDown(keyCode) {
	return currentKeys[keyCode];
}

function isKeyPressed(keyCode) {
	return isKeyDown(keyCode)&&!keys[keyCode];
}

function isKeyReleased(keyCode){
	return !isKeyDown(keyCode)&&keys[keyCode];
}

function keyDown(e){
	currentKeys[e.keyCode]=true;
}

function keyUp(e){
	currentKeys[e.keyCode]=false;
}

function isMouseDown(which) {
	return currentMouses[which];
}

function isMousePressed(which) {
	return isMouseDown(which)&&!mouses[which];
}

function isMouseReleased(which){
	return !isMouseDown(which)&&mouses[which];
}

function mouseDown(e){
	switch (e.which) {
		case 1:break;
		case 2:break;
		case 3:break;
		default:break;
	}
	currentMouses[e.which]=true;
}

function mouseUp(e){
	switch (e.which) {
		case 1:break;
		case 2:break;
		case 3:break;
		default:break;
	}
	currentMouses[e.which]=false;
}

function getMouseX(){
	return mouseXY.x;
}

function getMouseY(){
	return mouseXY.y;
}

function mouseMove(e){
	mouseXY.x=e.pageX;
	mouseXY.y=e.pageY;
}

function inputLoop(){
	for(var i=0;i<300;i++){
		keys[i]=isKeyDown(i);
	}

	for(var i=1;i<=3;i++){
		mouses[i]=isMouseDown(i);
	}
}
