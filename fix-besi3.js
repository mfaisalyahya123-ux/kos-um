const d = JSON.parse(require('fs').readFileSync('kos-um/data.json','utf8'));

// Pindahkan besi cor kembali ke Struktur Bangunan, subcategory "Cor Dak"
const besiCor = [217, 218, 219, 220];
besiCor.forEach(id => {
    const tx = d.transactions.find(t => t.id === id);
    if (tx) {
        tx.category = 'Struktur Bangunan';
        tx.subcategory = 'Cor Dak';
        console.log('ID', id, '-> Struktur Bangunan > Cor Dak:', tx.description);
    }
});

require('fs').writeFileSync('kos-um/data.json', JSON.stringify(d, null, 2));
console.log('Done');
