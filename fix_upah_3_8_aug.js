const fs = require('fs');
const path = 'data.json';
let data = JSON.parse(fs.readFileSync(path,'utf8'));
if (!Array.isArray(data.transactions)) data.transactions = [];
// Remove any upah entries in the range 2026-08-03 to 2026-08-08 (inclusive)
const start = '2026-08-03';
const end = '2026-08-08';
const isInRange = d => d >= start && d <= end;
let before = data.transactions.length;
// keep entries that are NOT upah in the range
const upahCategories = new Set(['Upah','Mandor','Tukang','Kuli']);
data.transactions = data.transactions.filter(t => {
  if (isInRange(t.date) && upahCategories.has(t.category)) {
    return false; // remove
  }
  return true;
});
let removed = before - data.transactions.length;
let maxId = Math.max(...data.transactions.map(t => t.id));
const addEntry = (date, cat, name, amt) => {
  maxId++;
  data.transactions.push({
    id: maxId,
    date,
    category: cat,
    subcategory: '',
    description: name,
    quantity: 1,
    unit: 'orang',
    price_per_unit: amt,
    total: amt,
    notes: '',
    funding_source: 'Uang Ayah'
  });
};
// Schedule per person (date => amount). Category per person
const schedule = {
  // Mandor
  Heri: { '2026-08-03':'Mandor', '2026-08-04':'Mandor', '2026-08-05':'Mandor', '2026-08-06':'Mandor', '2026-08-07':'Mandor', '2026-08-08':'Mandor' },
  // Tukang
  Sueb: { '2026-08-03':'Tukang', '2026-08-04':'Tukang', '2026-08-05':'Tukang', '2026-08-06':'Tukang', '2026-08-07':'Tukang', '2026-08-08':'Tukang' },
  Supar: { '2026-08-03':'Tukang', '2026-08-04':'Tukang', '2026-08-05':'Tukang', '2026-08-06':'Tukang', '2026-08-07':'Tukang', '2026-08-08':'Tukang' },
  Jo:    { '2026-08-03':'Tukang', '2026-08-04':'Tukang', '2026-08-05':'Tukang', '2026-08-06':'Tukang', '2026-08-07':'Tukang', '2026-08-08':'Tukang' },
  Muji:  { '2026-08-03':'Tukang', '2026-08-07':'Tukang', '2026-08-08':'Tukang' }, // no Tue/Wed/Thu
  // Kuli
  Ahmat: { '2026-08-03':'Kuli', '2026-08-04':'Kuli', '2026-08-05':'Kuli', '2026-08-06':'Kuli', '2026-08-08':'Kuli' }, // Friday blank
  Risky:{ '2026-08-03':'Kuli', '2026-08-04':'Kuli', '2026-08-05':'Kuli', '2026-08-06':'Kuli', '2026-08-07':'Kuli', '2026-08-08':'Kuli' },
  Rudi: { '2026-08-03':'Kuli', '2026-08-04':'Kuli', '2026-08-05':'Kuli', '2026-08-06':'Kuli', '2026-08-07':'Kuli' }, // Saturday blank
  Adit: { '2026-08-03':'Kuli', '2026-08-04':'Kuli', '2026-08-05':'Kuli', '2026-08-06':'Kuli', '2026-08-07':'Kuli', '2026-08-08':'Kuli' },
  Izzut:{ '2026-08-03':'Kuli', '2026-08-04':'Kuli', '2026-08-05':'Kuli', '2026-08-06':'Kuli', '2026-08-07':'Kuli', '2026-08-08':'Kuli' },
  Samsul:{'2026-08-03':'Kuli','2026-08-04':'Kuli','2026-08-05':'Kuli','2026-08-06':'Kuli','2026-08-07':'Kuli','2026-08-08':'Kuli'},
  Nanto:{ '2026-08-03':'Kuli','2026-08-04':'Kuli','2026-08-05':'Kuli','2026-08-06':'Kuli','2026-08-07':'Kuli','2026-08-08':'Kuli' }
};
// amount per category
const amounts = {
  Mandor: 195000,
  Tukang: 175000,
  Kuli: 155000,
  // special cases per day for Muji, Gendut, etc.
};
// Adjust special amounts per date per person
const special = {
  // Muji: Tue-Wed-Thu blank, Friday 175k, Sat 135k (but Friday is 2026-08-07, Sat 2026-08-08)
  Muji: { '2026-08-07':135000, '2026-08-08':135000 },
  // Gendut only works Thu-Fri-Sat with amounts 135k,175k,135k respectively
  Gendut: { '2026-08-06':135000, '2026-08-07':175000, '2026-08-08':135000 }
};
let added = 0;
for (const [name, days] of Object.entries(schedule)) {
  const baseCat = Object.values(days)[0]; // category same for all dates for that person
  for (const [date, cat] of Object.entries(days)) {
    let amt = amounts[cat];
    // override special if defined
    if (special[name] && special[name][date] !== undefined) {
      amt = special[name][date];
    }
    addEntry(date, cat, name, amt);
    added++;
  }
}
// Add Gendut entries (special only)
if (special.Gendut) {
  for (const [date, amt] of Object.entries(special.Gendut)) {
    addEntry(date, 'Tukang', 'Gendut', amt);
    added++;
  }
}
fs.writeFileSync(path, JSON.stringify(data,null,2));
console.log('Removed', removed, 'old upah entries in range. Added', added, 'new correct entries. New maxId', maxId);
