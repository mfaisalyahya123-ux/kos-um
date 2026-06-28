const d = JSON.parse(require('fs').readFileSync('kos-um/data.json','utf8'));
const txs = d.transactions;

console.log('=== AUDIT TOTAL PENGELUARAN ===\n');

// Grand total dari semua transaksi
const grandTotal = txs.reduce((s, t) => s + (t.total || 0), 0);
console.log('Grand Total (semua tx): Rp ' + grandTotal.toLocaleString('id-ID'));
console.log('Website: Rp 92.97 Jt = Rp 92.970.000');
console.log('Match:', grandTotal === 92970000 ? '✅' : '❌ SELISIH Rp ' + (grandTotal - 92970000));

// Per kategori
console.log('\n=== PER KATEGORI ===');
const cats = {};
txs.forEach(t => {
    const c = t.category || 'Lain-lain';
    if (!cats[c]) cats[c] = 0;
    cats[c] += (t.total || 0);
});

const knownOrder = ['Struktur Bangunan', 'Upah', 'Material', 'Alat', 'Jajan', 'Lain-lain'];
knownOrder.forEach(c => {
    if (cats[c]) {
        const pct = ((cats[c] / grandTotal) * 100).toFixed(1);
        console.log(c + ': Rp ' + cats[c].toLocaleString('id-ID') + ' (' + pct + '%)');
    }
});

console.log('\nWebsite:');
console.log('  Struktur Bangunan: 31.3%');
console.log('  Upah Pekerja: 35.8%');
console.log('  Material & Alat: 30.8%');

// Check Minggu 5 (15-20 Jun)
console.log('\n=== MINGGU 5 (15-20 Jun) ===');
const mg5 = txs.filter(t => t.date >= '2026-06-15' && t.date <= '2026-06-20');
const mg5Total = mg5.reduce((s,t) => s + t.total, 0);
console.log('Total transaksi:', mg5.length, 'tx = Rp ' + mg5Total.toLocaleString('id-ID'));

const mg5cats = {};
mg5.forEach(t => {
    const c = t.category || 'Lain-lain';
    if (!mg5cats[c]) mg5cats[c] = 0;
    mg5cats[c] += (t.total || 0);
});
Object.keys(mg5cats).forEach(c => console.log('  ' + c + ': Rp ' + mg5cats[c].toLocaleString('id-ID')));

// Check Minggu 6 (22-27 Jun)
console.log('\n=== MINGGU 6 (22-27 Jun) ===');
const mg6 = txs.filter(t => t.date >= '2026-06-22' && t.date <= '2026-06-27');
const mg6Total = mg6.reduce((s,t) => s + t.total, 0);
console.log('Total transaksi:', mg6.length, 'tx = Rp ' + mg6Total.toLocaleString('id-ID'));

const mg6cats = {};
mg6.forEach(t => {
    const c = t.category || 'Lain-lain';
    if (!mg6cats[c]) mg6cats[c] = 0;
    mg6cats[c] += (t.total || 0);
});
Object.keys(mg6cats).forEach(c => console.log('  ' + c + ': Rp ' + mg6cats[c].toLocaleString('id-ID')));

// Verify upah Minggu 6
console.log('\n=== UPAH MINGGU 6 (per orang) ===');
const expectedWages = {
    'Heri': 885000, 'Supar': 795000, 'Sueb': 970000, 'Nur': 310000,
    'Paidi': 0, 'Rudi': 705000, 'Riski': 860000, 'Adit': 860000,
    'Achmad': 860000, 'Muji': 970000
};
Object.keys(expectedWages).forEach(name => {
    const actual = txs
        .filter(t => t.date >= '2026-06-22' && t.date <= '2026-06-27' && t.category === 'Upah' && t.description.includes(name))
        .reduce((s,t) => s + t.total, 0);
    const expected = expectedWages[name];
    const ok = actual === expected ? '✅' : '❌';
    if (expected > 0) console.log('  ' + ok + ' ' + name + ': Rp ' + actual.toLocaleString('id-ID') + ' (expected Rp ' + expected.toLocaleString('id-ID') + ')');
});

// Verify upah Minggu 5
console.log('\n=== UPAH MINGGU 5 (per hari) ===');
const mg5Upah = txs.filter(t => t.date >= '2026-06-15' && t.date <= '2026-06-20' && t.category === 'Upah');
const mg5ByDay = {};
mg5Upah.forEach(t => {
    if (!mg5ByDay[t.date]) mg5ByDay[t.date] = 0;
    mg5ByDay[t.date] += t.total;
});
Object.keys(mg5ByDay).sort().forEach(dt => console.log('  ' + dt + ': Rp ' + mg5ByDay[dt].toLocaleString('id-ID')));

// Struktur Bangunan
console.log('\n=== STRUKTUR BANGUNAN ===');
const sb = txs.filter(t => t.category === 'Struktur Bangunan');
sb.forEach(t => console.log('  ID:' + t.id + ' | ' + t.date + ' | ' + t.subcategory + ' | ' + t.description + ' | Rp ' + t.total.toLocaleString('id-ID')));
console.log('  Total: Rp ' + sb.reduce((s,t)=>s+t.total,0).toLocaleString('id-ID'));

// Check habis di Minggu 4 (8-13 Jun)
console.log('\n=== MINGGU 4 (8-13 Jun) ===');
const mg4 = txs.filter(t => t.date >= '2026-06-08' && t.date <= '2026-06-13');
const mg4Total = mg4.reduce((s,t) => s + t.total, 0);
console.log('Total transaksi:', mg4.length, 'tx = Rp ' + mg4Total.toLocaleString('id-ID'));
const mg4cats = {};
mg4.forEach(t => {
    const c = t.category || 'Lain-lain';
    if (!mg4cats[c]) mg4cats[c] = 0;
    mg4cats[c] += (t.total || 0);
});
Object.keys(mg4cats).forEach(c => console.log('  ' + c + ': Rp ' + mg4cats[c].toLocaleString('id-ID')));
