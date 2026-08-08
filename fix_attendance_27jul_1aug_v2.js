const fs = require('fs');
const path = 'data.json';
let data = JSON.parse(fs.readFileSync(path,'utf8'));
if (!data.workers) data.workers = {};
['mandor','tukang','kuli'].forEach(r=>{if(!data.workers[r]) data.workers[r]=[];});
function setWorker(role, name, rate, overrides={}){
  let list = data.workers[role];
  let w = list.find(p=>p.name===name);
  if(!w){w={name,rate,attendance:{}};list.push(w);} else {w.rate=rate; if(!w.attendance) w.attendance={};}
  const mainDates = ['2026-07-27','2026-07-28','2026-07-29','2026-07-30','2026-07-31','2026-08-01'];
  mainDates.forEach(d=>{w.attendance[d]=overrides[d]!==undefined?overrides[d]:'hadir';});
}
// Mandor
setWorker('mandor','Heri',195000);
// Tukang
setWorker('tukang','Sueb',175000);
setWorker('tukang','Supar',175000);
setWorker('tukang','Jo',175000);
// Muji: Kamis only
setWorker('tukang','Muji',175000,{'2026-07-27':'absent','2026-07-28':'absent','2026-07-29':'absent','2026-07-31':'absent','2026-08-01':'absent'});
// Aris: Rabu, Kamis, Jumat, Sabtu
setWorker('tukang','Aris',175000,{'2026-07-27':'absent','2026-07-28':'absent'});
// Gendut: Selasa, Rabu, Kamis, Jumat, Sabtu (no Mon)
setWorker('tukang','Gendut',175000,{'2026-07-27':'absent'});
// Kuli
setWorker('kuli','Ahmat',155000);
// Rudi: Selasa, Rabu, Jumat, Sabtu (no Mon, no Thu)
setWorker('kuli','Rudi',155000,{'2026-07-27':'absent','2026-07-30':'absent'});
['Risky','Adit','Izzut','Samsul'].forEach(n=>setWorker('kuli',n,155000));
// Nanto: Rabu, Kamis, Jumat, Sabtu (no Mon, no Tue)
setWorker('kuli','Nanto',155000,{'2026-07-27':'absent','2026-07-28':'absent'});
// Arif: Kamis, Jumat, Sabtu (no Mon, Tue, Wed)
setWorker('kuli','Arif',155000,{'2026-07-27':'absent','2026-07-28':'absent','2026-07-29':'absent'});

fs.writeFileSync(path, JSON.stringify(data,null,2));
console.log('Attendance for 27 Jul - 1 Aug corrected (all 6 days now).');
