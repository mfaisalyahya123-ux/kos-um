const fs = require('fs');
const path = 'data.json';
let data = JSON.parse(fs.readFileSync(path,'utf8'));
if (!Array.isArray(data.transactions)) data.transactions = [];

// Remove all upah entries in range 2026-08-03 to 2026-08-08
const start = '2026-08-03', end = '2026-08-08';
const catSet = new Set(['Upah','Mandor','Tukang','Kuli']);
data.transactions = data.transactions.filter(t => !(t.date >= start && t.date <= end && catSet.has(t.category)));

let maxId = Math.max(...data.transactions.map(t => t.id));
const add = (date, cat, name, amt) => {
  maxId++;
  data.transactions.push({
    id: maxId, date, category: cat, subcategory: '', description: name,
    quantity: 1, unit: 'orang', price_per_unit: amt, total: amt,
    notes: '', funding_source: 'Uang Ayah'
  });
};

// Exact schedule from table: each person's daily amounts
// Key: [name, [date1:amt, date2:amt, ...]]
const schedule = [
  // --- Mandor ---
  ['Heri', { '2026-08-03':195000, '2026-08-04':195000, '2026-08-05':195000, '2026-08-06':150000, '2026-08-07':195000, '2026-08-08':150000 }],
  // --- Tukang ---
  ['Sueb', { '2026-08-03':175000, '2026-08-04':175000, '2026-08-05':175000, '2026-08-06':135000, '2026-08-07':175000, '2026-08-08':135000 }],
  ['Supar', { '2026-08-03':175000, '2026-08-04':175000, '2026-08-05':175000, '2026-08-06':135000, '2026-08-07':175000, '2026-08-08':135000 }],
  ['Jo', { '2026-08-03':175000, '2026-08-04':175000, '2026-08-05':175000, '2026-08-06':135000, '2026-08-07':175000, '2026-08-08':135000 }],
  ['Muji', { '2026-08-03':175000, '2026-08-07':175000, '2026-08-08':135000 }],  // Tue Wed Thu blank
  ['Gendut', { '2026-08-06':135000, '2026-08-07':175000, '2026-08-08':135000 }], // Thu Fri Sat
  // --- Kuli ---
  ['Ahmat', { '2026-08-03':155000, '2026-08-04':155000, '2026-08-05':155000, '2026-08-06':120000, '2026-08-08':120000 }], // Jumat blank
  ['Risky', { '2026-08-03':155000, '2026-08-04':155000, '2026-08-05':155000, '2026-08-06':120000, '2026-08-07':155000, '2026-08-08':120000 }],
  ['Rudi', { '2026-08-03':155000, '2026-08-04':155000, '2026-08-05':155000, '2026-08-06':120000, '2026-08-07':155000 }], // Sabtu blank
  ['Adit', { '2026-08-03':155000, '2026-08-04':155000, '2026-08-05':155000, '2026-08-06':120000, '2026-08-07':155000, '2026-08-08':120000 }],
  ['Izzut', { '2026-08-03':155000, '2026-08-04':155000, '2026-08-05':155000, '2026-08-06':120000, '2026-08-07':155000, '2026-08-08':120000 }],
  ['Samsul', { '2026-08-03':155000, '2026-08-04':155000, '2026-08-05':155000, '2026-08-06':120000, '2026-08-07':155000, '2026-08-08':120000 }],
  ['Nanto', { '2026-08-03':155000, '2026-08-04':155000, '2026-08-05':155000, '2026-08-06':120000, '2026-08-07':155000, '2026-08-08':120000 }]
];

const catMap = { Heri:'Mandor', Sueb:'Tukang', Supar:'Tukang', Jo:'Tukang', Muji:'Tukang', Gendut:'Tukang', Ahmat:'Kuli', Risky:'Kuli', Rudi:'Kuli', Adit:'Kuli', Izzut:'Kuli', Samsul:'Kuli', Nanto:'Kuli' };

let added = 0;
for (const [name, days] of schedule) {
  const cat = catMap[name];
  for (const [date, amt] of Object.entries(days)) {
    add(date, cat, name, amt);
    added++;
  }
}
fs.writeFileSync(path, JSON.stringify(data,null,2));
console.log('Removed all upah entries in 3-8 Aug. Added', added, 'correct entries. New maxId', maxId);
