const g = require('fs').readFileSync('generate.js', 'utf8');
console.log('Has inner JS:', g.includes('getElementsByClassName("date-inner-collapsible")'));
const idx = g.indexOf('Collapsible functionality for Date sections');
if (idx > 0) console.log(g.substring(idx, idx + 1000));