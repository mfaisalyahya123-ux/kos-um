const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

// 1. Remove workers (keep historical data by marking them as inactive)
// We'll keep them in the data but mark them somehow, or just remove from active list
// For now, let's restructure: keep old workers in a separate "former_workers" section

// Create former_workers if it doesn't exist
if (!data.former_workers) {
  data.former_workers = {
    mandor: [],
    tukang: [],
    kuli: [],
    tukang_baru: []
  };
}

// Move Tohir to former_workers
const tohir = data.workers.tukang.find(w => w.name === "Tohir");
if (tohir) {
  data.former_workers.tukang.push(tohir);
  data.workers.tukang = data.workers.tukang.filter(w => w.name !== "Tohir");
}

// Move Tukang Baru to former_workers
const tukanglama = data.workers.tukang_baru.find(w => w.name === "Tukang Baru");
if (tukanglama) {
  data.former_workers.tukang_baru.push(tukanglama);
  data.workers.tukang_baru = data.workers.tukang_baru.filter(w => w.name !== "Tukang Baru");
}

// Move Zaky to former_workers
const zaky = data.workers.kuli.find(w => w.name === "Zaky");
if (zaky) {
  data.former_workers.kuli.push(zaky);
  data.workers.kuli = data.workers.kuli.filter(w => w.name !== "Zaky");
}

// 2. Rename Tukang Baru 2 to Supar
const supar = data.workers.tukang_baru.find(w => w.name === "Tukang Baru 2");
if (supar) {
  supar.name = "Supar";
}

// 3. Add new workers
// Rojin (tukang)
data.workers.tukang.push({
  name: "Rojin",
  rate: 135000,
  attendance: {}
});

// Adi (kuli)
data.workers.kuli.push({
  name: "Adi",
  rate: 120000,
  attendance: {}
});

// 4. Add transaction: Linggis Rp 65.000 (ID 96)
data.transactions.push({
  id: 96,
  date: "2026-06-01",
  category: "Alat",
  subcategory: "",
  description: "Linggis",
  quantity: 1,
  unit: "pcs",
  price_per_unit: 65000,
  total: 65000,
  notes: "",
  funding_source: "Uang UM"
});

// 5. Add daily_work entry for June 1
data.daily_work["2026-06-01"] = "";

// 6. Update summary dates
const allDates = Object.keys(data.daily_work).sort();
data.summary.start_date = allDates[0];
data.summary.end_date = allDates[allDates.length - 1];

fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

console.log('✅ Workers updated!');
console.log('   Keluar: Tohir, Tukang Baru, Zaky');
console.log('   Rename: Tukang Baru 2 → Supar');
console.log('   Masuk: Rojin (tukang), Adi (kuli)');
console.log('✅ Transaksi ID 96: Linggis Rp 65.000 (Uang UM)');
