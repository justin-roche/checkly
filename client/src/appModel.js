var AppModel = Backbone.Model.extend({
  
    initialize: function(params){   //subcontrollers

      var board = params.boardModel; 
      var enemyBoard = params.enemyBoardModel;

      board.on('enemyTurn', enemyBoard.poll());
      enemyBoard.on('myTurn', board.renderNewBoard);


    }

});