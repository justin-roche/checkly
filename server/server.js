var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var io = require('socket.io');
//var http = require('http');

var app = express()
//var server = http.createServer(app)
//var socket = io.listen(server);


app.use(bodyParser.json());



/*var socket = io.listen(server);
*/


/*setTimeout(function(){
  socket.emit('turn',2000);
})

socket.on('connection', function (socket) {
  socket.emit('turn', { hello: 'world' });
});*/

//app.use(cors());
//mongoose.connect('mongodb://localhost/shortly');
var game = {};
game.board = null;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.static(__dirname + '/../client'));  //**/*.html


app.post('/user',function(req,res,next){
  var playerRole = 1; 

  if(!game.player1){game.player1 = req.body;}
  else {
    game.player2 = req.body;
    playerRole = 2; 
  }
  console.log(game);

  res.send({role: playerRole});
  
});

app.post('/turn',function(req,res,next){
  game = req.body; 
  console.log('new game',game);

  res.send(game);
})

app.get('/turn',function(req,res,next){
  res.send(game);
});

app.listen(3000);

module.exports = app;