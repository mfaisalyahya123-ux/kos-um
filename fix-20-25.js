const fs = require('fs');
const path = 'data.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// 1. Hapus id 569 (Ahmad 22 Jul - harusnya tidak masuk)
const before = data.transactions.length;
data.transactions = data.transactions.filter(t => t.id !== 569);
console.log('569 deleted:', data.transactions.length < before);

// 2. Tambah Ahmad 24 Jul 120rb (id baru)
const newId = Math.max(...data.transactions.map(t => t.id)) + 1;
data.transactions.push({
  id: newId,
  date: '2026-07-24',
  category: 'Upah',
  subcategory: 'Kuli',
  description: 'Ahmad',
  quantity: 1,
  unit: 'orang',
  price_per_unit: 120000,
  total: 120000,
  notes: '',
  funding_source: 'Uang Ayah'
});
console.log('added id', newId, 'Ahmad 24 Jul');

// 3. Sync attendance Ahmad
const ahmad = data.workers.kuli.find(w => w.name === 'Ahmad');
ahmad.attendance['2026-07-22'] = 'tidak';
ahmad.attendance['2026-07-24'] = 'hadir';
console.log('Ahmad att 22->tidak, 24->hadir');

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('SAVED.');
