const fs = require('fs');
const data = JSON.parse(fs.readFileSync(__dirname + '/data.json', 'utf8'));

// Hitung aktual dari transaksi
const byCat = {};
let totalAll = 0;
let totalUpah = 0;
let totalNonUpah = 0;
const byFunding = {};

data.transactions.forEach(t => {
  const tot = t.total || 0;
  totalAll += tot;
  byCat[t.category] = (byCat[t.category] || 0) + tot;
  byFunding[t.funding_source] = (byFunding[t.funding_source] || 0) + tot;
  if (t.category === 'Upah') totalUpah += tot;
  else totalNonUpah += tot;
});

const fmt = n => 'Rp ' + Math.round(n).toLocaleString('id-ID');

console.log('=== TOTAL AKTUAL (dari penjumlahan transaksi) ===');
console.log('Total ALL      :', fmt(totalAll), '(' + data.transactions.length + ' tx)');
console.log('Total UPAH     :', fmt(totalUpah));
console.log('Total NON-UPAH :', fmt(totalNonUpah));
console.log('\n=== PER KATEGORI ===');
for (const [k, v] of Object.entries(byCat).sort((a,b)=>b[1]-a[1])) {
  console.log(k.padEnd(20), fmt(v));
}

console.log('\n=== PER FUNDING SOURCE ===');
for (const [k, v] of Object.entries(byFunding).sort((a,b)=>b[1]-a[1])) {
  console.log((k||'(KOSONG)').padEnd(20), fmt(v));
}

console.log('\n=== SUMMARY TERSIMPAN (data.json) ===');
console.log(JSON.stringify(data.summary, null, 2));

// Bandingkan dengan summary.total_expense kalau ada
const s = data.summary || {};
const storedTotal = s.total_expense ?? s.total ?? s.grand_total;
if (storedTotal !== undefined) {
  console.log('\n=== SELISIH ===');
  console.log('Stored total :', fmt(storedTotal));
  console.log('Actual total :', fmt(totalAll));
  console.log('Selisih      :', fmt(totalAll - storedTotal));
}
