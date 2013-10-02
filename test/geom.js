var assert = require('assert');
var geom = require('../geom');
var cr = require('./helpers/cr');
var cr2 = require('./helpers/cr2');

var shape      = [[0,0],[1,1],[2,2],[3,3],[4,4],[5,5],[6,6],[0,0],[1,1]];
var shape_edit = [[8,8],[0,0.6],[1,1],[9,2],[3,3],[4,19],[0,0]];
var shape_del  = [[0,0],[1,1],[4,4]];
var shape_add  = [[0,0],[1,1],[6,6],[7,7],[2,2],[3,3],[8,8],[4,4]];

var group1 = [shape, shape_del];
var group2 = [[shape, shape_add], [shape_edit]];

var diff, build, undo;

describe('#getDiff()', function() {
    it('should get diff of deletions', function() {
        diff = geom.getDiff(shape, shape_del);
        assert.equal(diff[0][0], 0);
        assert.equal(diff[0][1], 2);
        assert.equal(diff[0][2][0], 2);
    });

    it('should get diff of additions', function() {
        diff = geom.getDiff(shape, shape_add);
        assert.equal(diff[0][0], 1);
        assert.equal(diff[0][1], 2);
        assert.equal(diff[0][2][0], 6);
    });

    it('should get diff of edits', function() {
        diff = geom.getDiff(shape, shape_edit);
        assert.equal(diff[0][0], 0);
        assert.equal(diff[0][1], 0);
        assert.equal(diff[0][2][0], 0);
        assert.equal(diff[1][2][0], 8);
    });

    it('should get diff of groups', function() {
        diff = geom.getDiff(group1, group2);
        assert.equal(diff[0][0], 1);
        assert.equal(diff[0][1], 0);
        assert.equal(diff[0][2], '[');
    });
});

describe('#build()', function() {
    it('should build geom from diff', function() {
        build = geom.build(group1, diff);
        assert.deepEqual(build[0][0], shape);
        assert.deepEqual(build[1], [shape_edit]);
        assert.deepEqual(build, group2);
    });
});

describe('#revert()', function() {
    it('should revert geom from diff', function() {
        undo = geom.revert(group2, diff);
        assert.deepEqual(undo, group1);
    });
});


describe('geom (with actual geometry)', function() {
    it('should get diff', function() {
        diff = geom.getDiff(cr, cr2);
        assert.deepEqual(diff[1][2], [-85.88,11.234000447]);
    });

    it('should build geom', function() {
        build = geom.build(cr, diff);
        assert.deepEqual(build, cr2);
    });

    it('should revert geom', function() {
        undo = geom.revert(cr2, diff);
        assert.deepEqual(undo, cr);
    });
});
