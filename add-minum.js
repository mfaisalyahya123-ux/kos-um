const d = JSON.parse(require('fs').readFileSync('kos-um/data.json','utf8'));
let lastId = Math.max(...d.transactions.map(t => t.id));

d.transactions.push({
    id: ++lastId,
    date: '2026-06-22',
    category: 'Jajan',
    description: 'Kuku Bima Anggur',
    quantity: 8,
    unit: 'pcs',
    price_per_unit: 8000,
    total: 64000,
    notes: '',
    funding_source: 'Uang Ayah'
});

require('fs').writeFileSync('kos-um/data.json', JSON.stringify(d, null, 2));
console.log('Added ID:', lastId, '| Total: Rp 64.000');
