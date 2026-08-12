const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data.json', 'utf8'));
let maxId = Math.max(...d.transactions.map(t => t.id));
const src = 'Uang Ayah';
const items = [
  { date: '2026-07-27', desc: 'Bata ringan 7,5', qty: 3, unit: 'kibik', ppu: 710000, total: 2130000 },
  { date: '2026-07-29', desc: 'Glasblok', qty: 16, unit: 'pcs', ppu: 25000, total: 400000 },
  { date: '2026-07-29', desc: 'Pipa 3" (Rucika)', qty: 1, unit: 'pcs', ppu: 108000, total: 108000 },
];
for (const it of items) {
  maxId++;
  d.transactions.push({
    id: maxId,
    date: it.date,
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
console.log('Added IDs', maxId - 2, '..', maxId);
