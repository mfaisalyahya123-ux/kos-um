const d = JSON.parse(require('fs').readFileSync('kos-um/data.json','utf8'));
let lastId = Math.max(...d.transactions.map(t => t.id));

d.transactions.push({
    id: ++lastId,
    date: '2026-06-22',
    category: 'Jajan',
    description: 'Aqua Galon (1 minggu)',
    quantity: 1,
    unit: 'galon',
    price_per_unit: 30000,
    total: 30000,
    notes: '',
    funding_source: 'Kas UM'
});

require('fs').writeFileSync('kos-um/data.json', JSON.stringify(d, null, 2));
console.log('Added ID:', lastId);
