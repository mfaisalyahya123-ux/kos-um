const fs = require('fs');
const path = 'data.json';
let data = JSON.parse(fs.readFileSync(path,'utf8'));
if (!Array.isArray(data.transactions)) data.transactions = [];
let maxId = Math.max(...data.transactions.map(t=>t.id));
const upah = [
  {name:'Heri', total:930000},
  {name:'Sueb', total:970000},
  {name:'Supar', total:970000},
  {name:'Jo', total:970000},
  {name:'Muji', total:70000},
  {name:'Aris', total:620000},
  {name:'Gendut', total:795000},
  {name:'Ahmat', total:860000},
  {name:'Rudi', total:585000},
  {name:'Risky', total:860000},
  {name:'Adit', total:860000},
  {name:'Izzut', total:860000},
  {name:'Samsul', total:860000},
  {name:'Nanto', total:550000},
  {name:'Arif', total:550000}
];
upah.forEach(u => {
  maxId++;
  data.transactions.push({
    id: maxId,
    date: '2026-08-01',
    category: 'Upah',
    subcategory: '',
    description: u.name,
    quantity: 1,
    unit: 'orang',
    price_per_unit: u.total,
    total: u.total,
    notes: '',
    funding_source: 'Uang Ayah'
  });
});
fs.writeFileSync(path, JSON.stringify(data,null,2));
console.log('Added', upah.length, 'upah transactions for 2026-08-01. New maxId', maxId);
