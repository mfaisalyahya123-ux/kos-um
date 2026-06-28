const d = JSON.parse(require('fs').readFileSync('kos-um/data.json','utf8'));
let lastId = Math.max(...d.transactions.map(t => t.id));
const date = '2026-06-22';

d.transactions.push(
    { id: ++lastId, date, category: 'Jajan', description: 'Kopi', quantity: 1, unit: 'kg', price_per_unit: 95000, total: 95000, notes: '', funding_source: 'Uang Ayah' },
    { id: ++lastId, date, category: 'Jajan', description: 'Tepung', quantity: 4, unit: 'kg', price_per_unit: 11250, total: 45000, notes: '', funding_source: 'Uang Ayah' },
    { id: ++lastId, date, category: 'Jajan', description: 'Gula', quantity: 4, unit: 'kg', price_per_unit: 17500, total: 70000, notes: '', funding_source: 'Uang Ayah' }
);

require('fs').writeFileSync('kos-um/data.json', JSON.stringify(d, null, 2));
console.log('Added IDs:', lastId-2, lastId-1, lastId);
console.log('Total jajan 22 Jun:', 95000 + 45000 + 70000);
