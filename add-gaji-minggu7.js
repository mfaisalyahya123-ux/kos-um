const fs = require('fs');
const d = JSON.parse(fs.readFileSync('kos-um/data.json','utf8'));

// Wage data per person per day (29 Jun - 4 Jul)
const wageData = [
  // Heri (Mandor)
  {date:'2026-06-29',name:'Heri',role:'Mandor',amount:195000},
  {date:'2026-06-30',name:'Heri',role:'Mandor',amount:195000},
  {date:'2026-07-01',name:'Heri',role:'Mandor',amount:195000},
  {date:'2026-07-02',name:'Heri',role:'Mandor',amount:150000},
  {date:'2026-07-03',name:'Heri',role:'Mandor',amount:195000},
  {date:'2026-07-04',name:'Heri',role:'Mandor',amount:150000},
  
  // Supar (Tukang)
  {date:'2026-06-29',name:'Supar',role:'Tukang',amount:175000},
  {date:'2026-06-30',name:'Supar',role:'Tukang',amount:175000},
  {date:'2026-07-01',name:'Supar',role:'Tukang',amount:175000},
  {date:'2026-07-02',name:'Supar',role:'Tukang',amount:135000},
  {date:'2026-07-03',name:'Supar',role:'Tukang',amount:175000},
  {date:'2026-07-04',name:'Supar',role:'Tukang',amount:135000},
  
  // Sueb (Tukang)
  {date:'2026-06-29',name:'Sueb',role:'Tukang',amount:175000},
  {date:'2026-06-30',name:'Sueb',role:'Tukang',amount:175000},
  {date:'2026-07-01',name:'Sueb',role:'Tukang',amount:175000},
  {date:'2026-07-02',name:'Sueb',role:'Tukang',amount:135000},
  {date:'2026-07-03',name:'Sueb',role:'Tukang',amount:175000},
  {date:'2026-07-04',name:'Sueb',role:'Tukang',amount:135000},
  
  // Muji (Tukang) - absen Senin
  {date:'2026-06-30',name:'Muji',role:'Tukang',amount:175000},
  {date:'2026-07-01',name:'Muji',role:'Tukang',amount:175000},
  {date:'2026-07-02',name:'Muji',role:'Tukang',amount:135000},
  {date:'2026-07-03',name:'Muji',role:'Tukang',amount:175000},
  {date:'2026-07-04',name:'Muji',role:'Tukang',amount:135000},
  
  // Jo (Tukang) - absen Selasa
  {date:'2026-06-29',name:'Jo',role:'Tukang',amount:175000},
  {date:'2026-07-01',name:'Jo',role:'Tukang',amount:175000},
  {date:'2026-07-02',name:'Jo',role:'Tukang',amount:135000},
  {date:'2026-07-03',name:'Jo',role:'Tukang',amount:175000},
  {date:'2026-07-04',name:'Jo',role:'Tukang',amount:135000},
  
  // Rudi (Kuli)
  {date:'2026-06-29',name:'Rudi',role:'Kuli',amount:155000},
  {date:'2026-06-30',name:'Rudi',role:'Kuli',amount:155000},
  {date:'2026-07-01',name:'Rudi',role:'Kuli',amount:155000},
  {date:'2026-07-02',name:'Rudi',role:'Kuli',amount:120000},
  {date:'2026-07-03',name:'Rudi',role:'Kuli',amount:155000},
  {date:'2026-07-04',name:'Rudi',role:'Kuli',amount:120000},
  
  // Riski (Kuli)
  {date:'2026-06-29',name:'Riski',role:'Kuli',amount:155000},
  {date:'2026-06-30',name:'Riski',role:'Kuli',amount:155000},
  {date:'2026-07-01',name:'Riski',role:'Kuli',amount:155000},
  {date:'2026-07-02',name:'Riski',role:'Kuli',amount:120000},
  {date:'2026-07-03',name:'Riski',role:'Kuli',amount:155000},
  {date:'2026-07-04',name:'Riski',role:'Kuli',amount:120000},
  
  // Adit (Kuli)
  {date:'2026-06-29',name:'Adit',role:'Kuli',amount:155000},
  {date:'2026-06-30',name:'Adit',role:'Kuli',amount:155000},
  {date:'2026-07-01',name:'Adit',role:'Kuli',amount:155000},
  {date:'2026-07-02',name:'Adit',role:'Kuli',amount:120000},
  {date:'2026-07-03',name:'Adit',role:'Kuli',amount:155000},
  {date:'2026-07-04',name:'Adit',role:'Kuli',amount:120000},
  
  // Ahmad (Kuli) - absen Senin & Selasa
  {date:'2026-07-01',name:'Ahmad',role:'Kuli',amount:155000},
  {date:'2026-07-02',name:'Ahmad',role:'Kuli',amount:120000},
  {date:'2026-07-03',name:'Ahmad',role:'Kuli',amount:155000},
  {date:'2026-07-04',name:'Ahmad',role:'Kuli',amount:120000}
];

let lastId = Math.max(...d.transactions.map(t => t.id));

wageData.forEach(w => {
  d.transactions.push({
    id: ++lastId,
    date: w.date,
    category: 'Upah',
    subcategory: w.role,
    description: `Upah ${w.role.toLowerCase()} ${w.name}`,
    quantity: 1,
    unit: 'orang',
    price_per_unit: w.amount,
    total: w.amount,
    notes: '',
    funding_source: 'Uang Ayah'
  });
});

fs.writeFileSync('kos-um/data.json', JSON.stringify(d, null, 2));

const total = wageData.reduce((sum, w) => sum + w.amount, 0);
console.log('Added', wageData.length, 'upah transactions');
console.log('Total upah:', total.toLocaleString('id-ID'));
console.log('Last ID:', lastId);
