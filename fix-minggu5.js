const d = JSON.parse(require('fs').readFileSync('kos-um/data.json','utf8'));

// Hapus ID 209 (Tukang 18 Jun yang include Paidi)
d.transactions = d.transactions.filter(t => t.id !== 209);
console.log('Removed ID 209');

// Verifikasi total upah Minggu 5
const mg5 = d.transactions.filter(t => t.date >= '2026-06-15' && t.date <= '2026-06-20' && t.category === 'Upah');
const total = mg5.reduce((s,t) => s + t.total, 0);
console.log('Total upah Minggu 5:', total);
console.log('Expected: 7.935.000');

// Per hari
const byDay = {};
mg5.forEach(t => {
    if (!byDay[t.date]) byDay[t.date] = 0;
    byDay[t.date] += t.total;
});
Object.keys(byDay).sort().forEach(dt => console.log('  ' + dt + ': Rp ' + byDay[dt].toLocaleString('id-ID')));

require('fs').writeFileSync('kos-um/data.json', JSON.stringify(d, null, 2));
console.log('Done');
