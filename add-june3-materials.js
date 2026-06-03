const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

const newTransactions = [
  {
    id: 112,
    date: "2026-06-03",
    category: "Material",
    subcategory: "",
    description: "Paku cor 3dm",
    quantity: 1,
    unit: "dus",
    price_per_unit: 20000,
    total: 20000,
    notes: "",
    funding_source: "Uang Ayah"
  },
  {
    id: 113,
    date: "2026-06-03",
    category: "Material",
    subcategory: "",
    description: "Paku pring",
    quantity: 2,
    unit: "kg",
    price_per_unit: 17000,
    total: 34000,
    notes: "",
    funding_source: "Uang Ayah"
  }
];

data.transactions.push(...newTransactions);

fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

console.log('✅ Transaksi material tercatat!');
console.log('   ID 112: Paku cor 3dm 1 dus Rp 20.000');
console.log('   ID 113: Paku pring 2kg Rp 34.000');
console.log('');
console.log('   Total material: Rp 54.000');
console.log('   Total hari ini (material + upah): Rp 954.000');
