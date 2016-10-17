var BoardModel = Backbone.Model.extend({
  
    initialize: function(){
      this.set('pieces',app.initialBoard());
      this.set('validMoves',app.getValidMoves(this.get('pieces')));
    },

    renderNewBoard: function(pieces){
      this.set('pieces', pieces);
      
    },

    reset: function(pieces){
      this.set('pieces',pieces);
      this.set('validMoves',app.getValidMoves(pieces));
      this.set('selectedPiece',null)
      this.trigger('change:pieces');
      this.trigger('enemyTurn');
    },


    tryMove: function(){
      var pieces = this.get('pieces'); //a 2d array
      var validMoves = this.get('validMoves');
      var selected = this.get('selectedPiece');
      var dest = this.get('dest');

      var movingPiece = validMoves[String(selected.x).concat(String(selected.y))];

      var jumps = movingPiece.jumps.filter(function(moveDest){
        return moveDest.x === dest.x && moveDest.y === dest.y;
      });

      //check for jumps first
      if(jumps.length>0){
        app.movePiece(selected, dest,pieces);
        app.removePiece(selected,dest,pieces);
        this.reset(pieces);
      } 

      if(validMoves.jumpExists === false){
        var singles = movingPiece.singles.filter(function(moveDest){
          return moveDest.x === dest.x && moveDest.y === dest.y;
        });

        if(singles.length>0){
          app.movePiece(selected, dest,pieces);
          this.reset(pieces);
          //not autotriggered b/c reference is the same
        }
        
      }

      
    }

});