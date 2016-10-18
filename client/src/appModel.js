var AppModel = Backbone.Model.extend({
  
    initialize: function(params){   //subcontrollers
      var self = this; 
      this.set('board', params.boardModel); 
      var board = this.get('board');
      var pollingTimer = null;

      self.on('startPollingForGame',function(){
        $('#spinner').css('visibility','visible');
        pollingTimer = setInterval(self.getGame.bind(self),1000);
      });

      self.on('endPollingForGame',function(data){

        clearInterval(pollingTimer);
        $('#spinner').css('visibility','hidden');
        self.trigger('startGame',data);
      });

      self.on('startGame',function(data){
        self.set('gameData',data);      

        //initial render of pieces  
        board.set('pieces',app.initialBoard());
        board.trigger('initialPieces');

        if(self.get('gameData').player1.username === self.get('username')){

          board.set('canMove','true');
        } else {
          board.set('canMove',false);
          self.trigger('startPolling');
        }
      });

      board.on('enemyTurn', function(){
        //put the board on the data
        var data = self.get('gameData');
        data.username = self.get('username');
        //reflect the board
        data.board = app.reversePieces(board.get('pieces'));
        self.sendTurn(data);
        $('#spinner').css('visibility','visible');

      });

      self.on('startPolling',function(){
        $('#spinner').css('visibility','visible');
        pollingTimer = setInterval(self.getTurn.bind(self),1000);
      })

      self.on('endPolling',function(data){
        $('#spinner').css('visibility','hidden');
        self.set('gameData',data)
        clearInterval(pollingTimer);
        self.get('board').reset(data.board);
        board.set('canMove',true);
      });

      $('#login').submit(function(e){
          e.preventDefault();
          var username = $('#username').val();
          self.set('username',username);
          self.login({username: username});
      });

      $('#getTurn').click(function(e){
          console.log(e);
          e.preventDefault();
          self.getTurn();
      });  

      $('#sendTurn').click(function(e){
          var pieces = board.get('pieces');
          self.sendTurn({username: self.get('username'), board: pieces});
          e.preventDefault();
      });  

    },

    login: function(data){
     
      var self = this;
      $.ajax({

          url: 'https://powerful-temple-32184.herokuapp.com' + '/user',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(data),
          success: function(game) {
            self.trigger('startPollingForGame');
          },
          error: function(error, response) {
            console.log('error',error);
          },
        });
    
    },

    getGame: function(){
     
      var self = this;
      $.ajax({

          url: 'https://powerful-temple-32184.herokuapp.com' + '/game'+'?username='+self.get('username'),
          type: 'GET',
          contentType: 'application/json',
          success: function(game) {
            if(game.player1 && game.player2){
              //will not include board
              self.trigger('endPollingForGame',game);
            }
          },
          error: function(error, response) {
            console.log('error',error);
          },
        });
    
    },

    sendTurn: function(data,callback){
      var self = this;
      $.ajax({

          url: 'https://powerful-temple-32184.herokuapp.com' + '/turn',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(data),
          success: function(data) {
            console.log('turn sent successfully', data);
            self.trigger('startPolling'); 
          },
          error: function(error) {
            console.log('error',error);
          },
        });
    },

    getTurn: function(data){

      var self = this;
      $.ajax({

          url: 'https://powerful-temple-32184.herokuapp.com' + '/turn'+'?gameid='+self.get('gameData').gameId,
          type: 'GET',
          contentType: 'application/json',
          success: function(data) {
            if(data.username === self.get('username')){
              console.log('waiting...');
            } else {
              if(data.board){
                self.trigger('endPolling',data);
              }
            }
              
          },
          error: function(error) {
            console.log('error',error);
          },
        
        });
    
    },

});