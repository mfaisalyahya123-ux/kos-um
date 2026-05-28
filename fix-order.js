const fs = require('fs');
let g = fs.readFileSync('generate.js', 'utf8');

// Find the generateDateSections function boundaries
const start = g.indexOf('function generateDateSections()');
const end = g.indexOf('function generateTransactionRows()');
const fnBody = g.substring(start, end);

// Replace only within this function
const newBody = fnBody.replace("const sortedWeeks = Object.keys(weekGroups).sort().reverse();", "const sortedWeeks = Object.keys(weekGroups).sort();");

g = g.substring(0, start) + newBody + g.substring(end);
fs.writeFileSync('generate.js', g);
console.log('Fixed week ordering in generateDateSections only');