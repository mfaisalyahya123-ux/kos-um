const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data.json', 'utf8'));
let m = Math.max(...d.transactions.map(t => t.id));

const add = (date, cat, desc, q, unit, ppu, tot) => {
  m++;
  d.transactions.push({
    id: m, date, category: cat, subcategory: '',
    description: desc, quantity: q, unit,
    price_per_unit: ppu, total: tot,
    notes: '', funding_source: 'Uang Ayah'
  });
};

// === 8 Agustus ===
add('2026-08-08', 'Alat', 'Lampu 20watt', 4, 'pcs', 30000, 120000);
add('2026-08-08', 'Jajan', 'Luwak Kopi 200gr', 2, 'pcs', 7500, 15000);
add('2026-08-08', 'Jajan', 'Kapal Api 90gr', 1, 'pcs', 8500, 8500);
add('2026-08-08', 'Struktur Bangunan', 'Pintu kamar mandi', 1, 'pcs', 450000, 450000);
add('2026-08-08', 'Material', 'Tali tampar 2mm 150m', 1, 'pcs', 26000, 26000);
add('2026-08-08', 'Jajan', 'Kopi ya 2,25kg', 1, 'pcs', 173000, 173000);
add('2026-08-08', 'Jajan', 'Tepung 4kg', 1, 'pcs', 42000, 42000);
add('2026-08-08', 'Alat', 'Ember kaleng', 12, 'pcs', 5750, 69000);
add('2026-08-08', 'Jajan', 'Tepung maizena 500gr', 1, 'pcs', 9000, 9000);
add('2026-08-08', 'Jajan', 'Ragi roti 100gr', 1, 'pcs', 14000, 14000);

// === 1 Agustus ===
add('2026-08-01', 'Jajan', 'Luwak Kopi 200gr', 2, 'pcs', 7500, 15000);
add('2026-08-01', 'Jajan', 'Kapal Api 90gr', 1, 'pcs', 8500, 8500);
add('2026-08-01', 'Material', 'Pipa T 4"', 4, 'pcs', 20000, 80000);
add('2026-08-01', 'Material', 'Pipa knee 4"', 3, 'pcs', 20000, 60000);
add('2026-08-01', 'Jajan', 'Luwak Kopi 200gr', 2, 'pcs', 7500, 15000);
add('2026-08-01', 'Jajan', 'Kapal Api 90gr', 1, 'pcs', 8500, 8500);
add('2026-08-01', 'Material', 'Pipa knee 45 derajat', 16, 'pcs', 13313, 213000);
add('2026-08-01', 'Material', 'Pipa knee 2"', 10, 'pcs', 7000, 70000);
add('2026-08-01', 'Material', 'Pipa T 2"', 5, 'pcs', 12000, 60000);
add('2026-08-01', 'Material', 'Paku kalsiboard', 1, 'dus', 27000, 27000);
add('2026-08-01', 'Material', 'Pipa T 1/2"', 5, 'pcs', 3500, 17500);
add('2026-08-01', 'Material', 'Pipa T 1/2" (6pcs)', 6, 'pcs', 2000, 12000);
add('2026-08-01', 'Material', 'Pipa knee 1/2"', 6, 'pcs', 2200, 13200);

fs.writeFileSync('data.json', JSON.stringify(d, null, 2));
console.log('Added', d.transactions.length - 595, 'transactions. Max ID:', m);
