/* Atlastory Geometry Functions
 * Requires:
 * Atlastory.Difference
 */

var Atlastory = Atlastory || {};

(function() {

    var Diff = Atlastory.Difference;

    Atlastory.geom = {};

    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = Atlastory.geom;
            Diff = require('./Difference');
        }
        exports.Atlastory = Atlastory;
    } else {
        root.Atlastory = Atlastory;
    }

    // Gets the 'diff' of changes between 2 geometries
    Atlastory.geom.getDiff = function(a, b) {
        var diff = [];

        function shapeDiff(a, b) {
            if (typeof a[0] === 'number') {
                diff.push([0, 0, a]);
                diff.push([1, 0, b]);
            } else {
                var difference = new Diff(a, b);
                diff = diff.concat(difference.asArray);
            }
        }

        a = flattenArray(a);
        b = flattenArray(b);

        shapeDiff(a, b);

        return diff;
    };

    // Builds new geometry from a diff
    Atlastory.geom.build = function(geom, diff, revert) {
        var adds = 0, dels = 0,
            task, index, item, offset, c;

        geom = flattenArray(geom);

        // Special case of a single coordinate
        if (typeof geom[0] === 'number') {
            if (revert) return diff[0][2];
            else        return diff[1][2];
        }

        for (c=0; c < diff.length; c++) {
            task = diff[c][0];
            index = diff[c][1];
            item  = diff[c][2];

            task = revert ? !(task) : task;
            offset = adds - dels;

            if (task) {
                geom.splice(index, 0, item);
                adds++;
            } else {
                geom.splice(index + offset, 1);
                dels++;
            }
        }

        if (JSON) return unFlattenArray(geom);
        else      return unFlattenNoJSON(geom);
    };

    // Reverts geometry to its prior state from diff
    Atlastory.geom.revert = function(geom, diff) {
        return Atlastory.geom.build(geom, diff, true);
    };

    var sep1 = '[',
        sep2 = ']';

    function flattenArray(arr) {
        var newArray = [], fA;
        if (typeof arr[0] === 'number') return arr;

        for (var x in arr) {
            if (typeof arr[x][0] === 'number') {
                newArray.push(arr[x]);
            } else {
                newArray.push(sep1);
                fA = flattenArray(arr[x]);
                newArray = newArray.concat(fA);
                newArray.push(sep2);
            }
        }
        return newArray;
    }

    function unFlattenArray(arr) {
        var str = '[', i, s;

        // Basic stringification
        for (i=0; i < arr.length; i++) {
            s = arr[i];
            if (typeof s === 'object') str += '['+s+']';
            else str += s;
            if (s != sep1 &&
                arr[i+1] != sep2 &&
                i != arr.length-1) str += ',';
        }
        str += ']';

        return JSON.parse(str);
    }

    function unFlattenNoJSON(arr) {
        var newArray = [], length, end, sub, uA, i;

        function endArray(i) {
            var nested = 0,
                item = arr[i],
                end = false, ind;
            while (item === sep1) {
                nested++;
                item = arr[i+nested];
            }
            for (var x=0; x < arr.length; x++) {
                for (var y=0; y < nested; y++) {
                    if (arr[x+y] === sep2) end = true;
                    else { end = false; break; }
                }
                if (end) {
                    ind = x + nested - 1;
                    break;
                }
            }
            return ind;
        }

        for (i=0; i < arr.length; i++) {
            if (arr[i] === sep1) {
                end = endArray(i);
                sub = arr.splice(i+1, end);
                uA = unFlattenArray(sub);
                newArray.push(uA);
            } else if (arr[i] === sep2) {
                return newArray;
            } else {
                newArray.push(arr[i]);
            }
        }
        return newArray;
    }

})();
