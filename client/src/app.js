var app = {};    

app.init = function(){

  
  var boardModel = new BoardModel();
  var boardView = new BoardView({model: boardModel});
  var enemyBoardModel = new EnemyBoardModel();
  var appModel = new AppModel({boardModel: boardModel, enemyBoardModel: enemyBoardModel});

}

app.getValidMoves = function(pieces){

  //iterate through each x piece on the board and get the first valid move for each, including 1 step and 2 step moves. If two step moves exist, do not look for any more 1 step moves. For kings include backward movement. 

  var moves = {};

  for(var i = 0; i<8; i++){
    var y = i;
    for(var ii = 0; ii<8; ii++){
      var x = ii; 
      if(pieces[y][x] === 'x' || pieces[y][x] === 'X'){
        var locString = String(x).concat(String(y));

        moves[locString] = {jumps: [], singles: []};
        var pieceMoves = moves[locString];
        //check 1 step left and up
        if(inBounds(x-1,y-1) && unnocupied(x-1, y-1)){
          pieceMoves.singles.push({x: x-1, y: y-1})
        }
        if(inBounds(x+1,y-1) && unnocupied(x+1, y-1)){
          pieceMoves.singles.push({x: x+1, y: y-1})
        }
      }
    }
  } 

  return moves;

  function inBounds(x, y){
    if(pieces[y] && pieces[y][x]){
      return true;
    } else {
      return false;
    }
  }

  function unnocupied(x, y){
    if(pieces[y][x] === ' '){
      return true;
    } else {
      return false;
    }
  }

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





