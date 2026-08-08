const fs = require('fs');
const path = 'data.json';
let data = JSON.parse(fs.readFileSync(path,'utf8'));
if (!Array.isArray(data.transactions)) data.transactions = [];
let maxId = Math.max(...data.transactions.map(t=>t.id));
const entries = [
  {name:'Heri', cat:'Upah', total:930000},
  {name:'Sueb', cat:'Upah', total:970000},
  {name:'Supar', cat:'Upah', total:970000},
  {name:'Jo', cat:'Upah', total:970000},
  {name:'Muji', cat:'Upah', total:70000},
  {name:'Aris', cat:'Upah', total:620000},
  {name:'Gendut', cat:'Upah', total:795000},
  {name:'Ahmat', cat:'Upah', total:860000},
  {name:'Rudi', cat:'Upah', total:585000},
  {name:'Risky', cat:'Upah', total:860000},
  {name:'Adit', cat:'Upah', total:860000},
  {name:'Izzut', cat:'Upah', total:860000},
  {name:'Samsul', cat:'Upah', total:860000},
  {name:'Nanto', cat:'Upah', total:550000},
  {name:'Arif', cat:'Upah', total:550000}
];
entries.forEach(e=>{
  maxId++;
  data.transactions.push({
    id: maxId,
    date: '2026-07-27',
    category: e.cat,
    subcategory: '',
    description: e.name,
    quantity: 1,
    unit: 'orang',
    price_per_unit: e.total,
    total: e.total,
    notes: '',
    funding_source: 'Uang Ayah'
  });
});
fs.writeFileSync(path, JSON.stringify(data,null,2));
console.log('Added', entries.length, 'upah transactions. New maxId', maxId);
