const fs = require('fs');
const path = 'data.json';
let data = JSON.parse(fs.readFileSync(path,'utf8'));
if (!Array.isArray(data.transactions)) data.transactions = [];
// Remove any Upah entries in the range 27 Jul - 1 Aug (just in case)
const start = '2026-07-27', end = '2026-08-01';
const before = data.transactions.length;
data.transactions = data.transactions.filter(t => !(t.category==='Upah' && t.date>=start && t.date<=end));
let removed = before - data.transactions.length;
let maxId = Math.max(...data.transactions.map(t => t.id));
const add = (date, name, role, amt) => {
  maxId++;
  data.transactions.push({
    id: maxId,
    date,
    category: 'Upah',
    subcategory: role,
    description: name,
    quantity: 1,
    unit: 'orang',
    price_per_unit: amt,
    total: amt,
    notes: '',
    funding_source: 'Uang Ayah'
  });
};
// Schedule per person (same as attendance, amounts per day)
const schedule = {
  Heri: { role:'Mandor', dates:{'2026-07-27':195000,'2026-07-28':195000,'2026-07-29':195000,'2026-07-30':150000,'2026-07-31':195000,'2026-08-01':150000} },
  Sueb: { role:'Tukang', dates:{'2026-07-27':175000,'2026-07-28':175000,'2026-07-29':175000,'2026-07-30':135000,'2026-07-31':175000,'2026-08-01':135000} },
  Supar:{ role:'Tukang', dates:{'2026-07-27':175000,'2026-07-28':175000,'2026-07-29':175000,'2026-07-30':135000,'2026-07-31':175000,'2026-08-01':135000} },
  Jo:   { role:'Tukang', dates:{'2026-07-27':175000,'2026-07-28':175000,'2026-07-29':175000,'2026-07-30':135000,'2026-07-31':175000,'2026-08-01':135000} },
  Muji: { role:'Tukang', dates:{'2026-07-30':175000} }, // only Thursday (70000 actually, but rate is 175k, will be overridden
  Aris: { role:'Tukang', dates:{'2026-07-29':175000,'2026-07-30':135000,'2026-07-31':175000,'2026-08-01':135000} },
  Gendut:{ role:'Tukang', dates:{'2026-07-28':175000,'2026-07-29':175000,'2026-07-30':135000,'2026-07-31':175000,'2026-08-01':135000} },
  Ahmat:{ role:'Kuli',   dates:{'2026-07-27':155000,'2026-07-28':155000,'2026-07-29':155000,'2026-07-30':120000,'2026-07-31':155000,'2026-08-01':120000} },
  Risky:{ role:'Kuli',   dates:{'2026-07-27':155000,'2026-07-28':155000,'2026-07-29':155000,'2026-07-30':120000,'2026-07-31':155000,'2026-08-01':120000} },
  Rudi: { role:'Kuli',   dates:{'2026-07-27':155000,'2026-07-28':155000,'2026-07-29':155000,'2026-07-30':120000,'2026-07-31':155000} }, // Sat off
  Adit: { role:'Kuli',   dates:{'2026-07-27':155000,'2026-07-28':155000,'2026-07-29':155000,'2026-07-30':120000,'2026-07-31':155000,'2026-08-01':120000} },
  Izzut:{ role:'Kuli',   dates:{'2026-07-27':155000,'2026-07-28':155000,'2026-07-29':155000,'2026-07-30':120000,'2026-07-31':155000,'2026-08-01':120000} },
  Samsul:{role:'Kuli',   dates:{'2026-07-27':155000,'2026-07-28':155000,'2026-07-29':155000,'2026-07-30':120000,'2026-07-31':155000,'2026-08-01':120000} },
  Nanto:{ role:'Kuli',   dates:{'2026-07-29':155000,'2026-07-30':120000,'2026-07-31':155000,'2026-08-01':120000} },
  Arif: { role:'Kuli',   dates:{'2026-07-30':155000,'2026-07-31':155000,'2026-08-01':120000} }
};
let added=0;
for(const [name,obj] of Object.entries(schedule)){
  const role=obj.role;
  for(const [date,amt] of Object.entries(obj.dates)){
    // Muji special case: actual amount 70k (instead of 175k)
    const finalAmt = (name==='Muji' && amt===175000) ? 70000 : amt;
    add(date,name,role,finalAmt);
    added++;
  }
}
fs.writeFileSync(path, JSON.stringify(data,null,2));
console.log('Removed',removed,'old Upah entries. Added',added,'new Upah entries. New maxId',maxId);
