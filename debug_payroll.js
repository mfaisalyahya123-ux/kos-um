const fs = require('fs');
const txt = fs.readFileSync('generate.js','utf8');
const start = txt.indexOf('function renderWeeklyPayroll');
if (start===-1) { console.log('Not found'); process.exit(); }
const end = txt.indexOf('function renderTrendChart', start);
const section = txt.substring(start, end);
console.log(section.substring(0,2000));
