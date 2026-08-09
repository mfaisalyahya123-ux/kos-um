const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

// Reference dari list Rahma (27 Jul - 1 Agt 2026)
const REF = {
  '2026-07-27': {
    'Heri': 195000, 'Sueb': 175000, 'Supar': 175000, 'Jo': 175000, 'Muji': null,
    'Aris': null, 'Gendut': null, 'Ahmat': 155000, 'Rudi': null, 'Risky': 155000,
    'Adit': 155000, 'Izzut': 155000, 'Samsul': 155000, 'Nanto': null, 'Arif': null
  },
  '2026-07-28': {
    'Heri': 195000, 'Sueb': 175000, 'Supar': 175000, 'Jo': 175000, 'Muji': null,
    'Aris': null, 'Gendut': 175000, 'Ahmat': 155000, 'Rudi': 155000, 'Risky': 155000,
    'Adit': 155000, 'Izzut': 155000, 'Samsul': 155000, 'Nanto': null, 'Arif': null
  },
  '2026-07-29': {
    'Heri': 195000, 'Sueb': 175000, 'Supar': 175000, 'Jo': 175000, 'Muji': null,
    'Aris': 175000, 'Gendut': 175000, 'Ahmat': 155000, 'Rudi': 155000, 'Risky': 155000,
    'Adit': 155000, 'Izzut': 155000, 'Samsul': 155000, 'Nanto': 155000, 'Arif': 155000
  },
  '2026-07-30': {
    'Heri': null, 'Sueb': 135000, 'Supar': 135000, 'Jo': 135000, 'Muji': 70000,
    'Aris': 135000, 'Gendut': 135000, 'Ahmat': 120000, 'Rudi': null, 'Risky': 120000,
    'Adit': 120000, 'Izzut': 120000, 'Samsul': 120000, 'Nanto': 120000, 'Arif': 120000
  },
  '2026-07-31': {
    'Heri': 195000, 'Sueb': 175000, 'Supar': 175000, 'Jo': 175000, 'Muji': null,
    'Aris': 175000, 'Gendut': 175000, 'Ahmat': 155000, 'Rudi': 155000, 'Risky': 155000,
    'Adit': 155000, 'Izzut': 155000, 'Samsul': 155000, 'Nanto': 155000, 'Arif': 155000
  },
  '2026-08-01': {
    'Heri': 150000, 'Sueb': 135000, 'Supar': 135000, 'Jo': 135000, 'Muji': null,
    'Aris': 135000, 'Gendut': 135000, 'Ahmat': 120000, 'Rudi': 120000, 'Risky': 120000,
    'Adit': 120000, 'Izzut': 120000, 'Samsul': 120000, 'Nanto': 120000, 'Arif': 120000
  },
};

const ROLE = {
  'Heri': 'Mandor', 'Sueb': 'Tukang', 'Supar': 'Tukang', 'Jo': 'Tukang', 'Muji': 'Tukang',
  'Aris': 'Tukang', 'Gendut': 'Tukang', 'Ahmat': 'Kuli', 'Risky': 'Kuli', 'Rudi': 'Kuli',
  'Adit': 'Kuli', 'Izzut': 'Kuli', 'Samsul': 'Kuli', 'Nanto': 'Kuli', 'Arif': 'Kuli'
};

const dates = Object.keys(REF);
const recorded = {};
for (const t of data.transactions) {
  if (t.category !== 'Upah') continue;
  if (!dates.includes(t.date)) continue;
  const role = t.subcategory;
  if (!role) continue;
  const names = (t.description || '').split(',').map(s => s.trim()).filter(Boolean);
  const per = t.price_per_unit || 0;
  for (const n of names) {
    recorded[t.date] = recorded[t.date] || {};
    recorded[t.date][n] = (recorded[t.date][n] || 0) + per;
  }
}

let problems = 0;
for (const d of dates) {
  console.log(`\n===== ${d} =====`);
  for (const name of Object.keys(REF[d])) {
    const exp = REF[d][name];
    const got = recorded[d] ? recorded[d][name] : undefined;
    if (exp === null) {
      if (got !== undefined) { console.log(`  ❌ ${name} (${ROLE[name]}): harusnya TIDAK MASUK, tapi tercatat Rp ${got.toLocaleString('id-ID')}`); problems++; }
    } else {
      if (got === undefined) { console.log(`  ❌ ${name} (${ROLE[name]}): harusnya ${exp.toLocaleString('id-ID')}, tapi TIDAK tercatat`); problems++; }
      else if (Math.abs(got - exp) > 1) { console.log(`  ❌ ${name} (${ROLE[name]}): harusnya ${exp.toLocaleString('id-ID')}, tercatat Rp ${got.toLocaleString('id-ID')}`); problems++; }
      else { console.log(`  ✅ ${name} (${ROLE[name]}): ${exp.toLocaleString('id-ID')}`); }
    }
  }
}
console.log(`\n=== TOTAL MASALAH: ${problems} ===`);
