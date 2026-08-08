const fs = require('fs');
const dataPath = 'data.json';
let data = JSON.parse(fs.readFileSync(dataPath,'utf8'));
// Ensure payroll array exists
if (!Array.isArray(data.payroll)) data.payroll = [];
// Payroll entry for 27 Jul – 1 Aug 2026
const entry = {
  date_range: '2026-07-27/2026-08-01',
  entries: [
    {name:'Heri',   category:'Mandor', total:930000},
    {name:'Sueb',   category:'Tukang', total:970000},
    {name:'Supar',  category:'Tukang', total:970000},
    {name:'Jo',     category:'Tukang', total:970000},
    {name:'Muji',   category:'Tukang', total:70000},
    {name:'Aris',   category:'Tukang', total:620000},
    {name:'Gendut', category:'Tukang', total:795000},
    {name:'Ahmat',  category:'Kuli',   total:860000},
    {name:'Rudi',   category:'Kuli',   total:585000},
    {name:'Risky',  category:'Kuli',   total:860000},
    {name:'Adit',   category:'Kuli',   total:860000},
    {name:'Izzut',  category:'Kuli',   total:860000},
    {name:'Samsul', category:'Kuli',   total:860000},
    {name:'Nanto',  category:'Kuli',   total:550000},
    {name:'Arif',   category:'Kuli',   total:550000}
  ],
  grand_total: 11310000
};
// Append entry
data.payroll.push(entry);
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('Payroll added, new payroll count:', data.payroll.length);
