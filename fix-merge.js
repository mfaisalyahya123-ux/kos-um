const fs = require('fs');
let g = fs.readFileSync('generate.js', 'utf8');

// Fix: the two lines got merged
const bad = '/\\((Lantai \\d+ - [^)]+)\\)/)                            const key';
const good = '/\\((Lantai \\d+ - [^)]+)\\)/);\n                                        const key';

g = g.replace(bad, good);
console.log('Fixed:', g.includes(good) || g.includes('/\\((Lantai'));
fs.writeFileSync('generate.js', g);