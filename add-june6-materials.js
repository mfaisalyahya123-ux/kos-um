const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json','utf8'));
const today = '2026-06-06';
const newTransactions = [
  {
    id: 134,
    date: today,
    category: 'Material',
    subcategory: '',
    description: 'Coral',
    quantity: 1,
    unit: 'pickup',
    price_per_unit: 280000,
    total: 280000,
    notes: '',
    funding_source: 'Uang Ayah'
  },
  {
    id: 135,
    date: today,
    category: 'Material',
    subcategory: '',
    description: 'Pasir hitam Dhuhri',
    quantity: 1,
    unit: 'truk',
    price_per_unit: 1850000,
    total: 1850000,
    notes: '',
    funding_source: 'Uang Ayah'
  }
];

data.transactions.push(...newTransactions);
fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
console.log('✅ Transaksi hari ini tercatat');
console.log('   ID 134: Coral 1 pickup Rp 280.000');
console.log('   ID 135: Pasir hitam Dhuhri 1 truk Rp 1.850.000');
