const fs = require('fs');
const data = JSON.parse(fs.readFileSync(__dirname + '/data.json', 'utf8'));
const txs = data.transactions.filter(t => t.category !== 'Upah');

// Exact duplicate: same desc + date + total
const keyMap = {};
txs.forEach(t => {
  const key = (t.description.trim().toLowerCase()) + '|' + t.date + '|' + t.total;
  if (!keyMap[key]) keyMap[key] = [];
  keyMap[key].push(t);
});

console.log('=== DUPLIKAT PERSIS (desc+date+total sama) ===');
let found = 0;
for (const [k, arr] of Object.entries(keyMap)) {
  if (arr.length > 1) {
    found++;
    const totalDup = arr.reduce((s, x) => s + x.total, 0);
    console.log(`PAIR #${found}: ${arr.length}x | key=${k}`);
    arr.forEach(x => console.log(`   id=${x.id} cat=${x.cat} unit=${x.unit} qty=${x.quantity} ppu=${x.price_per_unit} total=${x.total}`));
    console.log(`   >> total kalau kehitung 2x = Rp ${totalDup.toLocaleString('id-ID')}`);
  }
}
if (!found) console.log('(none)');
console.log('\n=== END ===');
