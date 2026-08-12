const fs = require('fs');
const path = __dirname + '/data.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

// backup
fs.copyFileSync(path, __dirname + '/data.backup-before-fix.json');

const ids = data.transactions.map(t => t.id);
const has = id => ids.includes(id);

const log = [];

// 1 & 2: hapus duplikat yang salah kategori (375 Material, 376 Material)
// simpan yang Struktur Bangunan (377, 378) -> sesuai instruksi "ganti jadi struktur bangunan"
const removeIds = [375, 376];
const before = data.transactions.length;
data.transactions = data.transactions.filter(t => !removeIds.includes(t.id));
log.push(`Hapus duplikat Material: ${removeIds.filter(has).join(', ')} (sisa ${data.transactions.length} dari ${before})`);

// 3: id 534 funding_source = Uang Ayah
const b534 = data.transactions.find(t => t.id === 534);
if (b534) {
  b534.funding_source = 'Uang Ayah';
  log.push(`id 534 funding_source -> Uang Ayah`);
}

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log(log.join('\n'));
console.log('OK');
