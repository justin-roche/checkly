var app = {};    

app.init = function(){

  var boardModel = new BoardModel();
  var boardView = new BoardView({model: boardModel});
  var enemyBoardModel = new EnemyBoardModel();
  app.model = new AppModel({boardModel: boardModel, enemyBoardModel: enemyBoardModel});

}

app.getValidMoves = function(pieces){

  //iterate through each x piece on the board and get the first valid move for each, including 1 step and 2 step moves. If two step moves exist, do not look for any more 1 step moves. For kings include backward movement. We look at all the moves initially because if jumps are possible other moves are dissallwoed

  var moves = {};
  moves.jumpExists = false;
  
  for(var i = 0; i<8; i++){
    var y = i;
    for(var ii = 0; ii<8; ii++){
      var x = ii; 
      if(pieces[y][x] === 'x' || pieces[y][x] === 'X'){
        var locString = String(x).concat(String(y));

        moves[locString] = {jumps: [], singles: []};
        var pieceMoves = moves[locString];
        //check 1 step left and up


        //FORWARD MOVES
        if(inBounds(x-1,y-1) && unnocupied(x-1, y-1)){
          pieceMoves.singles.push({x: x-1, y: y-1})
        }
        if(inBounds(x+1,y-1) && unnocupied(x+1, y-1)){
          pieceMoves.singles.push({x: x+1, y: y-1})
        }

        //BACKWARDS MOVES
        if(isKing(x,y) && inBounds(x-1,y+1) && unnocupied(x-1, y+1)){
          pieceMoves.singles.push({x: x-1, y: y+1})
        }
        if(isKing(x,y) && inBounds(x+1,y+1) && unnocupied(x+1, y+1)){
          pieceMoves.singles.push({x: x+1, y: y+1})
        }

        //JUMPS
        if(inBounds(x-2,y-2) 
          && unnocupied(x-2, y-2) 
          && hasEnemy(x-1, y-1)){
            pieceMoves.jumps.push({x: x-2, y: y-2});
            moves.jumpExists = true;
        }
        if(inBounds(x+2,y-2) 
          && unnocupied(x+2, y-2) 
          && hasEnemy(x+1, y-1)){
            pieceMoves.jumps.push({x: x+2, y: y-2});
            moves.jumpExists = true;
        }
        //BACKWARD JUMPS
        if(isKing(x,y) 
          && inBounds(x-2,y+2) 
          && unnocupied(x-2, y+2) 
          && hasEnemy(x-1, y+1)){
            pieceMoves.jumps.push({x: x-2, y: y-2});
            moves.jumpExists = true;
        }
        if(isKing(x,y) 
          && inBounds(x+2,y+2) 
          && unnocupied(x+2, y+2)
          && hasEnemy(x+1, y+1)){
          pieceMoves.jumps.push({x: x+2, y: y+2});
          moves.jumpExists = true;
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

  function isKing(x, y){
    if(pieces[y][x] === 'X'){
      return true;
    } else {
      return false;
    }
  }

  function hasEnemy(x, y){
    if(pieces[y][x] === 'o' || pieces[y][x] === 'O' ){
      return true;
    } else {
      return false;
    }
  }

};


app.reversePieces = function(pieces){

  console.log('reversing',pieces);
  for(var i = 0; i<pieces.length; i++){
    pieces[i].reverse();
  }

  pieces.reverse();

  for(var i = 0; i<pieces.length; i++){
    for(var ii = 0; ii<pieces[i].length; ii++){
      if(pieces[i][ii] === 'x'){
        pieces[i][ii] = 'o';
      }
      else if(pieces[i][ii] === 'X'){
        pieces[i][ii] = 'O';
      }
      else if(pieces[i][ii] === 'o'){
        pieces[i][ii] = 'x';
      }
      else if(pieces[i][ii] === 'O'){
        pieces[i][ii] = 'X';
      }
    }
  }
  console.log('reversed',pieces);
  return pieces;

}

app.movePiece = function(selected,dest,board){
  var v = board[selected.y][selected.x];
  board[selected.y][selected.x] = ' ';
  board[dest.y][dest.x] = v; 
}

app.removePiece = function(selected,dest,board){
  

  if(dest.y < selected.y){
    //a movement up
    if(dest.x < selected.x){
      //a movement left
      board[selected.y-1][selected.x-1] = " ";
    } else {
      //right
      board[selected.y-1][selected.x+1] = " ";
    }
  } else {
    //a movement backwards
    if(dest.x < selected.x){
      //a movement left
      board[selected.y+1][selected.x-1] = " ";
    } else {
      //right
      board[selected.y+1][selected.x+1] = " ";
    }
  }


}


app.getNewBoard = function(board,move){


  return [];
}

app.initialBoard = function(){

  return[
    ' o o o o'.split(''),
    'o o o o '.split(''),
    ' o o o o'.split(''),
    '        '.split(''),
    '   o    '.split(''),
    'x X x x '.split(''),
    ' x x x x'.split(''),
    'x x x x '.split(''),
  ]

}





