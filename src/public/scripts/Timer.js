"use strict"


/**
 * Timer
 * 일정시간동안 지연시키는 역할
 */
class Timer{
  constructor(){

  }

  static updateTimer(){
    ++Timer.counter;
  }
}

Timer.counter=0;
