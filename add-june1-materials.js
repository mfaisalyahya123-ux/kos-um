const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

// Add 3 transactions
const newTransactions = [
  {
    id: 100,
    date: "2026-06-01",
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
    id: 101,
    date: "2026-06-01",
    category: "Material",
    subcategory: "",
    description: "Semen Merah Putih",
    quantity: 20,
    unit: "sak",
    price_per_unit: 46000,
    total: 920000,
    notes: "",
    funding_source: "Uang Ayah"
  },
  {
    id: 102,
    date: "2026-06-01",
    category: "Material",
    subcategory: "",
    description: "Bata merah",
    quantity: 200,
    unit: "pcs",
    price_per_unit: 620,
    total: 124000,
    notes: "",
    funding_source: "Uang Ayah"
  }
];

data.transactions.push(...newTransactions);

fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

console.log('✅ 3 transaksi tercatat!');
console.log('   ID 100: Koral 1 pickup Rp 250.000');
console.log('   ID 101: Semen Merah Putih 20 sak Rp 920.000');
console.log('   ID 102: Bata merah 200 pcs Rp 124.000');
console.log('   Total: Rp 1.294.000');
