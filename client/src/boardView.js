// AppView.js - Defines a backbone view class for the whole music app.
var BoardView = Backbone.View.extend({

  initialize: function(){
    //make the initial render and bind to change events on the model
    d3renders.initialBoard();
    d3renders.initialPieces(this.model.get('pieces'));
    this.model.on('change',this.render.bind(this));
  },

  render: function(){
    d3renders.updateBoard(this.model.get('board'));
  },

  click: function(pos){



  }


});