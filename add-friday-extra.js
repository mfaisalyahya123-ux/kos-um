const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json','utf8'));
const date = '2026-06-05';
const newTx = [
  {id:136,date,category:'Material',description:'Paku pring Dhuhri',quantity:5,unit:'kg',price_per_unit:18000,total:90000,notes:'',funding_source:'Uang Ayah'},
  {id:137,date,category:'Material',description:'Paku cor Dhuhri',quantity:2,unit:'dus',price_per_unit:20000,total:40000,notes:'',funding_source:'Uang Ayah'}
];
data.transactions.push(...newTx);
fs.writeFileSync('data.json', JSON.stringify(data,null,2));
console.log('✅ Added Friday transactions');
console.log('   ID 136: Paku pring Dhuhri 5kg Rp 90.000');
console.log('   ID 137: Paku cor Dhuhri 2dus Rp 40.000');
