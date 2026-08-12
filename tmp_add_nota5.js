const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data.json', 'utf8'));
let maxId = Math.max(...d.transactions.map(t => t.id));
maxId++;
d.transactions.push({
  id: maxId,
  date: '2026-07-29',
  category: 'Material',
  subcategory: '',
  description: 'Keramik BIG',
  quantity: 13,
  unit: 'dus',
  price_per_unit: 94050,
  total: 1222650,
  notes: '',
  funding_source: 'Uang Ayah',
});
fs.writeFileSync('data.json', JSON.stringify(d, null, 2));
console.log('Added id', maxId);
