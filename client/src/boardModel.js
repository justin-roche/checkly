var BoardModel = Backbone.Model.extend({
  
    initialize: function(){
      this.set('pieces',app.initialBoard());
    },

    renderNewBoard: function(board){
      this.set('board', board);
      this.set('validMoves',app.getValidMoves(board));
    },


    tryMove: function(){
      var board = this.get('board'); //a 2d array
      var validMoves = this.get('validMoves');

      //if valid moves at x,y includes x', y'
          //make change to board
          //getNewBoard; 
      //if a move has been made and there are no more jumps

      this.trigger('enemyTurn');
    }

});