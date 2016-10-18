var AppModel = Backbone.Model.extend({
  
    initialize: function(params){   //subcontrollers
      var self = this; 
      this.set('board', params.boardModel); 
      var board = this.get('board');
      var pollingTimer = null;

      board.on('enemyTurn', function(){
        var data = {username: self.get('username'), board: board.get('pieces')};
        self.sendTurn(data);
      });

      self.on('startPolling',function(){
        pollingTimer = setInterval(self.getTurn.bind(self),1000);
      })

      self.on('endPolling',function(pieces){
        clearInterval(pollingTimer);
        self.get('board').reset(pieces);
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

          url: 'http://localhost:3000' + '/user',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(data),
          success: function(data) {
            console.log('posted', data);
              
          },
          error: function(error, response) {
            console.log('error',error);
          },
        });
    
    },

    sendTurn: function(data,callback){
      var self = this;
      $.ajax({

          url: 'http://localhost:3000' + '/turn',
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

          url: 'http://localhost:3000' + '/turn',
          type: 'GET',
          contentType: 'application/json',
          success: function(data) {
            if(data.username === self.get('username')){
              console.log('waiting...');
            } else {
              self.trigger('endPolling',data.board);
            }
              
          },
          error: function(error) {
            console.log('error',error);
          },
        
        });
    
    },

});