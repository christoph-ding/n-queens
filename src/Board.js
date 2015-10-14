// This file is a Backbone Model (don't worry about what that means)
// It's part of the Board Visualizer
// The only portions you need to work on are the helper functions (below)

(function() {

  window.Board = Backbone.Model.extend({

    initialize: function (params) {
      if (_.isUndefined(params) || _.isNull(params)) {
        console.log('Good guess! But to use the Board() constructor, you must pass it an argument in one of the following formats:');
        console.log('\t1. An object. To create an empty board of size n:\n\t\t{n: %c<num>%c} - Where %c<num> %cis the dimension of the (empty) board you wish to instantiate\n\t\t%cEXAMPLE: var board = new Board({n:5})', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: grey;');
        console.log('\t2. An array of arrays (a matrix). To create a populated board of size n:\n\t\t[ [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...], [%c<val>%c,%c<val>%c,%c<val>%c...] ] - Where each %c<val>%c is whatever value you want at that location on the board\n\t\t%cEXAMPLE: var board = new Board([[1,0,0],[0,1,0],[0,0,1]])', 'color: blue;', 'color: black;','color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: blue;', 'color: black;', 'color: grey;');
      } else if (params.hasOwnProperty('n')) {
        this.set(makeEmptyMatrix(this.get('n')));
      } else {
        this.set('n', params.length);
      }
    },

    rows: function() {
      return _(_.range(this.get('n'))).map(function(rowIndex) {
        return this.get(rowIndex);
      }, this);
    },

    togglePiece: function(rowIndex, colIndex) {
      this.get(rowIndex)[colIndex] = + !this.get(rowIndex)[colIndex];
      this.trigger('change');
    },

    _getFirstRowColumnIndexForMajorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex - rowIndex;
    },

    _getFirstRowColumnIndexForMinorDiagonalOn: function(rowIndex, colIndex) {
      return colIndex + rowIndex;
    },

    hasAnyRooksConflicts: function() {
      return this.hasAnyRowConflicts() || this.hasAnyColConflicts();
    },

    hasAnyQueenConflictsOn: function(rowIndex, colIndex) {
      return (
        this.hasRowConflictAt(rowIndex) ||
        this.hasColConflictAt(colIndex) ||
        this.hasMajorDiagonalConflictAt(this._getFirstRowColumnIndexForMajorDiagonalOn(rowIndex, colIndex)) ||
        this.hasMinorDiagonalConflictAt(this._getFirstRowColumnIndexForMinorDiagonalOn(rowIndex, colIndex))
      );
    },

    hasAnyQueensConflicts: function() {
      return this.hasAnyRooksConflicts() || this.hasAnyMajorDiagonalConflicts() || this.hasAnyMinorDiagonalConflicts();
    },

    _isInBounds: function(rowIndex, colIndex) {
      return (
        0 <= rowIndex && rowIndex < this.get('n') &&
        0 <= colIndex && colIndex < this.get('n')
      );
    },


/*
         _             _     _
     ___| |_ __ _ _ __| |_  | |__   ___ _ __ ___ _
    / __| __/ _` | '__| __| | '_ \ / _ \ '__/ _ (_)
    \__ \ || (_| | |  | |_  | | | |  __/ | |  __/_
    |___/\__\__,_|_|   \__| |_| |_|\___|_|  \___(_)

 */
    /*=========================================================================
    =                 TODO: fill in these Helper Functions                    =
    =========================================================================*/

    // ROWS - run from left to right
    // --------------------------------------------------------------
    //
    //Workflow

    // var board = new Board({n:4})
    seeBoard: function() {
      for (var i = 0; i < Object.keys(this.attributes).length; i++) {
        console.log(this.attributes[i]);
      }
    },

    // test if a specific row on this board contains a conflict
    hasRowConflictAt: function(rowIndex) {
      //assign a row variable to talk about the row
      var row = this.get(rowIndex);
      //initialize a flag to false
      var flag = false;

      //iterate over the row
      for (var i = 0; i < row.length; i++) {
        if (row[i] === 1 && flag === false) {
          flag = true;
        } else if (row[i] === 1 && flag) {
          return true;
        }
      }
      //at the end return the flag
      return false; // fixme
    },

    // test if any rows on this board contain conflicts
    hasAnyRowConflicts: function() {
      for (var i = 0; i < this.rows().length; i++) {
        if (this.hasRowConflictAt(i)) {
          return true;
        }
      }

      return false;
    },

    // COLUMNS - run from top to bottom
    // --------------------------------------------------------------
    //
    // test if a specific column on this board contains a conflict
    hasColConflictAt: function(colIndex) {
      var rows = this.rows();
      var counter = 0;
      for (var i=0; i<rows.length; i++) {
        var currentRow = rows[i];
        counter += currentRow[colIndex];
        if (counter > 1) {
          return true;
        }         
      }      
      return false; // fixme
    },

    // test if any columns on this board contain conflicts
    hasAnyColConflicts: function() {
      // iterate through each column, call hasColConflictAt for each column
      for (var i=0; i<this.rows().length; i++) {
        if (this.hasColConflictAt(i)) {
          return true;
        }
      }

      return false; // fixme
    },



    // Major Diagonals - go from top-left to bottom-right
    // --------------------------------------------------------------
    //
    // test if a specific major diagonal on this board contains a conflict
    hasMajorDiagonalConflictAt: function(majorDiagonalColumnIndexAtFirstRow) {
      // get starting cell
      var board = this.attributes;
      var size = Object.keys(board).length - 1;
      var currentColumn = majorDiagonalColumnIndexAtFirstRow < size ? majorDiagonalColumnIndexAtFirstRow : 0;
      var currentRow = Math.max(majorDiagonalColumnIndexAtFirstRow - (size - 1) , 0);

      // use calculation, declare cell as an array 
      var currentCell = [currentRow, currentColumn];
      // set flags
      var flag = false;

      // walk from starting cell
      // walk until current cell is out of bounds
      while (this._isInBounds(currentRow, currentColumn)) {
        // if current cell is a queen, do something based on flag
        if (board[currentRow][currentColumn] === 1 && flag === false) {
          flag = true;
        } else if (board[currentRow][currentColumn] === 1 && flag === true) {
          return true;
        }    
        // continue walking by decrementing coordinates by 1
        currentRow++;
        currentColumn++;
      }
      return false; // fixme
    },

    // test if any major diagonals on this board contain conflicts
    hasAnyMajorDiagonalConflicts: function() {
      //figure out number of indexes to pass in
      var maxIndex = (Object.keys(this.attributes).length - 1) * 2;

      //call hasMajor... for each index
      for (var i = 0; i < maxIndex; i++) {
        if (this.hasMajorDiagonalConflictAt(i)) {          
          return true;
        }
      }

      return false; // fixme
    },



    // Minor Diagonals - go from top-right to bottom-left
    // --------------------------------------------------------------
    //
    // test if a specific minor diagonal on this board contains a conflict
    hasMinorDiagonalConflictAt: function(minorDiagonalColumnIndexAtFirstRow) {
      // get starting cell
      var board = this.attributes;
      var size = Object.keys(board).length - 1;
      var currentColumn = Math.min(size - 1, minorDiagonalColumnIndexAtFirstRow);
      var currentRow = Math.max(minorDiagonalColumnIndexAtFirstRow - currentColumn, 0);

      // set flags
      var flag = false;

      // walk from starting cell
      // walk until current cell is out of bounds
      while (this._isInBounds(currentRow, currentColumn)) {
        // if current cell is a queen, do something based on flag
        if (board[currentRow][currentColumn] === 1 && flag === false) {
          flag = true;
        } else if (board[currentRow][currentColumn] === 1 && flag === true) {
          return true;
        }    
        // continue walking by decrementing coordinates by 1
        currentRow++;
        currentColumn--;
      }
      return false; // fixme
    },

    // test if any minor diagonals on this board contain conflicts
    hasAnyMinorDiagonalConflicts: function() {
      var maxIndex = (this.attributes.n - 1) * 2;

      //call hasMajor... for each index
      for (var i = 0; i < maxIndex; i++) {
        if (this.hasMinorDiagonalConflictAt(i)) {
          return true;
        }
      }
      return false; // fixme
    }

    /*--------------------  End of Helper Functions  ---------------------*/


  });

  var makeEmptyMatrix = function(n) {
    return _(_.range(n)).map(function() {
      return _(_.range(n)).map(function() {
        return 0;
      });
    });
  };

}());
