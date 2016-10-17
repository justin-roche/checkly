var AppModel = Backbone.Model.extend({
  
    initialize: function(params){   //subcontrollers

      this.set('board', params.boardModel); 
      var board = this.get('board');
      board.on('turn', this.emitBoard.bind(board));
    },

    emitBoard: function(board){
      console.log('emitting board');

    },

    renderNewBoard: function(){
      console.log('new board received!');
    },

    login: function(data){

      var self = this;
      $.ajax({

          url: 'http://localhost:3000' + '/game',
          type: 'POST',
          contentType: 'application/json',
          data: JSON.stringify(data),
          success: function(data) {
              self.set('socket',io.connect('http://localhost:8000'));

              self.get('socket').on('turn', function(data) {
                self.renderNewBoard(data);
              });
          },
          error: function(error) {
            
          },
        });

    },

});