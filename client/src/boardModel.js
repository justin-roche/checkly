var BoardModel = Backbone.Model.extend({
  
    initialize: function(){
      this.set('pieces',app.initialBoard());
      this.set('validMoves',app.getValidMoves(this.get('pieces')));
    },

    renderNewBoard: function(board){
      this.set('pieces', board);
      this.set('validMoves',app.getValidMoves(board));
      this.set('selectedPiece',null)
    },


    tryMove: function(){
      var board = this.get('pieces'); //a 2d array
      var validMoves = this.get('validMoves');
      var selected = this.get('selectedPiece');
      var dest = this.get('dest');

      var movingPiece = validMoves[String(selected.x).concat(String(selected.y))];

      //is it a single move that is valid? 
      var singles = movingPiece.singles.filter(function(moveDest){
        return moveDest.x === dest.x && moveDest.y === dest.y;
      });

      if(singles.length>0){
        app.movePiece()
      }
      //if valid moves at x,y includes x', y'
          //make change to board
          //getNewBoard; 
      //if a move has been made and there are no more jumps

      this.trigger('enemyTurn');
    }

});