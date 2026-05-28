const fs = require('fs');
let g = fs.readFileSync('generate.js', 'utf8');
g = g.replace("const firstDate = new Date(dates[dates.length - 1]);", "const firstDate = new Date(dates[0]);");
g = g.replace("const lastDate = new Date(dates[0]);", "const lastDate = new Date(dates[dates.length - 1]);");
fs.writeFileSync('generate.js', g);
console.log('Fixed date range order');