const fs = require('fs');
const path = 'data.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));
const tx = data.transactions;

function find(id){ return tx.find(t=>t.id===id); }

// 1. id 870 (27 Jul): hapus Rudi dari agregat kuli
let t870 = find(870);
t870.description = 'Ahmat, Risky, Adit, Izzut, Samsul';
t870.quantity = 5;
t870.total = 5 * 155000;
console.log('870 ->', t870.description, t870.quantity, t870.total);

// 2. id 877 (30 Jul): Heri tidak masuk -> hapus
const before = tx.length;
data.transactions = tx.filter(t=>t.id!==877);
console.log('877 deleted:', tx.length < before);

// 3. id 880 (30 Jul): hapus Rudi dari agregat kuli
let t880 = find(880);
t880.description = 'Ahmat, Risky, Adit, Izzut, Samsul, Nanto, Arif';
t880.quantity = 7;
t880.total = 7 * 120000;
console.log('880 ->', t880.description, t880.quantity, t880.total);

// 4. id 881 (30 Jul): Arif dobel 155rb -> hapus (sudah di 880 dgn 120rb)
const before2 = data.transactions.length;
data.transactions = data.transactions.filter(t=>t.id!==881);
console.log('881 deleted:', data.transactions.length < before2);

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('SAVED.');
