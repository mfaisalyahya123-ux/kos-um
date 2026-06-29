const d = JSON.parse(require('fs').readFileSync('kos-um/data.json','utf8'));
const tx = d.transactions.find(t => t.id === 292);
if (tx) {
    tx.quantity = 1;
    tx.unit = 'dus';
    tx.funding_source = 'Kas UM';
    console.log('Updated ID 292:', tx.description, '|', tx.quantity, tx.unit, '|', tx.funding_source);
}
require('fs').writeFileSync('kos-um/data.json', JSON.stringify(d, null, 2));
