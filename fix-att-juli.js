const fs = require('fs');
const path = 'data.json';
const data = JSON.parse(fs.readFileSync(path, 'utf8'));

const heri = data.workers.mandor.find(w => w.name === 'Heri');
const rudi = data.workers.kuli.find(w => w.name === 'Rudi');

// 30 Jul: Heri tidak masuk
if (heri.attendance['2026-07-30'] !== 'tidak') {
  heri.attendance['2026-07-30'] = 'tidak';
  console.log('Heri 30 Jul -> tidak');
} else {
  console.log('Heri 30 Jul already tidak');
}

// 27 Jul: Rudi tidak masuk
if (rudi.attendance['2026-07-27'] !== 'tidak') {
  rudi.attendance['2026-07-27'] = 'tidak';
  console.log('Rudi 27 Jul -> tidak');
} else {
  console.log('Rudi 27 Jul already tidak');
}

// 30 Jul: Rudi tidak masuk
if (rudi.attendance['2026-07-30'] !== 'tidak') {
  rudi.attendance['2026-07-30'] = 'tidak';
  console.log('Rudi 30 Jul -> tidak');
} else {
  console.log('Rudi 30 Jul already tidak');
}

fs.writeFileSync(path, JSON.stringify(data, null, 2));
console.log('SAVED.');
