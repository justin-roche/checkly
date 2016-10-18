var d3renders = (function(){

    var view = null;
    var obj = {};
   
    obj.initialBoard = function(_view){
        
        view = _view; 
        //assign the view for this module, necessary for triggering events on it

        var boardDimension = 8;
        var fieldSize = 100;
        var boardSizeX = 800;
        var boardSizeY = 800;

        d3.select('body')
            .append('svg')
            .attr("width", 100 + "px")
            .attr("height", 100 + "px")
            .style('border','1px solid black');

        var svg = d3.select('svg')
            .attr("width", boardSizeX + "px")
            .attr("height", boardSizeY + "px")

        //create the data
        var board =[];
        for(var i = 0; i < boardDimension*boardDimension; i++) {
            board.push({
                x: i % boardDimension,
                y: Math.floor(i / boardDimension),
            });
        };

        //append rects

        var rects = d3.select('svg')
        .selectAll(".fields")
        .data(board)
        .enter()
        .append('rect');

        rects
             .style("class", "fields")
             .style("class", "rects")
             .attr("x", function (d) {
                 return d.x*fieldSize;
             })
             .attr("y", function (d) {
                 return d.y*fieldSize;
             })
             .attr("width", fieldSize + "px")
             .attr("height", fieldSize + "px")
             .style("fill", function (d) {
                 if ( ((d.x%2 == 0) && (d.y%2 == 0)) ||
                      ((d.x%2 == 1) && (d.y%2 == 1))    ) 
                     return "beige";
                 else
                     return "tan";
             })
             .on('click',function(d){
                view.handleCellClick(d);
             })
    },

    obj.initialPieces = function(pieces){
        
        var fieldSize = 100;

        //iterate through the 2d array of pieces
        var data =[];
        for(var i = 0; i < 8; i++) {
            for(var ii = 0; ii<8; ii++){
                if(pieces[i][ii]!=' '){
                    data.push({
                        symbol: pieces[i][ii],
                        location: {x: ii, y: i},
                    });
                }
            }
        };

        var circles = d3.select('svg')
        .selectAll("circle")
        .data(data)
        .enter()
        .append('circle');

         circles
             .style("fill", function(d){
                return d.symbol === 'x' || d.symbol === 'X'? 'black': 'red'
             })
             .attr("cx", function (d) {
                 return (d.location.x*100) + 50;
             })
             .attr("cy", function (d) {
                 return (d.location.y*100) + 50;
             })
             .attr('r',function(d){
                return 30;
             })
             .attr('width', function(){return fieldSize + 'px'})
             .attr('height', function(){return fieldSize + 'px'})

             .attr("class", "piece")
             .on('click',function(d){
                if(d.symbol === 'x' || d.symbol === 'X'){
                    view.handlePieceClick(d);
                } else {
                    view.handleEnemyClick(d);
                }
                
             })

             //.attr("width", fieldSize + "px")
             //.attr("height", fieldSize + "px")
    };

    obj.updatePieces = function(pieces){

        var fieldSize = 100;

        //iterate through the 2d array of pieces
        var data =[];
        for(var i = 0; i < 8; i++) {
            for(var ii = 0; ii<8; ii++){
                if(pieces[i][ii]!=' '){
                    data.push({
                        symbol: pieces[i][ii],
                        location: {x: ii, y: i},
                    });
                }
            }
        };

        var circles = d3.select('svg')
        .selectAll("circle")
        .data(data)
        //.enter()
        //.append('circle');

        circles.exit().remove();

         circles
             .style("fill", function(d){
                return d.symbol === 'x' || d.symbol === 'X'? 'black': 'red'
             })
             .style("stroke", function(d){
                if(d.symbol === 'x'){

                }
                if(d.symbol === 'X' || d.symbol === 'O'){
                    return 'yellow';
                }
             })
             .style("stroke-width", function(d){
                if(d.symbol === 'x'){

                }
                if(d.symbol === 'X'  || d.symbol === 'O'){
                    return '3px';
                }
             })
             .attr("cx", function (d) {
                 return (d.location.x*100) + 50;
             })
             .attr("cy", function (d) {
                 return (d.location.y*100) + 50;
             })
             .attr('r',function(d){
                return 30;
             })
             .attr('width', function(){return fieldSize + 'px'})
             .attr('height', function(){return fieldSize + 'px'})

             .attr("class", "piece")
             .on('click',function(d){
                if(d.symbol === 'x' || d.symbol === 'X'){
                    view.handlePieceClick(d);
                } else {
                    view.handleEnemyClick(d);
                }
                
             })
      
    };

    return obj;

})();