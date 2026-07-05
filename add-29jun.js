const fs = require('fs');
const d = JSON.parse(fs.readFileSync('kos-um/data.json','utf8'));

let lastId = Math.max(...d.transactions.map(t => t.id));
const date = '2026-06-29';
const source = 'Kas UM';

// Material items
const materials = [
  {desc:'Paku 3"', qty:12, unit:'kg', price:24000, total:288000},
  {desc:'Kabel listrik 1.5mm 50m', qty:3, unit:'pcs', price:240000, total:720000},
  {desc:'Sok pipa listrik 20mm', qty:35, unit:'pcs', price:514, total:18000},
  {desc:'T-dus 4 cabang', qty:12, unit:'pcs', price:2667, total:32000},
  {desc:'T-dus 3 cabang', qty:12, unit:'pcs', price:2333, total:28000},
  {desc:'T-dus 1 cabang', qty:12, unit:'pcs', price:1917, total:23000},
  {desc:'Knee listrik', qty:60, unit:'pcs', price:767, total:46000},
  {desc:'Paku beton 3"', qty:2, unit:'pcs', price:6000, total:12000},
  {desc:'Isolasi listrik', qty:4, unit:'pcs', price:7000, total:28000}
];

// Jajan items
const jajan = [
  {desc:'Aqua Galon', qty:1, unit:'galon', price:20000, total:20000},
  {desc:'Kuku Bima Anggur', qty:6, unit:'pcs', price:6000, total:36000},
  {desc:'Mentega 200gr', qty:10, unit:'pcs', price:5500, total:55000},
  {desc:'Tepung Bogasari 1kg', qty:4, unit:'pcs', price:2750, total:11000},
  {desc:'Gula 1kg', qty:4, unit:'pcs', price:16000, total:64000},
  {desc:'Tepung Lencana', qty:4, unit:'pcs', price:11500, total:46000},
  {desc:'Kopi Ya 750gr', qty:1, unit:'pcs', price:60000, total:60000},
  {desc:'Kopi Ya 750gr', qty:1, unit:'pcs', price:60000, total:60000},
  {desc:'Kopi Ya 750gr', qty:1, unit:'pcs', price:60000, total:60000},
  {desc:'Tepung Cakra 1kg', qty:2, unit:'pcs', price:13000, total:26000}
];

materials.forEach(m => {
  d.transactions.push({
    id: ++lastId,
    date,
    category: 'Material',
    description: m.desc,
    quantity: m.qty,
    unit: m.unit,
    price_per_unit: m.price,
    total: m.total,
    notes: '',
    funding_source: source
  });
});

jajan.forEach(j => {
  d.transactions.push({
    id: ++lastId,
    date,
    category: 'Jajan',
    description: j.desc,
    quantity: j.qty,
    unit: j.unit,
    price_per_unit: j.price,
    total: j.total,
    notes: '',
    funding_source: source
  });
});

fs.writeFileSync('kos-um/data.json', JSON.stringify(d, null, 2));

const totalMat = materials.reduce((s,m) => s+m.total, 0);
const totalJajan = jajan.reduce((s,j) => s+j.total, 0);
console.log('Added', materials.length, 'material +', jajan.length, 'jajan');
console.log('Material:', totalMat.toLocaleString('id-ID'));
console.log('Jajan:', totalJajan.toLocaleString('id-ID'));
console.log('Grand:', (totalMat+totalJajan).toLocaleString('id-ID'));
console.log('Last ID:', lastId);
