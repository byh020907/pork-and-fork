"use strict"


/**
 * Timer
 * 일정시간동안 지연시키는 역할
 */
class Timer{
  constructor(){
    this.counter=0;
  }

  static updateTimer(){
    ++this.counter;
  }
}
