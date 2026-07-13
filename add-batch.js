const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data.json');
const raw = fs.readFileSync(dataPath, 'utf8');
const data = JSON.parse(raw);

const maxId = data.transactions.reduce((m, t) => Math.max(m, t.id), 0);

const newTransactions = [
  {
    id: maxId + 1,
    date: "2026-07-13",
    category: "Material",
    description: "Kawat ayakan",
    quantity: 1,
    unit: "meter",
    price_per_unit: 15000,
    total: 15000,
    notes: "",
    funding_source: "Kas UM"
  },
  {
    id: maxId + 2,
    date: "2026-07-13",
    category: "Material",
    description: "Paku 3 inch",
    quantity: 2,
    unit: "kg",
    price_per_unit: 20000,
    total: 40000,
    notes: "",
    funding_source: "Kas UM"
  },
  {
    id: maxId + 3,
    date: "2026-07-13",
    category: "Alat",
    description: "Ember",
    quantity: 4,
    unit: "pcs",
    price_per_unit: 8000,
    total: 32000,
    notes: "",
    funding_source: "Kas UM"
  },
  {
    id: maxId + 4,
    date: "2026-07-13",
    category: "Material",
    description: "Benang tali",
    quantity: 1,
    unit: "pcs",
    price_per_unit: 5000,
    total: 5000,
    notes: "",
    funding_source: "Kas UM"
  }
];

data.transactions.push(...newTransactions);
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

console.log(`Added ${newTransactions.length} transactions.`);
console.log(`New IDs: ${newTransactions.map(t => t.id).join(', ')}`);
console.log(`Total new: Rp ${newTransactions.reduce((s, t) => s + t.total, 0).toLocaleString('id-ID')}`);
