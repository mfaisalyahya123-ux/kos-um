const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data.json', 'utf8'));
const ids = [524, 534, 896, 902];
let moved = 0;
for (const h of d.transactions) {
  if (ids.includes(h.id)) {
    h.category = 'Struktur Bangunan';
    h.subcategory = 'Lantai 2 - Kamar';
    moved++;
  }
}
fs.writeFileSync('data.json', JSON.stringify(d, null, 2));
console.log('Moved', moved, 'items in-place to Struktur Bangunan / Lantai 2 - Kamar');
