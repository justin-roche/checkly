var AppModel = Backbone.Model.extend({
  
    initialize: function(params){   

      
      var board = params.boardModel; 

      var socket = io.connect('https://powerful-temple-32184.herokuapp.com/');
      //var socket = io.connect('http://localhost:8000');

      var self = this; 

      socket.on('connect', function(data) {
        //console.log('socket connected');
      });

      socket.on('match',function(data){
        setupGame(data);
      });

      socket.on('turn',function(data){
        setupTurn(JSON.parse(data));        
      });

      board.on('enemyTurn', function(){
        endTurn(board.get('pieces'));
      });

      board.on('lostgame',function(){
        socket.emit('lostgame');
        $('#spinner').css('visibility','hidden');
        board.setToEmpty();
      });

      socket.on('wongame',function(){
        alert('you have won!');
        board.setToEmpty();
        $('#spinner').css('visibility','hidden');
      });

      socket.on('endgame',function(){
        board.setToEmpty();
        $('#spinner').css('visibility','hidden');
        alert('opponent has left the game!');
      })
      
      function endTurn(board){
        data = app.reversePieces(board);
        socket.emit('turn',data);
        $('#spinner').css('visibility','visible');
      }

      function setupTurn(pieces){
        $('#spinner').css('visibility','hidden');
        board.reset(pieces);
        board.set('canMove',true);
      }

      function setupGame(role){
        console.log('role is',role);
        $('#spinner').css('visibility','hidden');
       
        if(role === 1){
          board.set('pieces',app.initialBoard());
          board.set('canMove','true');
        } else {
          $('#spinner').css('visibility','visible');
          //player 2 waits for player 1's move

          board.set('pieces',app.reversePieces(app.initialBoard()));
          board.set('canMove',false);
        }
        board.trigger('initialPieces');
      };

      function logout(){
        socket.emit('logout');
        board.setToEmpty();
      }

      $('#login').submit(function(e){
          e.preventDefault();
          $('#spinner').css('visibility','visible');
          login({username: $('#username').val()});
      });

      $('#logout').click(function(e){
          e.preventDefault();
          logout();
      });

      function login(username){
        socket.emit('login',username);
      }

    },

});