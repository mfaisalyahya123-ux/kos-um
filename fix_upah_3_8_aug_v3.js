const fs = require('fs');
const path = 'data.json';
let data = JSON.parse(fs.readFileSync(path,'utf8'));
if (!Array.isArray(data.transactions)) data.transactions = [];
// Remove any upah entries (Mandor/Tukang/Kuli) in the range 2026-08-03 to 2026-08-08
const start = '2026-08-03', end = '2026-08-08';
const roles = new Set(['Mandor','Tukang','Kuli','Upah']);
let before = data.transactions.length;
data.transactions = data.transactions.filter(t => {
  if (t.date >= start && t.date <= end && roles.has(t.category)) return false;
  return true;
});
let removed = before - data.transactions.length;
let maxId = Math.max(...data.transactions.map(t => t.id));
const add = (date, name, role, amt) => {
  maxId++;
  data.transactions.push({
    id: maxId,
    date,
    category: 'Upah',
    subcategory: role, // role stored as subcategory
    description: name,
    quantity: 1,
    unit: 'orang',
    price_per_unit: amt,
    total: amt,
    notes: '',
    funding_source: 'Uang Ayah'
  });
};
// Schedule per person, values as before
const schedule = {
  Heri: { '2026-08-03':195000, '2026-08-04':195000, '2026-08-05':195000, '2026-08-06':150000, '2026-08-07':195000, '2026-08-08':150000, role:'Mandor' },
  Sueb: { '2026-08-03':175000, '2026-08-04':175000, '2026-08-05':175000, '2026-08-06':135000, '2026-08-07':175000, '2026-08-08':135000, role:'Tukang' },
  Supar:{ '2026-08-03':175000, '2026-08-04':175000, '2026-08-05':175000, '2026-08-06':135000, '2026-08-07':175000, '2026-08-08':135000, role:'Tukang' },
  Jo:   { '2026-08-03':175000, '2026-08-04':175000, '2026-08-05':175000, '2026-08-06':135000, '2026-08-07':175000, '2026-08-08':135000, role:'Tukang' },
  Muji: { '2026-08-03':175000, '2026-08-07':175000, '2026-08-08':135000, role:'Tukang' },
  Gendut:{ '2026-08-06':135000, '2026-08-07':175000, '2026-08-08':135000, role:'Tukang' },
  Ahmat:{ '2026-08-03':155000, '2026-08-04':155000, '2026-08-05':155000, '2026-08-06':120000, '2026-08-08':120000, role:'Kuli' },
  Risky:{ '2026-08-03':155000, '2026-08-04':155000, '2026-08-05':155000, '2026-08-06':120000, '2026-08-07':155000, '2026-08-08':120000, role:'Kuli' },
  Rudi: { '2026-08-03':155000, '2026-08-04':155000, '2026-08-05':155000, '2026-08-06':120000, '2026-08-07':155000, role:'Kuli' }, // Saturday blank
  Adit: { '2026-08-03':155000, '2026-08-04':155000, '2026-08-05':155000, '2026-08-06':120000, '2026-08-07':155000, '2026-08-08':120000, role:'Kuli' },
  Izzut:{ '2026-08-03':155000, '2026-08-04':155000, '2026-08-05':155000, '2026-08-06':120000, '2026-08-07':155000, '2026-08-08':120000, role:'Kuli' },
  Samsul:{'2026-08-03':155000,'2026-08-04':155000,'2026-08-05':155000,'2026-08-06':120000,'2026-08-07':155000,'2026-08-08':120000,role:'Kuli'},
  Nanto:{ '2026-08-03':155000,'2026-08-04':155000,'2026-08-05':155000,'2026-08-06':120000,'2026-08-07':155000,'2026-08-08':120000,role:'Kuli' }
};
let added = 0;
for (const [name, days] of Object.entries(schedule)) {
  const role = days.role;
  for (const [date, amt] of Object.entries(days)) {
    if (date === 'role') continue;
    add(date, name, role, amt);
    added++;
  }
}
fs.writeFileSync(path, JSON.stringify(data,null,2));
console.log('Removed',removed,'old upah entries. Added',added,'new Upah entries. New maxId',maxId);
