const d = JSON.parse(require('fs').readFileSync('kos-um/data.json','utf8'));
let lastId = Math.max(...d.transactions.map(t => t.id));

// Tambah transaksi tukang 18 Jun (3 orang: Sugeng, Habib, Supar, tanpa Paidi)
d.transactions.push({
    id: ++lastId,
    date: '2026-06-18',
    category: 'Upah',
    subcategory: 'Tukang',
    description: 'Upah tukang (Sugeng, Habib, Supar)',
    quantity: 3,
    unit: 'orang',
    price_per_unit: 135000,
    total: 405000,
    notes: '',
    funding_source: 'Uang Ayah'
});

// Verifikasi
const mg5 = d.transactions.filter(t => t.date >= '2026-06-15' && t.date <= '2026-06-20' && t.category === 'Upah');
const total = mg5.reduce((s,t) => s + t.total, 0);
console.log('Total upah Minggu 5:', total);

const byDay = {};
mg5.forEach(t => {
    if (!byDay[t.date]) byDay[t.date] = 0;
    byDay[t.date] += t.total;
});
Object.keys(byDay).sort().forEach(dt => console.log('  ' + dt + ': Rp ' + byDay[dt].toLocaleString('id-ID')));

require('fs').writeFileSync('kos-um/data.json', JSON.stringify(d, null, 2));
console.log('Done');
