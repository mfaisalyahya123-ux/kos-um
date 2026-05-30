const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

// 1. Add new worker: Tukang Baru 2
data.workers.tukang_baru.push({
  name: "Tukang Baru 2",
  rate: 135000,
  attendance: { "2026-05-30": "hadir" }
});

// 2. Update attendance for May 30
data.workers.mandor[0].attendance["2026-05-30"] = "hadir"; // Heri
data.workers.tukang[0].attendance["2026-05-30"] = "izin"; // Tohir
data.workers.tukang_baru[0].attendance["2026-05-30"] = "izin"; // Tukang Baru
data.workers.kuli[0].attendance["2026-05-30"] = "hadir"; // Zaky
data.workers.kuli[1].attendance["2026-05-30"] = "hadir"; // Rizky
data.workers.kuli[2].attendance["2026-05-30"] = "hadir"; // Rudi
data.workers.kuli[3].attendance["2026-05-30"] = "hadir"; // Adit

// 3. Add daily work entry
data.daily_work["2026-05-30"] = "";

// 4. Add transactions (IDs 88-95)
const tx = [
  { id: 88, date: "2026-05-30", category: "Upah", subcategory: "Mandor", description: "Upah mandor Heri", quantity: 1, unit: "orang", price_per_unit: 150000, total: 150000, notes: "", funding_source: "Uang Ayah" },
  { id: 89, date: "2026-05-30", category: "Upah", subcategory: "Kuli", description: "Upah kuli (Zaky, Rizky, Rudi, Adit)", quantity: 4, unit: "orang", price_per_unit: 120000, total: 480000, notes: "", funding_source: "Uang Ayah" },
  { id: 90, date: "2026-05-30", category: "Upah", subcategory: "Tukang", description: "Upah tukang Tukang Baru 2", quantity: 1, unit: "orang", price_per_unit: 135000, total: 135000, notes: "", funding_source: "Uang Ayah" },
  { id: 91, date: "2026-05-30", category: "Alat", subcategory: "", description: "Ember", quantity: 4, unit: "pcs", price_per_unit: 9000, total: 36000, notes: "", funding_source: "Uang Ayah" },
  { id: 92, date: "2026-05-30", category: "Material", subcategory: "", description: "Paku reng", quantity: 1, unit: "kg", price_per_unit: 20000, total: 20000, notes: "", funding_source: "Uang Ayah" },
  { id: 93, date: "2026-05-30", category: "Alat", subcategory: "", description: "Benang", quantity: 2, unit: "pcs", price_per_unit: 5000, total: 10000, notes: "", funding_source: "Uang Ayah" },
  { id: 94, date: "2026-05-30", category: "Alat", subcategory: "", description: "Ban luar arko", quantity: 1, unit: "pcs", price_per_unit: 65000, total: 65000, notes: "", funding_source: "Uang Ayah" },
  { id: 95, date: "2026-05-30", category: "Jajan", subcategory: "", description: "Kuku bima", quantity: 2, unit: "pcs", price_per_unit: 9500, total: 19000, notes: "", funding_source: "Uang Ayah" }
];

data.transactions.push(...tx);

// 5. Update summary
const allDates = Object.keys(data.daily_work).sort();
data.summary.start_date = allDates[0];
data.summary.end_date = allDates[allDates.length - 1];

fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

console.log('✅ 30 Mei 2026 tercatat!');
console.log('   Worker baru: Tukang Baru 2');
console.log('   Transaksi: 8 (ID 88-95)');
console.log('   Total: Rp 915.000');
