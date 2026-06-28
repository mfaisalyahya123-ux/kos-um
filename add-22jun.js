const d = JSON.parse(require('fs').readFileSync('kos-um/data.json','utf8'));
let lastId = Math.max(...d.transactions.map(t => t.id));
const date = '2026-06-22';

d.transactions.push(
    { id: ++lastId, date, category: 'Material', description: 'Lakban listrik', quantity: 4, unit: 'biji', price_per_unit: 27860, total: 111440, notes: '', funding_source: 'Kas UM' },
    { id: ++lastId, date, category: 'Material', description: 'Kabel listrik 1.5mm 50m', quantity: 2, unit: 'biji', price_per_unit: 222500, total: 445000, notes: '', funding_source: 'Kas UM' }
);

require('fs').writeFileSync('kos-um/data.json', JSON.stringify(d, null, 2));
console.log('Added IDs:', lastId-1, lastId);
console.log('Total:', 111440 + 445000);
