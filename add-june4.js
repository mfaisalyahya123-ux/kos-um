const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

const today = "2026-06-04";

// Add transactions
const newTransactions = [
  {
    id: 114,
    date: today,
    category: "Upah",
    subcategory: "Harian",
    description: "Jasa buang material",
    quantity: 1,
    unit: "item",
    price_per_unit: 0,
    total: 0,
    notes: "Belum ada nilai nominal",
    funding_source: "Uang Ayah"
  },
  {
    id: 115,
    date: today,
    category: "Material",
    subcategory: "",
    description: "Pasir hitam Dhuhri",
    quantity: 1,
    unit: "pickup",
    price_per_unit: 280000,
    total: 280000,
    notes: "",
    funding_source: "Uang Ayah"
  },
  {
    id: 116,
    date: today,
    category: "Material",
    subcategory: "",
    description: "Semen Gresik",
    quantity: 10,
    unit: "sak",
    price_per_unit: 60000,
    total: 600000,
    notes: "",
    funding_source: "Uang Ayah"
  },
  {
    id: 117,
    date: today,
    category: "Jajan",
    subcategory: "",
    description: "Minuman Kuku Bima",
    quantity: 1,
    unit: "item",
    price_per_unit: 9000,
    total: 9000,
    notes: "",
    funding_source: "Uang Ayah"
  },
  {
    id: 118,
    date: today,
    category: "Material",
    subcategory: "",
    description: "Koral",
    quantity: 1,
    unit: "pickup",
    price_per_unit: 250000,
    total: 250000,
    notes: "",
    funding_source: "Uang Ayah"
  },
  {
    id: 119,
    date: today,
    category: "Material",
    subcategory: "",
    description: "Semen Merah Putih",
    quantity: 10,
    unit: "sak",
    price_per_unit: 46000,
    total: 460000,
    notes: "",
    funding_source: "Uang Ayah"
  },
  {
    id: 120,
    date: today,
    category: "Material",
    subcategory: "",
    description: "Adibond",
    quantity: 5,
    unit: "kg",
    price_per_unit: 65000,
    total: 325000,
    notes: "",
    funding_source: "Uang Ayah"
  },
  {
    id: 121,
    date: today,
    category: "Material",
    subcategory: "",
    description: "Triplek 9mm",
    quantity: 5,
    unit: "lembar",
    price_per_unit: 95000,
    total: 475000,
    notes: "",
    funding_source: "Uang Ayah"
  },
  {
    id: 122,
    date: today,
    category: "Material",
    subcategory: "",
    description: "Bata merah",
    quantity: 175,
    unit: "pcs",
    price_per_unit: 629, // 110000/175 = 628.57
    total: 110000,
    notes: "",
    funding_source: "Uang Ayah"
  }
];

data.transactions.push(...newTransactions);

// Auto-generate attendance
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

// Auto-generate wage transactions
let nextId = 123;
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

// Tukang
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

const materialTotal = newTransactions.slice(1).reduce((s,t) => s + t.total, 0);
const wageTotal = wageTransactions.reduce((s,t) => s + t.total, 0);

console.log('✅ Transaksi & absensi tercatat!');
console.log('');
console.log('📦 Material & Jajan (8 transaksi):');
console.log('   ID 114: Jasa buang material (nominal belum ada)');
console.log('   ID 115: Pasir hitam Dhuhri 1 pickup Rp 280.000');
console.log('   ID 116: Semen Gresik 10 sak Rp 600.000');
console.log('   ID 117: Kuku Bima Rp 9.000');
console.log('   ID 118: Koral 1 pickup Rp 250.000');
console.log('   ID 119: Semen Merah Putih 10 sak Rp 460.000');
console.log('   ID 120: Adibond 5kg Rp 325.000');
console.log('   ID 121: Triplek 9mm 5 lembar Rp 475.000');
console.log('   ID 122: Bata merah 175 pcs Rp 110.000');
console.log('   Subtotal: Rp ' + materialTotal.toLocaleString('id-ID'));
console.log('');
console.log('👷 Absensi: Semua hadir (7 orang)');
wageTransactions.forEach(tx => {
  console.log(`   ID ${tx.id}: ${tx.description} Rp ${tx.total.toLocaleString('id-ID')}`);
});
console.log('   Subtotal upah: Rp ' + wageTotal.toLocaleString('id-ID'));
console.log('');
console.log('💰 TOTAL HARI INI: Rp ' + (materialTotal + wageTotal).toLocaleString('id-ID'));
