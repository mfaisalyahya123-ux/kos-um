const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data.json', 'utf8'));
const terms = ['bata ringan', 'glasblok', 'pipa 3', 'rucika 3', 'bata ringan 7'];
const hits = d.transactions.filter(x => terms.some(t => x.description.toLowerCase().includes(t)));
console.log('Match ditemukan:', hits.length);
hits.forEach(h => console.log(`- id ${h.id} | ${h.date} | ${h.description} | ${h.total}`));

// juga cek per tanggal
['2026-07-27','2026-07-29'].forEach(dt => {
  const c = d.transactions.filter(x => x.date === dt && x.category === 'Material');
  console.log(`\nMaterial tgl ${dt}: ${c.length}`);
  c.forEach(h => console.log(`  id ${h.id} | ${h.description} | ${h.total}`));
});
