const fs = require('fs');
const d = JSON.parse(fs.readFileSync('kos-um/data.json','utf8'));

let lastId = Math.max(...d.transactions.map(t => t.id));
const date = '2026-07-02';
const source = 'Uang Ayah';
const category = 'Struktur Bangunan';
const subcategory = 'Cor Dak';

const items = [
  {desc:'Wiremesh Lembar M 10 (9.7) TU', qty:23, unit:'lembar', price:1057500, total:24322500},
  {desc:'Beton SNI 6 x 12', qty:20, unit:'pcs', price:28000, total:560000},
  {desc:'Beton Ulir TS-280 SNI 10 x 12', qty:20, unit:'pcs', price:74000, total:1480000},
  {desc:'Bendrat Roll', qty:1, unit:'roll', price:272000, total:272000}
];

items.forEach(it => {
  d.transactions.push({
    id: ++lastId,
    date,
    category,
    subcategory,
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
console.log('Added', items.length, 'transactions (Struktur Bangunan - Cor Dak)');
console.log('Total:', total.toLocaleString('id-ID'));
console.log('Last ID:', lastId);
