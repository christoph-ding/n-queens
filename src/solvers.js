/*           _
   ___  ___ | |_   _____ _ __ ___
  / __|/ _ \| \ \ / / _ \ '__/ __|
  \__ \ (_) | |\ V /  __/ |  \__ \
  |___/\___/|_| \_/ \___|_|  |___/

*/

// hint: you'll need to do a full-search of all possible arrangements of pieces!
// (There are also optimizations that will allow you to skip a lot of the dead search space)
// take a look at solversSpec.js to see what the tests are expecting


// return a matrix (an array of arrays) representing a single nxn chessboard, with n rooks placed such that none of them can attack each other

window.findNRooksSolution = function(n, startingCol) {
  // board storage
  var boardObject = new Board({n: n});
  var board = boardObject.rows();
  var startingCol = startingCol || 0;

  // helper functions
  var xOut = function() {
    // we need to set current row to x
    for (var i = 0; i<board[curRow].length; i++) {
      board[curRow][i] = 'x';        
    }
    // we need to set current row to x
    for (var i = 0; i<board.length; i++) {
      board[i][curCol] = 'x';
    }
  };     
  
  var replaceX = function() {
    for (var xOutRow = 0; xOutRow<n; xOutRow++) {
      for (var xOutCol = 0; xOutCol<n; xOutCol++) {
        if (board[xOutRow][xOutCol] === 'x') {
          board[xOutRow][xOutCol] = 0;
        }
      }
    }
  };

  // iterate through board, placing 1s and Xs
  for (var curRow = 0; curRow<n; curRow++) {
    for (var curCol = startingCol; curCol<n; curCol++) {
      if (board[curRow][curCol] === 0) {
        // call function that nulls out current col + row  
        xOut();
        board[curRow][curCol] = 1;
      }
    }
  }

  // replace Xs with 0s
  replaceX();

  console.log('Single solution for ' + n + ' rooks:', JSON.stringify(board));
  return board;
};

// return the number of nxn chessboards that exist, with n rooks placed such that none of them can attack each other
window.countNRooksSolutions = function(n) {
  var solutionCount = 0;
  var boardObject = new Board({n: n});


  //recursive function
  var recur = function(rowIndex, boardArray) {
    
    //helper functions
    var xOut = function() {
      // we need to set current row to x
      for (var i = 0; i<boardArray.length; i++) {
        boardArray[i][col] = 'x';
      }
    };
    var replaceX = function() {
      for (var xOutRow = 0; xOutRow<n; xOutRow++) {
        for (var xOutCol = 0; xOutCol<n; xOutCol++) {
          if (checkBoard[xOutRow][xOutCol] === 'x') {
            checkBoard[xOutRow][xOutCol] = 0;
          }
        }
      }
    };
    
    //base case
    if (rowIndex === n) {
      var checkBoard = [];
      for (var i = 0; i < boardArray.length; i++) {
        checkBoard.push(boardArray[i].slice());
      }
      replaceX();
      var checkBoardObj = new Board(checkBoard);
      if (!checkBoardObj.hasAnyRooksConflicts()) {
        solutionCount++;
      }
      return;    
    }

    //recursive case:
    //iterate through current row elements
    for (var col = 0; col < n; col++) {
      if (boardArray[rowIndex][col] === 0) {
        // make a copy of board before making any changes
        var snapshot = [];
        for (var i = 0; i < boardArray.length; i++) {
          snapshot.push(boardArray[i].slice());
        }
        xOut();
        boardArray[rowIndex][col] = 1;
        //recurse through each row level
        recur(rowIndex + 1,  boardArray);
        boardArray = new Board(snapshot).rows();

      }
    }
  };

  recur(0, boardObject.rows());
  return solutionCount;
};

// return a matrix (an array of arrays) representing a single nxn chessboard, with n queens placed such that none of them can attack each other
window.findNQueensSolution = function(n) {
  var flag = false;
  var board = new Board({n:n});

  var recur = function(rowIndex) {
    // base case
    if (rowIndex === n) {
      flag = true;
      return;
    }

    // recursive case
    for (var column = 0; column < n; column++) {
      board.togglePiece(rowIndex, column);
      if (!board.hasAnyQueensConflicts()) {
        recur(rowIndex + 1);
        if (flag) {return;} 
      }
      if (!flag) {
        board.togglePiece(rowIndex, column);
      }
    }
  }

  recur(0);

  console.log('Single solution for ' + n + ' queens:', JSON.stringify(board.rows()));
  return board.rows();
};

// return the number of nxn chessboards that exist, with n queens placed such that none of them can attack each other
window.countNQueensSolutions = function(n) {
  var colFlag = {};
  for (var i=0; i<n; i++) {
    colFlag[i] = true;
  }
  var solutionCount = 0;
  var board = new Board({n:n});

  var recur = function(rowIndex) {
    // base case
    if (rowIndex === n) {
      solutionCount++;
      return;
    }

    // recursive case
    for (var col in colFlag) {
      if (colFlag[col]) {
        board.togglePiece(rowIndex, +col);
        colFlag[col] = false;
        if (!board.hasAnyQueensConflicts()) {
          recur(rowIndex + 1);
        }
        board.togglePiece(rowIndex, +col);
        colFlag[col] = true;
      }
    }
  }

  recur(0);

  console.log('Number of solutions for ' + n + ' queens:', solutionCount);
  return solutionCount;
};






































