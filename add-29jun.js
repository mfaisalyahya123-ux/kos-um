const d = JSON.parse(require('fs').readFileSync('kos-um/data.json','utf8'));
let lastId = Math.max(...d.transactions.map(t => t.id));

d.transactions.push({
    id: ++lastId,
    date: '2026-06-29',
    category: 'Material',
    description: 'Paku cor 3"',
    quantity: 1,
    unit: 'kg',
    price_per_unit: 18000,
    total: 18000,
    notes: '',
    funding_source: 'Uang Ayah'
});

require('fs').writeFileSync('kos-um/data.json', JSON.stringify(d, null, 2));
console.log('Added ID:', lastId, '| Rp 18.000');
