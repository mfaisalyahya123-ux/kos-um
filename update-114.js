const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

// Find and update ID 114
const tx = data.transactions.find(t => t.id === 114);
if (tx) {
  tx.price_per_unit = 130000;
  tx.total = 130000;
  tx.notes = "";
  
  fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
  console.log('✅ ID 114 updated!');
  console.log('   Jasa buang material: Rp 130.000');
  console.log('');
  console.log('💰 Total hari ini updated: Rp 3.539.000');
  console.log('   (Material Rp 2.509.000 + Upah Harian Rp 130.000 + Upah Auto Rp 900.000)');
} else {
  console.log('❌ ID 114 not found');
}
