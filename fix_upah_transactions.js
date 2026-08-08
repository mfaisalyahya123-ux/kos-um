const fs = require('fs');
const path = 'data.json';
let data = JSON.parse(fs.readFileSync(path,'utf8'));
// Remove previously added Upah entries for 2026-08-01 (date wrong)
const names = ['Heri','Sueb','Supar','Jo','Muji','Aris','Gendut','Ahmat','Rudi','Risky','Adit','Izzut','Samsul','Nanto','Arif'];
if (!Array.isArray(data.transactions)) data.transactions = [];
let before = data.transactions.length;
// Filter out entries with date 2026-08-01, category 'Upah' or description in names
 data.transactions = data.transactions.filter(t => !(t.date === '2026-08-01' && names.includes(t.description)) );
let removed = before - data.transactions.length;
let maxId = Math.max(...data.transactions.map(t => t.id));
const addEntry = (date, cat, name, amount) => {
  maxId++;
  data.transactions.push({
    id: maxId,
    date,
    category: cat,
    subcategory: '',
    description: name,
    quantity: 1,
    unit: 'orang',
    price_per_unit: amount,
    total: amount,
    notes: '',
    funding_source: 'Uang Ayah'
  });
};
// Dates
const dates = {
  '2026-07-27': 'Senin',
  '2026-07-28': 'Selasa',
  '2026-07-29': 'Rabu',
  '2026-07-30': 'Kamis',
  '2026-07-31': 'Jumat',
  '2026-08-01': 'Sabtu'
};
// Mapping per person
const schedule = {
  // Mandor
  Heri: { '2026-07-27':195000, '2026-07-28':195000, '2026-07-29':195000, '2026-07-31':195000, '2026-08-01':150000 },
  // Tukang
  Sueb: { '2026-07-27':175000, '2026-07-28':175000, '2026-07-29':175000, '2026-07-30':135000, '2026-07-31':175000, '2026-08-01':135000 },
  Supar: { '2026-07-27':175000, '2026-07-28':175000, '2026-07-29':175000, '2026-07-30':135000, '2026-07-31':175000, '2026-08-01':135000 },
  Jo:    { '2026-07-27':175000, '2026-07-28':175000, '2026-07-29':175000, '2026-07-30':135000, '2026-07-31':175000, '2026-08-01':135000 },
  Muji:  { '2026-07-30':70000 },
  Aris:  { '2026-07-29':175000, '2026-07-30':135000, '2026-07-31':175000, '2026-08-01':135000 },
  Gendut:{ '2026-07-28':175000, '2026-07-29':175000, '2026-07-30':135000, '2026-07-31':175000, '2026-08-01':135000 },
  // Kuli
  Ahmat: { '2026-07-27':155000, '2026-07-28':155000, '2026-07-29':155000, '2026-07-30':120000, '2026-07-31':155000, '2026-08-01':120000 },
  Rudi:  { '2026-07-28':155000, '2026-07-29':155000, '2026-07-31':155000, '2026-08-01':120000 },
  Risky: { '2026-07-27':155000, '2026-07-28':155000, '2026-07-29':155000, '2026-07-30':120000, '2026-07-31':155000, '2026-08-01':120000 },
  Adit:  { '2026-07-27':155000, '2026-07-28':155000, '2026-07-29':155000, '2026-07-30':120000, '2026-07-31':155000, '2026-08-01':120000 },
  Izzut: { '2026-07-27':155000, '2026-07-28':155000, '2026-07-29':155000, '2026-07-30':120000, '2026-07-31':155000, '2026-08-01':120000 },
  Samsul:{ '2026-07-27':155000, '2026-07-28':155000, '2026-07-29':155000, '2026-07-30':120000, '2026-07-31':155000, '2026-08-01':120000 },
  Nanto: { '2026-07-29':155000, '2026-07-30':120000, '2026-07-31':155000, '2026-08-01':120000 },
  Arif:  { '2026-07-29':155000, '2026-07-30':120000, '2026-07-31':155000, '2026-08-01':120000 }
};
// Category mapping per name
const categoryMap = {
  Heri: 'Mandor',
  Sueb:'Tukang', Supar:'Tukang', Jo:'Tukang', Muji:'Tukang', Aris:'Tukang', Gendut:'Tukang',
  Ahmat:'Kuli', Rudi:'Kuli', Risky:'Kuli', Adit:'Kuli', Izzut:'Kuli', Samsul:'Kuli', Nanto:'Kuli', Arif:'Kuli'
};
let added = 0;
for (const [name, days] of Object.entries(schedule)) {
  const cat = categoryMap[name] || 'Upah';
  for (const [date, amt] of Object.entries(days)) {
    addEntry(date, cat, name, amt);
    added++;
  }
}
fs.writeFileSync(path, JSON.stringify(data,null,2));
console.log('Removed', removed, 'old upah entries. Added', added, 'new daily upah entries. New maxId', maxId);
