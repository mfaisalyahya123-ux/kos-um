const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data.json', 'utf8'));
let maxId = Math.max(...d.transactions.map(t => t.id));
const S = 'Uang Ayah';
const items = [
  { date: '2026-08-03', cat: 'Struktur Bangunan', sub: '', desc: 'Usuk 3x5 (1 m3)', qty: 1, unit: 'm3', ppu: 2400000, total: 2400000 },
  { date: '2026-08-10', cat: 'Material', sub: '', desc: 'Bambu', qty: 15, unit: 'pcs', ppu: 25000, total: 375000 },
  { date: '2026-08-10', cat: 'Material', sub: '', desc: 'Semen Gresik', qty: 30, unit: 'sak', ppu: 59000, total: 1770000 },
  { date: '2026-08-10', cat: 'Struktur Bangunan', sub: '', desc: 'Usuk 3x5', qty: 140, unit: 'pcs', ppu: 22000, total: 3080000 },
];
const first = maxId + 1;
for (const it of items) {
  maxId++;
  d.transactions.push({
    id: maxId, date: it.date, category: it.cat, subcategory: it.sub,
    description: it.desc, quantity: it.qty, unit: it.unit,
    price_per_unit: it.ppu, total: it.total, notes: '', funding_source: S,
  });
}
fs.writeFileSync('data.json', JSON.stringify(d, null, 2));
console.log('Added IDs', first, '..', maxId, '| count:', d.transactions.length);
