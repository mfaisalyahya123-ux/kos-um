const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data.json', 'utf8'));
let maxId = Math.max(...d.transactions.map(t => t.id));
const date = '2026-07-28';
const src = 'Uang Ayah';
const items = [
  { desc: 'Kalsiboard', qty: 4, unit: 'lembar', ppu: 45000, total: 180000 },
  { desc: 'PVC 2" Rucika', qty: 3, unit: 'pcs', ppu: 70000, total: 210000 },
  { desc: 'PVC 2 1/2" Rucika', qty: 1, unit: 'pcs', ppu: 92000, total: 92000 },
  { desc: 'PVC 4" Rucika', qty: 4, unit: 'pcs', ppu: 167000, total: 668000 },
  { desc: 'PVC 1/2" Rucika', qty: 4, unit: 'pcs', ppu: 28000, total: 112000 },
  { desc: 'Keni 2"', qty: 3, unit: 'pcs', ppu: 7000, total: 21000 },
];
for (const it of items) {
  maxId++;
  d.transactions.push({
    id: maxId,
    date,
    category: 'Material',
    subcategory: '',
    description: it.desc,
    quantity: it.qty,
    unit: it.unit,
    price_per_unit: it.ppu,
    total: it.total,
    notes: '',
    funding_source: src,
  });
}
fs.writeFileSync('data.json', JSON.stringify(d, null, 2));
console.log('Added IDs', maxId - 5, '..', maxId, '| total transaksi:', d.transactions.length);
