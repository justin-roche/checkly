var app = {};    

app.init = function(){

  
  var boardModel = new BoardModel();
  var boardView = new BoardView({model: boardModel});
  var enemyBoardModel = new EnemyBoardModel();
  var appModel = new AppModel({boardModel: boardModel, enemyBoardModel: enemyBoardModel});

}

app.getValidMoves = function(board){

  //iterate through each x piece on the board and get the first valid move for each, including 1 step and 2 step moves. If two step moves exist, do not look for any more 1 step moves. For kings include backward movement. 

  return {

  };

};

app.getNewBoard = function(board,move){


  return [];
}

app.initialBoard = function(){

  return[
    ' o o o o'.split(''),
    'o o o o '.split(''),
    ' o o o o'.split(''),
    '        '.split(''),
    '        '.split(''),
    'x x x x '.split(''),
    ' x x x x'.split(''),
    'x x x x '.split(''),
  ]

}





