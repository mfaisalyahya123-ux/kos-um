const fs = require('fs');
const d = JSON.parse(fs.readFileSync('kos-um/data.json','utf8'));

let lastId = Math.max(...d.transactions.map(t => t.id));
const date = '2026-06-30';
const source = 'Uang Ayah';

const items = [
  // Material
  {cat:'Material', desc:'Bambu 4m', qty:20, unit:'pcs', price:15000, total:300000},
  {cat:'Material', desc:'Triplek 9mm', qty:10, unit:'pcs', price:97000, total:970000},
  {cat:'Material', desc:'Usuk 4x6 semi', qty:70, unit:'pcs', price:21000, total:1470000},
  {cat:'Material', desc:'Bambu 8m', qty:15, unit:'pcs', price:22000, total:330000},
  // Jasa
  {cat:'Lain-lain', desc:'Jasa buang sampah', qty:2, unit:'kali', price:225000, total:450000}
];

items.forEach(it => {
  d.transactions.push({
    id: ++lastId,
    date,
    category: it.cat,
    description: it.desc,
    quantity: it.qty,
    unit: it.unit,
    price_per_unit: it.price,
    total: it.total,
    notes: '',
    funding_source: source
  });
});

fs.writeFileSync('kos-um/data.json', JSON.stringify(d, null, 2));

const total = items.reduce((s,it) => s+it.total, 0);
console.log('Added', items.length, 'transactions');
console.log('Total:', total.toLocaleString('id-ID'));
console.log('Last ID:', lastId);
