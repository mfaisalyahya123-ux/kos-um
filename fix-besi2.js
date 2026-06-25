const d = JSON.parse(require('fs').readFileSync('kos-um/data.json','utf8'));

// Kembalikan besi cor ke Material, subcategory "Dak"
const besiCor = [217, 218, 219, 220];
besiCor.forEach(id => {
    const tx = d.transactions.find(t => t.id === id);
    if (tx) {
        tx.category = 'Material';
        tx.subcategory = 'Dak';
        console.log('ID', id, '-> Material > Dak:', tx.description);
    }
});

require('fs').writeFileSync('kos-um/data.json', JSON.stringify(d, null, 2));
console.log('Done');
