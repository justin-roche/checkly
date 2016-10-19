// AppView.js - Defines a backbone view class for the whole music app.
var BoardView = Backbone.View.extend({

  initialize: function(){
    //make the initial render and bind to change events on the model
    var self =this;
    d3renders.initialBoard(this);
    this.model.on('initialPieces',function(){
      d3renders.initialPieces(self.model.get('pieces'));
    });
    this.model.on('change:pieces',this.render.bind(this));
      //don't change on irrelevant properties
  },

  render: function(){
    var pieces = this.model.get('pieces');
    if(pieces.length === 8){
      d3renders.updatePieces(this.model.get('pieces'));
    } else {
      d3renders.clearBoard();
    }
    
  },

  handleCellClick: function(cellLoc){
    console.log('cell was clicked');
    if(this.model.get('selectedPiece')){
      this.model.set('dest',cellLoc);
      this.model.tryMove();
    }
  },

  handlePieceClick: function(piece){
    var selectedPiece = {x: piece.location.x, y: piece.location.y};
    if(this.model.get('canMove')){
      this.model.set('selectedPiece',selectedPiece);
    }
  },

  handleEnemyClick: function(piece){
    


  },


});