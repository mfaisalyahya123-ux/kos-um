const fs = require('fs');
let g = fs.readFileSync('generate.js', 'utf8');

// Find the TH for Sumber Dana and add Keterangan after it
const marker = '<th>Sumber Dana</th>';
const idx = g.indexOf(marker);
if (idx > 0) {
    g = g.substring(0, idx + marker.length) + '\n                            <th>Keterangan</th>' + g.substring(idx + marker.length);
    console.log('Added Keterangan TH');
} else {
    console.log('TH not found');
}

fs.writeFileSync('generate.js', g);