const fs = require('fs');
let g = fs.readFileSync('generate.js', 'utf8');

// The current regex in file: tx.description.match(/\(Lantai (\d+ - [^)]+)\)/);
// Fix to capture full "Lantai X - Y"
const old = 'tx.description.match(/\\(Lantai (\\d+ - [^)]+)\\)/)';
const replacement = 'tx.description.match(/\\((Lantai \\d+ - [^)]+)\\)/)';

if (g.includes(old)) {
    g = g.replace(old, replacement);
    fs.writeFileSync('generate.js', g);
    console.log('Fixed regex to capture full Lantai text');
} else {
    console.log('Pattern not found, searching...');
    const idx = g.indexOf('tx.description.match');
    if (idx > 0) console.log('is:', g.substring(idx, idx + 60));
}