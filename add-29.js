const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data.json', 'utf8'));

const date = '2026-05-29';
let nextId = 82;

// === TRANSAKSI ===

// 1. Upah Mandor Heri
d.transactions.push({
  id: nextId++, date, category: "Upah", subcategory: "Mandor",
  description: "Upah mandor", quantity: 1, unit: "orang",
  price_per_unit: 150000, total: 150000, notes: "",
  funding_source: "Uang Ayah"
});

// 2. Upah 3 Kuli
d.transactions.push({
  id: nextId++, date, category: "Upah", subcategory: "Kuli",
  description: "Upah kuli (Rizky, Rudi, Adit)", quantity: 3, unit: "orang",
  price_per_unit: 120000, total: 360000, notes: "",
  funding_source: "Uang Ayah"
});

// 3. Coral 1 pickup
d.transactions.push({
  id: nextId++, date, category: "Material", subcategory: "",
  description: "Coral 1 pickup", quantity: 1, unit: "pickup",
  price_per_unit: 250000, total: 250000, notes: "",
  funding_source: "Uang Ayah"
});

// 4. Semen merah putih 20pcs
d.transactions.push({
  id: nextId++, date, category: "Material", subcategory: "",
  description: "Semen merah putih", quantity: 20, unit: "pcs",
  price_per_unit: 46000, total: 920000, notes: "",
  funding_source: "Uang Ayah"
});

// 5. Triplek 9mm 5pcs
d.transactions.push({
  id: nextId++, date, category: "Material", subcategory: "",
  description: "Triplek 9mm", quantity: 5, unit: "pcs",
  price_per_unit: 95000, total: 475000, notes: "",
  funding_source: "Uang Ayah"
});

// 6. Jasa buang material
d.transactions.push({
  id: nextId++, date, category: "Lain-lain", subcategory: "",
  description: "Jasa buang material", quantity: 1, unit: "kali",
  price_per_unit: 130000, total: 130000, notes: "",
  funding_source: "Uang Ayah"
});

// === ATTENDANCE ===
d.workers.mandor[0].attendance[date] = "hadir"; // Heri
d.workers.kuli[0].attendance[date] = "izin";    // Zaky
d.workers.kuli[1].attendance[date] = "hadir";   // Rizky
d.workers.kuli[2].attendance[date] = "hadir";   // Rudi
d.workers.kuli[3].attendance[date] = "hadir";   // Adit
d.workers.tukang[0].attendance[date] = "izin";  // Tohir
d.workers.tukang_baru[0].attendance[date] = "izin"; // Tukang Baru

// === DAILY WORK ===
if (!d.daily_work) d.daily_work = {};
d.daily_work[date] = "";

fs.writeFileSync('data.json', JSON.stringify(d, null, 2));
console.log('Done! Added 6 transactions + attendance for 2026-05-29');
console.log('IDs:', 82, '-', nextId - 1);
