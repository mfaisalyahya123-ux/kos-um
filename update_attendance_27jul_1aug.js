const fs = require('fs');
const path = 'data.json';
let data = JSON.parse(fs.readFileSync(path,'utf8'));
if (!data.workers) data.workers = {};
['mandor','tukang','kuli','tukang_baru'].forEach(r=>{if(!data.workers[r]) data.workers[r]=[];});
function upsertWorker(role, name, rate, extra={}){
  let list = data.workers[role];
  let w = list.find(p=>p.name===name);
  if(!w){w={name,rate,attendance:{}};list.push(w);} else {w.rate=rate; if(!w.attendance) w.attendance={};}
  const dates = ['2026-07-27','2026-07-28','2026-07-29','2026-07-30','2026-07-31','2026-08-01'];
  dates.forEach(d=>{w.attendance[d]=extra[d]!==undefined?extra[d]:'hadir';});
}
// Mandor - Heri (hadir Senin-Selasa-Rabu-Jumat lembur, Kamis normal, Sabtu normal)
upsertWorker('mandor','Heri',195000,{'2026-07-30':'hadir','2026-08-01':'hadir'});
// Tukang - Sueb, Supar, Jo (full 6 days)
['Sueb','Supar','Jo'].forEach(n=>upsertWorker('tukang',n,175000));
// Muji: Kamis only - setengah hari? Tabel shows 70000. We mark hadir for Thu only
upsertWorker('tukang','Muji',175000,{'2026-07-27':'absent','2026-07-28':'absent','2026-07-29':'absent','2026-07-31':'absent','2026-08-01':'absent'});
// Aris: Rabu-Kamis-Jumat-Sabtu
upsertWorker('tukang','Aris',175000,{'2026-07-27':'absent','2026-07-28':'absent','2026-07-30':'hadir'});
// Gendut: Selasa-Sabtu (minus Senin, minus Rabu? Wait check: Tue 175k, Wed 175k, Thu 135k, Fri 175k, Sat 135k)
upsertWorker('tukang','Gendut',175000,{'2026-07-27':'absent'});
// Kuli - Ahmat
upsertWorker('kuli','Ahmat',155000);
// Rudi: Selasa-Rabu-Jumat-Sabtu (no Senin, no Kamis)
upsertWorker('kuli','Rudi',155000,{'2026-07-27':'absent','2026-07-30':'absent'});
// Risky, Adit, Izzut, Samsul: full 6 days
['Risky','Adit','Izzut','Samsul'].forEach(n=>upsertWorker('kuli',n,155000));
// Nanto: Rabu-Sabtu (no Senin, no Selasa)
upsertWorker('kuli','Nanto',155000,{'2026-07-27':'absent','2026-07-28':'absent'});
// Arif: Thurs-Sat only
upsertWorker('kuli','Arif',155000,{'2026-07-27':'absent','2026-07-28':'absent','2026-07-29':'absent'});
fs.writeFileSync(path, JSON.stringify(data,null,2));
console.log('Attendance updated for 27 Jul – 1 Aug 2026');
