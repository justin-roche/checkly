var BoardModel = Backbone.Model.extend({
  
    initialize: function(){
      this.set('pieces',app.initialBoard());
      this.set('validMoves',app.getValidMoves(this.get('pieces')));
      this.set('canMove',true);
    },

    renderNewBoard: function(pieces){
      this.set('pieces', pieces);
    },

    reset: function(pieces){
      this.set('pieces',pieces);
      this.set('validMoves',app.getValidMoves(pieces));
      this.set('selectedPiece',null)
      this.trigger('change:pieces');
    },

    tryMove: function(){
      var self = this;
      var pieces = this.get('pieces'); //a 2d array
      var validMoves = this.get('validMoves'); //an object of type {[xy]{jumps: [{x:, y:}], singles:...}}
      var selected = this.get('selectedPiece');
      var dest = this.get('dest');
      var currentMoves = validMoves[String(selected.x).concat(String(selected.y))];

      if(validMoves.jumpExists === false){
        var currentSingle = currentMoves.singles.filter(function(moveDest){
          return moveDest.x === dest.x && moveDest.y === dest.y;
        });

        if(currentSingle.length>0){
          app.movePiece(selected, dest,pieces);
          this.reset(pieces);
          this.set('canMove',false);
          this.trigger('enemyTurn');
        }
        
      }

      if(validMoves.jumpExists === true){
          var currentJump = currentMoves.jumps.filter(function(moveDest){
          return moveDest.x === dest.x && moveDest.y === dest.y;
        });

        if(currentJump.length>0){
          app.movePiece(selected, dest,pieces);
          app.removePiece(selected,dest,pieces);
          this.reset(pieces);
          
          if(secondJumpExists(dest)){
            this.set('forcedPiece',dest);
          } else {
            this.set('canMove',false);
            this.trigger('enemyTurn');
          }
        } 

      }

      function secondJumpExists(origin){
          validMoves = self.get('validMoves');
          selected = origin; 
          currentMoves = validMoves[String(selected.x).concat(String(selected.y))];

          if(currentMoves.jumps.length > 0){
            return true;
          };

        }
      
    },

});