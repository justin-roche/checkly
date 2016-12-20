var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);


app.use(bodyParser.json());

app.use(express.static(__dirname + '/../client'));  //**/*.html

//<----------------MATCHING SERVICE---------------->

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

//<----------------SOCKET METHODS---------------->

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