const fs = require('fs');
let g = fs.readFileSync('generate.js', 'utf8');

// Find exact boundaries
const idx = g.indexOf('Group by Lantai tag');
const after = g.substring(idx);

// Find the closing of this block
const closeIdx = after.indexOf(')()');
console.log('Block ends at offset:', closeIdx);
console.log('Full block:', after.substring(0, closeIdx + 20));

// Now let me find the exact item template line
const itemLine = after.indexOf('${items.map(tx');
console.log('Item template at:', itemLine);
console.log('Item area:', after.substring(itemLine, itemLine + 400));