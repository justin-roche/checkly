var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var io = require('socket.io');

var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);


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






var MatchingService = function(){

  this.unmatchedPlayers = [];
  this.currentMatches = {};  //equivalent to join table on socket ids

  this.addPlayer = function(id){
    this.unmatchedPlayers.push(id); 
  }

  this.getOpponentId = function(id){
    return this.currentMatches[id];
  }

  this.addMatch = function(players){
    this.currentMatches[players[0]] = players[1]; 
    this.currentMatches[players[1]] = players[0]; 
  }

  this.getNewMatch = function(){
    if(this.unmatchedPlayers.length > 1){
      var match = [this.unmatchedPlayers[0], this.unmatchedPlayers[1]];
      this.unmatchedPlayers.splice(0,2);
      this.addMatch(match);
      return match;
    }
  }

  this.deleteMatchByPlayerId = function(id){
    var p2 = this.currentMatches[id];
    delete this.currentMatches[id];
    delete this.currentMatches[p2];
  }

}

var matchingService = new MatchingService();


io.on('connection', function(client) { 
    var id = client.id; 


    client.on('login',function(data){
      console.log('logging in user')
      matchingService.addPlayer(id);
      var match = matchingService.getNewMatch();
      
      if(match){
        console.log('emitting match to...',match[0],match[1]);
        io.to(match[0]).emit('match',1);
        io.to(match[1]).emit('match',2);
      }
    });

    client.on('join', function(data) {
      
      //io.to(socketid).emit('message', 'for your eyes only');
    });

    client.on('end',function(data){
      //send to opponent;
    });

    client.on('turn',function(data){
      var target = matchingService.getOpponentId(id);
      console.log('target of turn is',target);
      io.to(target).emit('turn',JSON.stringify(data)); 
    });

    client.on('logout',function(data){
      console.log('logging out',id);
      var target = matchingService.getOpponentId(id);
      console.log('sending endgame to',target);
      matchingService.deleteMatchByPlayerId(id);
      io.to(target).emit('endgame');
    });

    client.on('lostgame',function(data){
      var target = matchingService.getOpponentId(id);
      matchingService.deleteMatchByPlayerId(id);
      io.to(target).emit('wongame');
    });

});

server.listen(process.env.PORT || 8000);

module.exports = app;