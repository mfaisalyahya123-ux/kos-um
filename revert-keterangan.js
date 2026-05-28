const fs = require('fs');
let g = fs.readFileSync('generate.js', 'utf8');

// Remove Keterangan TH
g = g.replace('\n                            <th>Keterangan</th>', '');

// Remove notes cell from transaction row
// The row now has: <td>${tx.quantity} ${tx.unit}</td>\n                            <td>${tx.notes || '-'}</td>
g = g.replace('                            <td>${tx.notes || \'-\'}</td>\n', '');

fs.writeFileSync('generate.js', g);
console.log('Removed Keterangan column from table');