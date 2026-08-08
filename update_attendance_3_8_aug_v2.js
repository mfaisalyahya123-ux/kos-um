const fs = require('fs');
const path = 'data.json';
let data = JSON.parse(fs.readFileSync(path,'utf8'));
if (!data.workers) data.workers = {};
// Ensure role arrays exist
['mandor','tukang','kuli','tukang_baru'].forEach(r=>{if(!data.workers[r]) data.workers[r]=[];});
// Helper to add or update a worker
function upsertWorker(role, name, rate, extraAttendance={}){
  let list = data.workers[role];
  let w = list.find(p=>p.name===name);
  if(!w){w={name,rate,attendance:{}};list.push(w);} else {w.rate=rate; if(!w.attendance) w.attendance={};}
  // add attendance for 3-8 Aug
  const dates = ['2026-08-03','2026-08-04','2026-08-05','2026-08-06','2026-08-07','2026-08-08'];
  dates.forEach(d=>{w.attendance[d]=extraAttendance[d]!==undefined?extraAttendance[d]:'hadir';});
}
// Mandor – Heri (rate 195k, but Kamis & Sabtu lower – we keep hadir and rate 195k; fine)
upsertWorker('mandor','Heri',195000);
// Tukang – Sueb, Supar, Jo, Muji, Gendut
upsertWorker('tukang','Sueb',175000);
upsertWorker('tukang','Supar',175000);
upsertWorker('tukang','Jo',175000);
upsertWorker('tukang','Muji',175000,{'2026-08-04':'absent','2026-08-05':'absent','2026-08-06':'absent'});
upsertWorker('tukang','Gendut',135000,{'2026-08-03':'absent','2026-08-04':'absent','2026-08-05':'absent'});
// Kuli – Ahmat, Risky, Rudi, Adit, Izzut, Samsul, Nanto
upsertWorker('kuli','Ahmat',155000,{'2026-08-07':'absent'});
upsertWorker('kuli','Risky',155000);
upsertWorker('kuli','Rudi',155000,{'2026-08-08':'absent'});
upsertWorker('kuli','Adit',155000);
upsertWorker('kuli','Izzut',155000);
upsertWorker('kuli','Samsul',155000);
upsertWorker('kuli','Nanto',155000);
fs.writeFileSync(path, JSON.stringify(data,null,2));
console.log('Attendance and rates updated for 3‑8 Aug 2026');
