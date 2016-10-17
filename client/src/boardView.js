// AppView.js - Defines a backbone view class for the whole music app.
var BoardView = Backbone.View.extend({

  initialize: function(){
    //make the initial render and bind to change events on the model
    d3renders.initialBoard(this);
    d3renders.initialPieces(this.model.get('pieces'));
    this.model.on('change:pieces',this.render.bind(this));
      //don't change on irrelevant properties
  },

  render: function(){
    d3renders.updateBoard(this.model.get('board'));
  },

  handleCellClick: function(cellLoc){
    console.log('cell was clicked');
    if(this.model.get('selectedPiece')){
      this.model.set('dest',cellLoc);
      this.model.tryMove();
    }
  },

  handlePieceClick: function(piece){
    this.model.set('selectedPiece',{x: piece.location.x, y: piece.location.y});
  },

  handleEnemyClick: function(piece){
    


  },


});