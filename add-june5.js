const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

const today = "2026-06-05";

// Add transactions
const newTransactions = [
  {
    id: 126,
    date: today,
    category: "Jajan",
    subcategory: "",
    description: "Kopi ya",
    quantity: 1,
    unit: "kg",
    price_per_unit: 97000,
    total: 97000,
    notes: "",
    funding_source: "Uang Ayah"
  },
  {
    id: 127,
    date: today,
    category: "Jajan",
    subcategory: "",
    description: "Galon",
    quantity: 1,
    unit: "item",
    price_per_unit: 5000,
    total: 5000,
    notes: "",
    funding_source: "Uang Ayah"
  }
];

data.transactions.push(...newTransactions);

// Auto-generate attendance - but Rojin izin
['mandor', 'tukang', 'tukang_baru', 'kuli'].forEach(role => {
  if (data.workers[role]) {
    data.workers[role].forEach(worker => {
      if (!worker.attendance[today]) {
        if (!worker.end_date || new Date(worker.end_date) >= new Date(today)) {
          // Rojin izin, others hadir
          if (worker.name === 'Rojin') {
            worker.attendance[today] = 'izin';
          } else {
            worker.attendance[today] = 'hadir';
          }
        }
      }
    });
  }
});

// Auto-generate wage transactions
let nextId = 128;
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

// Tukang - only Supar (Rojin izin)
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

if (!data.daily_work[today]) {
  data.daily_work[today] = "";
}

fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

const jajanTotal = newTransactions.reduce((s,t) => s + t.total, 0);
const wageTotal = wageTransactions.reduce((s,t) => s + t.total, 0);

console.log('✅ Transaksi & absensi tercatat!');
console.log('');
console.log('📦 Jajan:');
console.log('   ID 126: Kopi ya 1kg Rp 97.000');
console.log('   ID 127: Galon Rp 5.000');
console.log('   Subtotal: Rp ' + jajanTotal.toLocaleString('id-ID'));
console.log('');
console.log('👷 Absensi: 6 hadir, 1 izin (Rojin)');
wageTransactions.forEach(tx => {
  console.log(`   ID ${tx.id}: ${tx.description} Rp ${tx.total.toLocaleString('id-ID')}`);
});
console.log('   Subtotal upah: Rp ' + wageTotal.toLocaleString('id-ID'));
console.log('');
console.log('💰 TOTAL HARI INI: Rp ' + (jajanTotal + wageTotal).toLocaleString('id-ID'));
