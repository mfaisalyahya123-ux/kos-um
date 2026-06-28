const d = JSON.parse(require('fs').readFileSync('kos-um/data.json','utf8'));
let lastId = Math.max(...d.transactions.map(t => t.id));
const date = '2026-06-22';

d.transactions.push(
    { id: ++lastId, date, category: 'Jajan', description: 'Fermipan', quantity: 1, unit: 'pcs', price_per_unit: 8000, total: 8000, notes: '', funding_source: 'Kas UM' },
    { id: ++lastId, date, category: 'Jajan', description: 'Mentega Blue Band', quantity: 6, unit: 'pcs', price_per_unit: 6000, total: 36000, notes: '', funding_source: 'Kas UM' }
);

require('fs').writeFileSync('kos-um/data.json', JSON.stringify(d, null, 2));
console.log('Added IDs:', lastId-1, lastId);
console.log('Total:', 8000 + 36000);
