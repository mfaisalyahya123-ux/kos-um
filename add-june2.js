const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

// Add transactions
const newTransactions = [
  {
    id: 103,
    date: "2026-06-02",
    category: "Material",
    subcategory: "",
    description: "Paku reng",
    quantity: 2,
    unit: "kg",
    price_per_unit: 19000,
    total: 38000,
    notes: "",
    funding_source: "Uang Ayah"
  },
  {
    id: 104,
    date: "2026-06-02",
    category: "Jajan",
    subcategory: "",
    description: "Tepung",
    quantity: 2,
    unit: "kg",
    price_per_unit: 12000,
    total: 24000,
    notes: "",
    funding_source: "Uang Ayah"
  },
  {
    id: 105,
    date: "2026-06-02",
    category: "Jajan",
    subcategory: "",
    description: "Gula",
    quantity: 1,
    unit: "kg",
    price_per_unit: 17500,
    total: 17500,
    notes: "",
    funding_source: "Uang Ayah"
  }
];

data.transactions.push(...newTransactions);

// Auto-generate attendance for June 2 (Tuesday = work day)
const today = "2026-06-02";
['mandor', 'tukang', 'tukang_baru', 'kuli'].forEach(role => {
  if (data.workers[role]) {
    data.workers[role].forEach(worker => {
      // Skip if already has attendance for today
      if (!worker.attendance[today]) {
        // Skip if worker has ended
        if (!worker.end_date || new Date(worker.end_date) >= new Date(today)) {
          worker.attendance[today] = 'hadir';
        }
      }
    });
  }
});

// Auto-generate wage transactions
let nextId = 106;
const wageTransactions = [];

// Mandor
const mandorPresent = data.workers.mandor.filter(w => 
  w.attendance[today] === 'hadir' && 
  (!w.end_date || new Date(w.end_date) >= new Date(today))
);
mandorPresent.forEach(w => {
  wageTransactions.push({
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

// Tukang (combine tukang + tukang_baru)
const tukangPresent = [
  ...data.workers.tukang.filter(w => 
    w.attendance[today] === 'hadir' && 
    (!w.end_date || new Date(w.end_date) >= new Date(today))
  ),
  ...data.workers.tukang_baru.filter(w => 
    w.attendance[today] === 'hadir' && 
    (!w.end_date || new Date(w.end_date) >= new Date(today))
  )
];
if (tukangPresent.length > 0) {
  const names = tukangPresent.map(w => w.name).join(', ');
  const total = tukangPresent.reduce((sum, w) => sum + w.rate, 0);
  wageTransactions.push({
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
const kuliPresent = data.workers.kuli.filter(w => 
  w.attendance[today] === 'hadir' && 
  (!w.end_date || new Date(w.end_date) >= new Date(today))
);
if (kuliPresent.length > 0) {
  const names = kuliPresent.map(w => w.name).join(', ');
  const total = kuliPresent.reduce((sum, w) => sum + w.rate, 0);
  wageTransactions.push({
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

data.transactions.push(...wageTransactions);

// Ensure daily_work entry
if (!data.daily_work[today]) {
  data.daily_work[today] = "";
}

fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

console.log('✅ Transaksi & absensi tercatat!');
console.log('   ID 103: Paku reng 2kg Rp 38.000');
console.log('   ID 104: Tepung 2kg Rp 24.000');
console.log('   ID 105: Gula 1kg Rp 17.500');
console.log('');
console.log('📋 Absensi 2 Juni: Semua hadir (7 orang)');
wageTransactions.forEach(tx => {
  console.log(`   ID ${tx.id}: ${tx.description} Rp ${tx.total.toLocaleString('id-ID')}`);
});
console.log('');
console.log(`   Total upah: Rp ${wageTransactions.reduce((s,t)=>s+t.total,0).toLocaleString('id-ID')}`);
console.log(`   Total hari ini: Rp ${(79500 + wageTransactions.reduce((s,t)=>s+t.total,0)).toLocaleString('id-ID')}`);
