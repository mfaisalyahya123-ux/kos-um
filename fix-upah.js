const fs = require('fs');
const d = JSON.parse(fs.readFileSync('kos-um/data.json','utf8'));

// Hapus transaksi upah 22-27 Jun
d.transactions = d.transactions.filter(t => t.category !== 'Upah' || t.date < '2026-06-22' || t.date > '2026-06-27');

let lastId = Math.max(...d.transactions.map(t => t.id));

// Data upah per orang per hari
const wageData = {
    'Heri': { role: 'Mandor', days: { '2026-06-22': 195000, '2026-06-24': 195000, '2026-06-25': 150000, '2026-06-26': 195000, '2026-06-27': 150000 } },
    'Supar': { role: 'Tukang', days: { '2026-06-23': 175000, '2026-06-24': 175000, '2026-06-25': 135000, '2026-06-26': 175000, '2026-06-27': 135000 } },
    'Sueb': { role: 'Tukang', days: { '2026-06-22': 175000, '2026-06-23': 175000, '2026-06-24': 175000, '2026-06-25': 135000, '2026-06-26': 175000, '2026-06-27': 135000 } },
    'Nur': { role: 'Tukang', days: { '2026-06-22': 175000, '2026-06-23': 135000 } },
    'Rudi': { role: 'Kuli', days: { '2026-06-22': 155000, '2026-06-24': 155000, '2026-06-25': 120000, '2026-06-26': 155000, '2026-06-27': 120000 } },
    'Riski': { role: 'Kuli', days: { '2026-06-22': 155000, '2026-06-23': 155000, '2026-06-24': 155000, '2026-06-25': 120000, '2026-06-26': 155000, '2026-06-27': 120000 } },
    'Adit': { role: 'Kuli', days: { '2026-06-22': 155000, '2026-06-23': 155000, '2026-06-24': 155000, '2026-06-25': 120000, '2026-06-26': 155000, '2026-06-27': 120000 } },
    'Achmad': { role: 'Kuli', days: { '2026-06-22': 155000, '2026-06-23': 155000, '2026-06-24': 155000, '2026-06-25': 120000, '2026-06-26': 155000, '2026-06-27': 120000 } },
    'Muji': { role: 'Tukang', days: { '2026-06-22': 175000, '2026-06-23': 175000, '2026-06-24': 175000, '2026-06-25': 135000, '2026-06-26': 175000, '2026-06-27': 135000 } },
};

// Buat transaksi per orang per hari
Object.keys(wageData).forEach(name => {
    const info = wageData[name];
    Object.keys(info.days).forEach(date => {
        const amount = info.days[date];
        d.transactions.push({
            id: ++lastId,
            date,
            category: 'Upah',
            subcategory: info.role,
            description: 'Upah ' + info.role.toLowerCase() + ' ' + name,
            quantity: 1,
            unit: 'orang',
            price_per_unit: amount,
            total: amount,
            notes: '',
            funding_source: 'Uang Ayah'
        });
    });
});

fs.writeFileSync('kos-um/data.json', JSON.stringify(d, null, 2));
console.log('Done. Last ID:', lastId);

// Verify Selasa
const selUpah = d.transactions.filter(t => t.date === '2026-06-23' && t.category === 'Upah');
console.log('\nSelasa 23 Jun:');
selUpah.forEach(t => console.log(' ', t.description, '=', t.total));
console.log('Total tukang:', selUpah.filter(t => t.subcategory === 'Tukang').length, 'orang');
console.log('Total kuli:', selUpah.filter(t => t.subcategory === 'Kuli').length, 'orang');
