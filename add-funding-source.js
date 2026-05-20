// Script untuk menambahkan funding_source ke semua transaksi
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Aturan sumber dana
function getFundingSource(tx) {
    // Upah → Uang Ayah
    if (tx.category === 'Upah') {
        return 'Uang Ayah';
    }
    
    // Struktur Bangunan → Uang Ayah
    if (tx.category === 'Struktur Bangunan') {
        return 'Uang Ayah';
    }
    
    // Material → cek deskripsi
    if (tx.category === 'Material') {
        const desc = tx.description.toLowerCase();
        // Besi, semen, pasir, triplek, terpal → Uang Ayah
        if (desc.includes('beton') || desc.includes('semen') || desc.includes('pasir') || 
            desc.includes('triplek') || desc.includes('terpal')) {
            return 'Uang Ayah';
        }
        // Paku, bendrat, resibon, benang, tali → Kas UM
        return 'Kas UM';
    }
    
    // Alat → Kas UM
    if (tx.category === 'Alat') {
        return 'Kas UM';
    }
    
    // Jajan/Lain-lain → Kas UM
    if (tx.category === 'Jajan' || tx.category === 'Lain-lain') {
        return 'Kas UM';
    }
    
    return 'Kas UM'; // default
}

// Add funding_source to all transactions
data.transactions.forEach(tx => {
    if (!tx.funding_source) {
        tx.funding_source = getFundingSource(tx);
    }
});

// Write back
fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
console.log('✅ Funding source added to all transactions!');
