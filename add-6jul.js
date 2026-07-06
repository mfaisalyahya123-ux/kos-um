const fs = require('fs');
const d = JSON.parse(fs.readFileSync('kos-um/data.json','utf8'));

let lastId = Math.max(...d.transactions.map(t => t.id));
const date = '2026-07-06';

const items = [
  {cat:'Jajan', desc:'Minyak goreng 2 liter', qty:1, unit:'botol', price:44000, total:44000, source:'Kas UM'},
  {cat:'Material', desc:'Kabel NYM 1.5mm 100m', qty:1, unit:'roll', price:454000, total:454000, source:'Uang Ayah'},
  {cat:'Material', desc:'Pipa conduit boss 20mm', qty:30, unit:'batang', price:12500, total:375000, source:'Uang Ayah'}
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
    funding_source: it.source
  });
});

fs.writeFileSync('kos-um/data.json', JSON.stringify(d, null, 2));

const totalKasUM = items.filter(i=>i.source==='Kas UM').reduce((s,i)=>s+i.total,0);
const totalAyah = items.filter(i=>i.source==='Uang Ayah').reduce((s,i)=>s+i.total,0);
console.log('Added', items.length, 'transactions');
console.log('Kas UM:', totalKasUM.toLocaleString('id-ID'));
console.log('Uang Ayah:', totalAyah.toLocaleString('id-ID'));
console.log('Total:', (totalKasUM+totalAyah).toLocaleString('id-ID'));
console.log('Last ID:', lastId);
