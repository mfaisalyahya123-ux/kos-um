const fs = require('fs');
const data = JSON.parse(fs.readFileSync(__dirname + '/data.json', 'utf8'));
const txs = data.transactions.filter(t => t.category !== 'Upah');

// 1. Nama sama tapi kategori beda
const nameGroup = {};
txs.forEach(t => {
  const key = t.description.trim().toLowerCase();
  if (!nameGroup[key]) nameGroup[key] = [];
  nameGroup[key].push({id: t.id, cat: t.category, unit: t.unit, date: t.date, qty: t.quantity, ppu: t.price_per_unit, total: t.total});
});

console.log('=== NAMA SAMA TAPI KATEGORI BEDA ===');
for (const [name, arr] of Object.entries(nameGroup)) {
  const cats = [...new Set(arr.map(x => x.cat))];
  if (cats.length > 1) {
    console.log(JSON.stringify({nama: name, kategori: cats, items: arr}));
  }
}

// 2. Unit inkonsisten per tipe
console.log('\n=== UNIT INKONSISTEN PER TIPE ===');
const typeGroup = {};
txs.forEach(t => {
  const desc = t.description;
  if (/besi/i.test(desc)) { typeGroup.besi = typeGroup.besi || new Set(); typeGroup.besi.add(t.unit); }
  if (/paku/i.test(desc)) { typeGroup.paku = typeGroup.paku || new Set(); typeGroup.paku.add(t.unit); }
  if (/pasir/i.test(desc)) { typeGroup.pasir = typeGroup.pasir || new Set(); typeGroup.pasir.add(t.unit); }
  if (/koral|gravel/i.test(desc)) { typeGroup.koral = typeGroup.koral || new Set(); typeGroup.koral.add(t.unit); }
  if (/semen/i.test(desc)) { typeGroup.semen = typeGroup.semen || new Set(); typeGroup.semen.add(t.unit); }
  if (/bata/i.test(desc)) { typeGroup.bata = typeGroup.bata || new Set(); typeGroup.bata.add(t.unit); }
  if (/bendrat/i.test(desc)) { typeGroup.bendrat = typeGroup.bendrat || new Set(); typeGroup.bendrat.add(t.unit); }
  if (/atap/i.test(desc)) { typeGroup.atap = typeGroup.atap || new Set(); typeGroup.atap.add(t.unit); }
  if (/tambang/i.test(desc)) { typeGroup.tambang = typeGroup.tambang || new Set(); typeGroup.tambang.add(t.unit); }
  if (/transport|antar/i.test(desc)) { typeGroup.transport = typeGroup.transport || new Set(); typeGroup.transport.add(t.unit); }
  if (/batu/i.test(desc)) { typeGroup.batu = typeGroup.batu || new Set(); typeGroup.batu.add(t.unit); }
  if (/pasir ijo/i.test(desc)) { typeGroup.pasirijo = typeGroup.pasirijo || new Set(); typeGroup.pasirijo.add(t.unit); }
});

for (const [type, units] of Object.entries(typeGroup)) {
  if (units.size > 1) {
    console.log(type + ': ' + [...units].join(', '));
  }
}

// 3. Field kosong
console.log('\n=== FIELD KOSONG ===');
txs.forEach(t => {
  if (!t.funding_source || !t.unit || !t.quantity || !t.price_per_unit || !t.total) {
    console.log(JSON.stringify({id:t.id, desc:t.description, fields:{fs:t.funding_source,unit:t.unit,qty:t.quantity,ppu:t.price_per_unit,total:t.total}}));
  }
});

// 4. Aritmatika salah
console.log('\n=== ARITMATIKA SALAH ===');
txs.forEach(t => {
  if (Math.abs(t.quantity * t.price_per_unit - t.total) > 1) {
    console.log(JSON.stringify({id:t.id, desc:t.description, calc:t.quantity*t.price_per_unit, stated:t.total}));
  }
});

// 5. Harga outlier per kelompok (>3x median)
console.log('\n=== HARGA OUTLIER (>3x median) ===');
const priceGroup = {};
txs.forEach(t => {
  let grp = '';
  if (/semen/i.test(t.description)) grp='semen';
  else if (/paku/i.test(t.description)) grp='paku';
  else if (/pasir/i.test(t.description)) grp='pasir';
  else if (/koral|gravel/i.test(t.description)) grp='koral';
  else if (/bata/i.test(t.description)) grp='bata';
  else if (/besi/i.test(t.description)) grp='besi';
  else if (/bendrat/i.test(t.description)) grp='bendrat';
  else if (/atap/i.test(t.description)) grp='atap';
  if (grp && t.price_per_unit > 0) {
    if (!priceGroup[grp]) priceGroup[grp]=[];
    priceGroup[grp].push({id:t.id,desc:t.description,ppu:t.price_per_unit,total:t.total,unit:t.unit,date:t.date});
  }
});

function med(arr) {
  const s=[...arr].sort((a,b)=>a-b);
  const m=Math.floor(s.length/2);
  return s.length%2?s[m]:(s[m-1]+s[m])/2;
}

for (const [grp,items] of Object.entries(priceGroup)) {
  const ppus=items.map(i=>i.ppu);
  const m=med(ppus);
  items.forEach(i=>{
    if(m>0 && i.ppu > m*3) {
      console.log(grp+' outlier: id'+i.id+' "'+i.desc+'" ppu='+i.ppu+' unit='+i.unit+' med='+m+' ratio='+(i.ppu/m).toFixed(1)+'x');
    }
  });
}

console.log('\n=== DONE ===');
