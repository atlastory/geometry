/* Atlastory Difference
 * Gets difference (additions/deletions) for array/string
 * Base code from: http://stackoverflow.com/questions/14544713
 *
 * Use client-side or in Node.js
 */

var Atlastory = Atlastory || {};

(function() {

  var root = this;

  var Difference = Atlastory.Difference = function (a, b) {
    if (typeof a === 'string') a = a.split('\n');
    if (typeof b === 'string') b = b.split('\n');

    this.result = [];
    this.asArray = [];

    this.diff(a, b);
  };

  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
        exports = module.exports = Difference;
      }
      exports.Atlastory = Atlastory;
    } else {
      root.Atlastory = Atlastory;
  }

  Difference.prototype.toString = function() {
    var result = this.result,
        output = [], row = '';

    for (var i in result) {
      var r = result[i];
      row  = r[0] + '  ';
      row += (r[2] || '/');
      row += '-' + (r[1] || '/');
      row += '  ' + r[3];
      output.push(row);
    }

    return output.join('\n');
  };

  Difference.prototype.addItem = function(type, i, item) {
    if (!item || item === '') return;
    this.asArray.push([type, i, item]);
  };

  Difference.prototype.diff = function(a1, a2) {
    var matrix = new Array(a1.length + 1);
    var x, y;

    for (y = 0; y < matrix.length; y++) {
      matrix[y] = new Array(a2.length + 1);

      for (x = 0; x < matrix[y].length; x++) {
        matrix[y][x] = 0;
      }
    }

    for (y = 1; y < matrix.length; y++) {
      for (x = 1; x < matrix[y].length; x++) {
        if (a1[y-1].toString() === a2[x-1].toString()) {
          matrix[y][x] = 1 + matrix[y-1][x-1];
        } else {
          matrix[y][x] = Math.max(matrix[y-1][x], matrix[y][x-1]);
        }
      }
    }

    this.getDiff(matrix, a1, a2, x-1, y-1);
  };

  Difference.prototype.getDiff = function(matrix, a1, a2, x, y) {
    if (x > 0 && y > 0 && a1[y-1].toString() === a2[x-1].toString()) {
      this.getDiff(matrix, a1, a2, x-1, y-1);
      // No change
      this.result.push([' ', x, y, a1[y-1]]);
    } else {

      if (x > 0 && (y === 0 || matrix[y][x-1] >= matrix[y-1][x])) {
        this.getDiff(matrix, a1, a2, x-1, y);
        // Added
        this.addItem(1, x-1, a2[x-1]);
        this.result.push(['+', x, null, a2[x-1]]);

      } else if (y > 0 && (x === 0 || matrix[y][x-1] < matrix[y-1][x])) {
        this.getDiff(matrix, a1, a2, x, y-1);
        // Deleted
        this.addItem(0, y-1, a1[y-1]);
        this.result.push(['-', null, y, a1[y-1]]);

      } else {
        return;
      }
    }
  };

})();
