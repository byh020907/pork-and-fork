"use strict"

class NetworkManager{
  constructor(ip,port){
    this.socket = io.connect(`http://$(ip):$(port)`);

    this.socket.on("auth.login",function(data){

    });
  }
}
