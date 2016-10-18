var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var io = require('socket.io');
//var http = require('http');

var app = express();

app.use(bodyParser.json());

var games = [];

function availableGame(){
  console.log('gameslength',games.length);
  if(games.length > 0){
    console.log('lastgame',games[games.length-1]);
    return (games[games.length-1].player2 === null);
  }
}

function joinGame(player){
  var game = games[games.length-1];
  game.player2 = player;
  return game;
}

var Game = function(player){
  var game = {};
  game.player1 = player;
  game.player2 = null; 
  game.gameId = games.length; 
  return game;
};


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(__dirname + '/../client'));  //**/*.html


app.post('/user',function(req,res,next){
  //sign in and assign games
  var game = null;

  if(availableGame()){
    game = joinGame(req.body);
  }
  else {
    games.push(new Game(req.body));
    game = games[games.length-1];
  }
  console.log('games',games);
  res.send(game);
  
});

app.get('/game',function(req,res,next){
  //polled while waiting for opponent
  
  var username = req.query.username;
  var game = games.filter(function(_game){
    return (_game.player1 && _game.player2) 
            && (_game.player1.username === req.query.username || req.query.username === _game.player2.username);
  })[0];
  
  if(game){
    res.send(game);
  } else {
    res.send({match: 'no match yet'});
  }
  
})

app.post('/turn',function(req,res,next){
  games[req.body.gameId] = req.body; 
  res.send(games[req.body.gameId]);
})

app.get('/turn',function(req,res,next){
  var gameid = req.query.gameid;
  console.log('gameid requested',gameid)
  res.send(games[gameid]);
});

app.listen(process.env.PORT || 5000);

module.exports = app;