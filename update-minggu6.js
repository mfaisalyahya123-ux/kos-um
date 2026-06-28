const fs = require('fs');
const d = JSON.parse(fs.readFileSync('kos-um/data.json','utf8'));

const weekdays = ['2026-06-22','2026-06-23','2026-06-24','2026-06-25','2026-06-26','2026-06-27'];

// Data dari tabel user
const wageData = {
    'Heri': { role: 'Mandor', days: { '2026-06-22': 195000, '2026-06-24': 195000, '2026-06-25': 150000, '2026-06-26': 195000, '2026-06-27': 150000 } },
    'Supar': { role: 'Tukang', days: { '2026-06-23': 175000, '2026-06-24': 175000, '2026-06-25': 135000, '2026-06-26': 175000, '2026-06-27': 135000 } },
    'Sueb': { role: 'Tukang', days: { '2026-06-22': 175000, '2026-06-23': 175000, '2026-06-24': 175000, '2026-06-25': 135000, '2026-06-26': 175000, '2026-06-27': 135000 } },
    'Nur': { role: 'Tukang', days: { '2026-06-22': 175000, '2026-06-23': 135000 } },
    'Paidi': { role: 'Tukang', days: {} },
    'Rudi': { role: 'Kuli', days: { '2026-06-22': 155000, '2026-06-24': 155000, '2026-06-25': 120000, '2026-06-26': 155000, '2026-06-27': 120000 } },
    'Riski': { role: 'Kuli', days: { '2026-06-22': 155000, '2026-06-23': 155000, '2026-06-24': 155000, '2026-06-25': 120000, '2026-06-26': 155000, '2026-06-27': 120000 } },
    'Adit': { role: 'Kuli', days: { '2026-06-22': 155000, '2026-06-23': 155000, '2026-06-24': 155000, '2026-06-25': 120000, '2026-06-26': 155000, '2026-06-27': 120000 } },
    'Achmad': { role: 'Kuli', days: { '2026-06-22': 155000, '2026-06-23': 155000, '2026-06-24': 155000, '2026-06-25': 120000, '2026-06-26': 155000, '2026-06-27': 120000 } },
    'Muji': { role: 'Tukang', days: { '2026-06-22': 175000, '2026-06-23': 175000, '2026-06-24': 175000, '2026-06-25': 135000, '2026-06-26': 175000, '2026-06-27': 135000 } },
};

// --- 1. Tambah pekerja baru (Sueb, Nur, Muji) ---
// Cek dulu apakah sudah ada
function ensureWorker(name, role, rate) {
    let w = null;
    if (role === 'Tukang') {
        w = [...d.workers.tukang, ...d.workers.tukang_baru].find(x => x.name === name);
        if (!w) {
            d.workers.tukang.push({ name, rate, attendance: {} });
            w = d.workers.tukang[d.workers.tukang.length - 1];
            console.log('Added tukang:', name);
        }
    } else if (role === 'Kuli') {
        w = d.workers.kuli.find(x => x.name === name);
        if (!w) {
            d.workers.kuli.push({ name, rate, attendance: {} });
            w = d.workers.kuli[d.workers.kuli.length - 1];
            console.log('Added kuli:', name);
        }
    }
    return w;
}

ensureWorker('Sueb', 'Tukang', 175000);
ensureWorker('Nur', 'Tukang', 175000);
ensureWorker('Muji', 'Tukang', 175000);

// --- 2. Set end_date pekerja lama yang tidak aktif ---
['Sugeng','Habib'].forEach(name => {
    const w = d.workers.tukang.find(x => x.name === name);
    if (w && !w.end_date) { w.end_date = '2026-06-21'; console.log(name + ' end_date'); }
});
const wari = d.workers.kuli.find(x => x.name === 'Wari');
if (wari && !wari.end_date) { wari.end_date = '2026-06-21'; console.log('Wari end_date'); }

// --- 3. Update attendance berdasarkan wageData ---
Object.keys(wageData).forEach(name => {
    const info = wageData[name];
    let w = null;
    
    // Find worker
    if (info.role === 'Mandor') w = d.workers.mandor.find(x => x.name === name);
    else if (info.role === 'Tukang') w = [...d.workers.tukang, ...d.workers.tukang_baru].find(x => x.name === name);
    else if (info.role === 'Kuli') w = d.workers.kuli.find(x => x.name === name);
    
    if (!w) { console.log('WARNING: worker not found:', name); return; }
    
    // Clear old attendance for this week
    weekdays.forEach(dt => delete w.attendance[dt]);
    
    // Set new attendance
    Object.keys(info.days).forEach(dt => {
        w.attendance[dt] = 'hadir';
    });
    
    console.log(name + ':', Object.keys(info.days).length, 'days');
});

// --- 4. Hapus transaksi upah lama 22-27 Jun ---
const before = d.transactions.length;
d.transactions = d.transactions.filter(t => t.category !== 'Upah' || t.date < '2026-06-22' || t.date > '2026-06-27');
console.log('Removed', before - d.transactions.length, 'old upah tx');

// --- 5. Buat transaksi upah baru per hari per role ---
let lastId = Math.max(...d.transactions.map(t => t.id));

weekdays.forEach(date => {
    // Kumpulkan pekerja per role per hari
    const byRole = { Mandor: [], Tukang: [], Kuli: [] };
    
    Object.keys(wageData).forEach(name => {
        const info = wageData[name];
        if (info.days[date]) {
            byRole[info.role].push({ name, amount: info.days[date] });
        }
    });
    
    // Group by rate (2x vs normal) per role
    Object.keys(byRole).forEach(role => {
        const workers = byRole[role];
        if (workers.length === 0) return;
        
        // Group by amount
        const byAmount = {};
        workers.forEach(w => {
            if (!byAmount[w.amount]) byAmount[w.amount] = [];
            byAmount[w.amount].push(w.name);
        });
        
        Object.keys(byAmount).forEach(amount => {
            const names = byAmount[amount];
            const amt = parseInt(amount);
            d.transactions.push({
                id: ++lastId,
                date,
                category: 'Upah',
                subcategory: role,
                description: 'Upah ' + role.toLowerCase() + ' (' + names.join(', ') + ')',
                quantity: names.length,
                unit: 'orang',
                price_per_unit: amt,
                total: names.length * amt,
                notes: '',
                funding_source: 'Uang Ayah'
            });
        });
    });
});

// --- 6. Update daily_work ---
d.daily_work['2026-06-22'] = 'Sueb, Nur, Muji baru; Heri & Rudi masuk';
d.daily_work['2026-06-23'] = 'Sugeng, Habib, Wari tidak masuk';
d.daily_work['2026-06-24'] = 'Nur tidak masuk';
d.daily_work['2026-06-25'] = 'Nur tidak masuk';
d.daily_work['2026-06-26'] = 'Semua masuk';
d.daily_work['2026-06-27'] = 'Semua masuk';

fs.writeFileSync('kos-um/data.json', JSON.stringify(d, null, 2));
console.log('Done. Last ID:', lastId);

// Verify totals
console.log('\n=== VERIFIKASI TOTAL ===');
Object.keys(wageData).forEach(name => {
    const info = wageData[name];
    const total = Object.values(info.days).reduce((s, v) => s + v, 0);
    const txTotal = d.transactions
        .filter(t => t.date >= '2026-06-22' && t.date <= '2026-06-27' && t.description.includes(name))
        .reduce((s, t) => s + t.total, 0);
    // Note: txTotal includes all workers in the group, not individual
    console.log(name + ': expected total =', total);
});
