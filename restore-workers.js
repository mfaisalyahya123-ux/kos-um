const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

// Kembalikan worker yang dipindah ke former_workers
// Tohir
if (data.former_workers && data.former_workers.tukang.length > 0) {
  const tohir = data.former_workers.tukang.find(w => w.name === "Tohir");
  if (tohir) {
    data.workers.tukang.push(tohir);
  }
}

// Tukang Baru
if (data.former_workers && data.former_workers.tukang_baru.length > 0) {
  const tukanglama = data.former_workers.tukang_baru.find(w => w.name === "Tukang Baru");
  if (tukanglama) {
    data.workers.tukang_baru.unshift(tukanglama); // Put at beginning
  }
}

// Zaky
if (data.former_workers && data.former_workers.kuli.length > 0) {
  const zaky = data.former_workers.kuli.find(w => w.name === "Zaky");
  if (zaky) {
    data.workers.kuli.unshift(zaky); // Put at beginning
  }
}

// Hapus former_workers (tidak perlu lagi)
delete data.former_workers;

// Tandai worker yang berhenti dengan end_date
data.workers.tukang.forEach(w => {
  if (w.name === "Tohir") w.end_date = "2026-05-31";
});
data.workers.tukang_baru.forEach(w => {
  if (w.name === "Tukang Baru") w.end_date = "2026-05-31";
});
data.workers.kuli.forEach(w => {
  if (w.name === "Zaky") w.end_date = "2026-05-31";
});

fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
console.log('✅ Workers restored!');
console.log('   Tohir, Tukang Baru, Zaky kembali ke data');
console.log('   Ditandai dengan end_date: 2026-05-31');
