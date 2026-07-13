const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
const maxId = Math.max(...data.transactions.map(t => t.id));

const newTransactions = [
  {
    id: maxId + 1,
    date: '2026-07-13',
    category: 'Material',
    description: 'Kawat ayakan 1 meter',
    quantity: 1,
    unit: 'meter',
    price_per_unit: 15000,
    total: 15000,
    notes: '',
    funding_source: 'Kas UM'
  },
  {
    id: maxId + 2,
    date: '2026-07-13',
    category: 'Material',
    description: 'Paku 3" 2kg',
    quantity: 2,
    unit: 'kg',
    price_per_unit: 20000,
    total: 40000,
    notes: '',
    funding_source: 'Kas UM'
  },
  {
    id: maxId + 3,
    date: '2026-07-13',
    category: 'Alat',
    description: 'Ember',
    quantity: 4,
    unit: 'pcs',
    price_per_unit: 8000,
    total: 32000,
    notes: '',
    funding_source: 'Kas UM'
  },
  {
    id: maxId + 4,
    date: '2026-07-13',
    category: 'Material',
    description: 'Benang tali',
    quantity: 1,
    unit: 'pcs',
    price_per_unit: 5000,
    total: 5000,
    notes: '',
    funding_source: 'Kas UM'
  }
];

data.transactions.push(...newTransactions);
fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
console.log('✅ Added 4 transactions');
