const d = JSON.parse(require('fs').readFileSync('kos-um/data.json','utf8'));
let lastId = Math.max(...d.transactions.map(t => t.id));
const date = '2026-06-22';

d.transactions.push(
    { id: ++lastId, date, category: 'Alat', description: 'Spidol', quantity: 2, unit: 'biji', price_per_unit: 2000, total: 4000, notes: '', funding_source: 'Kas UM' },
    { id: ++lastId, date, category: 'Alat', description: 'Gergaji besi', quantity: 1, unit: 'pcs', price_per_unit: 25000, total: 25000, notes: '', funding_source: 'Kas UM' },
    { id: ++lastId, date, category: 'Alat', description: 'Benang tampar', quantity: 2, unit: 'biji', price_per_unit: 4000, total: 8000, notes: '', funding_source: 'Kas UM' }
);

require('fs').writeFileSync('kos-um/data.json', JSON.stringify(d, null, 2));
console.log('Added IDs:', lastId-2, lastId-1, lastId);
console.log('Total alat 22 Jun:', 4000 + 25000 + 8000);
