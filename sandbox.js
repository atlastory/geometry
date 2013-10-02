var geom = require('./geom');
var cr = require('./test/helpers/cr');
var cr2 = require('./test/helpers/cr2');



var diff = geom.getDiff(cr, cr2);

var build = geom.build(cr, diff);



console.log('\n'+ JSON.stringify(diff));

console.log('\n'+ JSON.stringify(geom.getDiff(cr2, build)));
