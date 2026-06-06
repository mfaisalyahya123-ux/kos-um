const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

const today = "2026-06-06";

// Ensure attendance for all workers (mandor, tukang, kuli) as hadir
['mandor', 'tukang', 'tukang_baru', 'kuli'].forEach(role => {
  if (data.workers[role]) {
    data.workers[role].forEach(worker => {
      if (!worker.attendance[today]) {
        if (!worker.end_date || new Date(worker.end_date) >= new Date(today)) {
          worker.attendance[today] = 'hadir';
        }
      }
    });
  }
});

// Auto‑generate wage transactions for today
let nextId = data.transactions[data.transactions.length - 1].id + 1;
const wageTx = [];

// Mandor
data.workers.mandor.filter(w => w.attendance[today] === 'hadir').forEach(w => {
  wageTx.push({
    id: nextId++,
    date: today,
    category: "Upah",
    subcategory: "Mandor",
    description: `Upah mandor ${w.name}`,
    quantity: 1,
    unit: "orang",
    price_per_unit: w.rate,
    total: w.rate,
    notes: "",
    funding_source: "Uang Ayah"
  });
});

// Tukang (both tukang and tukang_baru)
const tukangPresent = [
  ...data.workers.tukang.filter(w => w.attendance[today] === 'hadir'),
  ...data.workers.tukang_baru.filter(w => w.attendance[today] === 'hadir')
];
if (tukangPresent.length > 0) {
  const names = tukangPresent.map(w => w.name).join(', ');
  const total = tukangPresent.reduce((s,w) => s + w.rate, 0);
  wageTx.push({
    id: nextId++,
    date: today,
    category: "Upah",
    subcategory: "Tukang",
    description: `Upah tukang (${names})`,
    quantity: tukangPresent.length,
    unit: "orang",
    price_per_unit: 135000,
    total: total,
    notes: "",
    funding_source: "Uang Ayah"
  });
}

// Kuli
const kuliPresent = data.workers.kuli.filter(w => w.attendance[today] === 'hadir');
if (kuliPresent.length > 0) {
  const names = kuliPresent.map(w => w.name).join(', ');
  const total = kuliPresent.reduce((s,w) => s + w.rate, 0);
  wageTx.push({
    id: nextId++,
    date: today,
    category: "Upah",
    subcategory: "Kuli",
    description: `Upah kuli (${names})`,
    quantity: kuliPresent.length,
    unit: "orang",
    price_per_unit: 120000,
    total: total,
    notes: "",
    funding_source: "Uang Ayah"
  });
}

data.transactions.push(...wageTx);

if (!data.daily_work[today]) data.daily_work[today] = "";

fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

console.log('✅ Absensi & upah tercatat untuk 6 Juni!');
wageTx.forEach(tx => {
  console.log(`   ID ${tx.id}: ${tx.description} Rp ${tx.total.toLocaleString('id-ID')}`);
});
