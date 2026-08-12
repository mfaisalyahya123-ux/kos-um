const fs = require('fs');
const path = __dirname + '/data.json';
const backup = JSON.parse(fs.readFileSync(__dirname + '/data.backup-before-fix.json', 'utf8'));

// keep a pre-restore backup just in case
fs.copyFileSync(path, __dirname + '/data.pre-restore.json');

const data = backup; // restore
const log = [];

const c375 = data.transactions.find(t => t.id === 375);
c375.category = 'Struktur Bangunan';
c375.subcategory = 'Cor Dak';
log.push('id 375 Koral 2 truk -> Struktur Bangunan / Cor Dak');

const c376 = data.transactions.find(t => t.id === 376);
c376.category = 'Struktur Bangunan';
c376.subcategory = 'Cor Dak';
log.push('id 376 Pasir Lumajang 2 truk -> Struktur Bangunan / Cor Dak');

const c534 = data.transactions.find(t => t.id === 534);
c534.funding_source = 'Uang Ayah';
log.push('id 534 Bata ringan funding_source -> Uang Ayah');

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log(log.join('\n'));
console.log('Total entries now:', data.transactions.length);
