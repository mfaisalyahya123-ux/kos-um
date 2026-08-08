const fs = require('fs');
const txt = fs.readFileSync('generate.js','utf8');
const start = txt.indexOf('function renderWeeklyPayroll');
const end = txt.indexOf('function renderTrendChart', start);
const section = txt.substring(start, end);
console.log(section.slice(2000, 4000));
