const d = JSON.parse(require('fs').readFileSync('kos-um/data.json','utf8'));
let lastId = Math.max(...d.transactions.map(t => t.id));

d.transactions.push({
    id: ++lastId,
    date: '2026-06-06',
    category: 'Lain-lain',
    subcategory: null,
    description: 'Jasa membuat tempat sampah',
    quantity: 1,
    unit: 'unit',
    price_per_unit: 150000,
    total: 150000,
    notes: '',
    funding_source: 'Uang Ayah'
});

require('fs').writeFileSync('kos-um/data.json', JSON.stringify(d, null, 2));
console.log('Added ID:', lastId, '| Rp 150.000');
