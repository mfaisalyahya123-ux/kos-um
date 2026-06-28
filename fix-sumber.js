const d = JSON.parse(require('fs').readFileSync('kos-um/data.json','utf8'));

[276, 277, 278, 279].forEach(id => {
    const tx = d.transactions.find(t => t.id === id);
    if (tx) {
        tx.funding_source = 'Kas UM';
        console.log('ID', id, tx.description, '-> Kas UM');
    }
});

require('fs').writeFileSync('kos-um/data.json', JSON.stringify(d, null, 2));
console.log('Done');
