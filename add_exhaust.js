const fs = require('fs');
const path = 'data.json';
const d = JSON.parse(fs.readFileSync(path,'utf8'));
let m = Math.max(...d.transactions.map(t=>t.id));
d.transactions.push({
  id: ++m,
  date: '2026-08-07',
  category: 'Material',
  subcategory: '',
  description: 'Exhaust 6" sekai',
  quantity: 1,
  unit: 'pcs',
  price_per_unit: 156000,
  total: 156000,
  notes: '',
  funding_source: 'Uang Ayah'
});
fs.writeFileSync(path, JSON.stringify(d,null,2));
console.log('Added Exhaust transaction, new max id', m);
