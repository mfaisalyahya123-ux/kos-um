const fs = require('fs');
const path = 'data.json';
let data = JSON.parse(fs.readFileSync(path,'utf8'));
if (!Array.isArray(data.transactions)) data.transactions = [];
// Remove all upah entries for the period 27 Jul – 1 Aug 2026
const start = '2026-07-27';
const end = '2026-08-01';
const isInRange = d => d >= start && d <= end;
let before = data.transactions.length;
data.transactions = data.transactions.filter(t => {
  // keep if not Upah/Mandor/Tukang/Kuli in the period
  if (isInRange(t.date) && (t.category === 'Upah' || t.category === 'Mandor' || t.category === 'Tukang' || t.category === 'Kuli')) {
    return false; // drop
  }
  return true;
});
let removed = before - data.transactions.length;
// Define correct schedule per person per date (amounts)
const schedule = {
  Heri: {'2026-07-27':195000,'2026-07-28':195000,'2026-07-29':195000,'2026-07-31':195000,'2026-08-01':150000},
  Sueb: {'2026-07-27':175000,'2026-07-28':175000,'2026-07-29':175000,'2026-07-30':135000,'2026-07-31':175000,'2026-08-01':135000},
  Supar:{'2026-07-27':175000,'2026-07-28':175000,'2026-07-29':175000,'2026-07-30':135000,'2026-07-31':175000,'2026-08-01':135000},
  Jo:   {'2026-07-27':175000,'2026-07-28':175000,'2026-07-29':175000,'2026-07-30':135000,'2026-07-31':175000,'2026-08-01':135000},
  Muji: {'2026-07-30':70000},
  Aris: {'2026-07-29':175000,'2026-07-30':135000,'2026-07-31':175000,'2026-08-01':135000},
  Gendut:{'2026-07-28':175000,'2026-07-29':175000,'2026-07-30':135000,'2026-07-31':175000,'2026-08-01':135000},
  Ahmat:{'2026-07-27':155000,'2026-07-28':155000,'2026-07-29':155000,'2026-07-30':120000,'2026-07-31':155000,'2026-08-01':120000},
  Rudi: {'2026-07-28':155000,'2026-07-29':155000,'2026-07-31':155000,'2026-08-01':120000},
  Risky:{'2026-07-27':155000,'2026-07-28':155000,'2026-07-29':155000,'2026-07-30':120000,'2026-07-31':155000,'2026-08-01':120000},
  Adit: {'2026-07-27':155000,'2026-07-28':155000,'2026-07-29':155000,'2026-07-30':120000,'2026-07-31':155000,'2026-08-01':120000},
  Izzut:{'2026-07-27':155000,'2026-07-28':155000,'2026-07-29':155000,'2026-07-30':120000,'2026-07-31':155000,'2026-08-01':120000},
  Samsul:{'2026-07-27':155000,'2026-07-28':155000,'2026-07-29':155000,'2026-07-30':120000,'2026-07-31':155000,'2026-08-01':120000},
  Nanto:{'2026-07-29':155000,'2026-07-30':120000,'2026-07-31':155000,'2026-08-01':120000},
  Arif: {'2026-07-29':155000,'2026-07-30':120000,'2026-07-31':155000,'2026-08-01':120000}
};
// Category mapping
const catMap = {Heri:'Mandor',Sueb:'Tukang',Supar:'Tukang',Jo:'Tukang',Muji:'Tukang',Aris:'Tukang',Gendut:'Tukang',Ahmat:'Kuli',Rudi:'Kuli',Risky:'Kuli',Adit:'Kuli',Izzut:'Kuli',Samsul:'Kuli',Nanto:'Kuli',Arif:'Kuli'};
let maxId = Math.max(...data.transactions.map(t=>t.id));
let added = 0;
for (const [name, days] of Object.entries(schedule)) {
  const cat = catMap[name] || 'Upah';
  for (const [date, amt] of Object.entries(days)) {
    maxId++;
    data.transactions.push({
      id:maxId,
      date,
      category:cat,
      subcategory:'',
      description:name,
      quantity:1,
      unit:'orang',
      price_per_unit:amt,
      total:amt,
      notes:'',
      funding_source:'Uang Ayah'
    });
    added++;
  }
}
fs.writeFileSync(path, JSON.stringify(data,null,2));
console.log('Removed',removed,'old upah entries. Added',added,'correct entries. New maxId',maxId);
