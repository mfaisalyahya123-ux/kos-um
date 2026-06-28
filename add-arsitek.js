const d = JSON.parse(require('fs').readFileSync('kos-um/data.json','utf8'));
let lastId = Math.max(...d.transactions.map(t => t.id));

d.transactions.push({
    id: ++lastId,
    date: '2026-06-25',
    category: 'Upah',
    subcategory: 'Arsitek',
    description: 'Upah arsitek Lito',
    quantity: 1,
    unit: 'orang',
    price_per_unit: 1000000,
    total: 1000000,
    notes: '1x gaji',
    funding_source: 'Uang Ayah'
});

require('fs').writeFileSync('kos-um/data.json', JSON.stringify(d, null, 2));
console.log('Added ID:', lastId);
