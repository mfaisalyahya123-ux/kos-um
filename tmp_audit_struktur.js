const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data.json', 'utf8'));
const kw = ['bata ringan','besi','semen','beton','koral','pasir','cor','wiremesh','usuk','dak','bekisting','bekesting','coral'];
const strukturCat = d.transactions.filter(x => x.category === 'Struktur Bangunan');
console.log('=== SUDAH di Struktur Bangunan ('+strukturCat.length+') ===');
strukturCat.forEach(h => console.log(`  id ${h.id} | ${h.date} | ${h.subcategory||'-'} | ${h.description} | ${h.total}`));

console.log('\n=== KANDIDAT struktural tapi BUKAN di Struktur Bangunan ===');
const cand = d.transactions.filter(x => x.category !== 'Struktur Bangunan' && kw.some(k => x.description.toLowerCase().includes(k)));
cand.forEach(h => console.log(`  id ${h.id} | ${h.date} | ${h.category}/${h.subcategory||'-'} | ${h.description} | qty ${h.quantity}${h.unit} | ${h.total}`));
console.log('\nTotal kandidat:', cand.length);
