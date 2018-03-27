"use strict"
var http=require('http');
var express=require('express');
var app=express();
var fs=require('fs');

app.use('/static', express.static('public'));

app.get('/',function(req,res){
  fs.readFile('index.html',function(error,data){
    if(error){
      console.log(error);
    }else{
      res.writeHead(200,{'Content-Type':'text/html'});
      res.end(data);
    }
  });
});

app.listen(3000,function(){
  console.log('Node Server Start! port:3000');
});
