const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

// Reference dari list Rahma (20-25 Jul 2026)
const REF = {
  '2026-07-20': {
    'Heri': 150000, 'Sueb': 135000, 'Supar': 135000, 'Jo': 135000, 'Muji': 135000,
    'Aris': 135000, 'Adit': 120000, 'Ahmad': 120000, 'Rudi': 120000, 'Risky': 120000,
    'Samsul': 120000, 'Izzut': 120000
  },
  '2026-07-21': {
    'Heri': 150000, 'Sueb': 135000, 'Supar': 135000, 'Jo': 135000, 'Muji': 135000,
    'Aris': null, 'Adit': 120000, 'Ahmad': null, 'Rudi': 120000, 'Risky': 120000,
    'Samsul': 120000, 'Izzut': 120000
  },
  '2026-07-22': {
    'Heri': 150000, 'Sueb': 135000, 'Supar': 135000, 'Jo': 135000, 'Muji': 135000,
    'Aris': 135000, 'Adit': 120000, 'Ahmad': null, 'Rudi': 120000, 'Risky': 120000,
    'Samsul': 120000, 'Izzut': 120000
  },
  '2026-07-23': {
    'Heri': null, 'Sueb': 135000, 'Supar': 135000, 'Jo': null, 'Muji': 135000,
    'Aris': 135000, 'Adit': 120000, 'Ahmad': 120000, 'Rudi': 120000, 'Risky': 120000,
    'Samsul': 120000, 'Izzut': 120000
  },
  '2026-07-24': {
    'Heri': 150000, 'Sueb': 135000, 'Supar': null, 'Jo': 135000, 'Muji': null,
    'Aris': 135000, 'Adit': 120000, 'Ahmad': 120000, 'Rudi': 120000, 'Risky': 120000,
    'Samsul': 120000, 'Izzut': 120000
  },
  '2026-07-25': {
    'Heri': 150000, 'Sueb': 135000, 'Supar': 135000, 'Jo': 135000, 'Muji': null,
    'Aris': 135000, 'Adit': 120000, 'Ahmad': 120000, 'Rudi': 120000, 'Risky': 120000,
    'Samsul': 120000, 'Izzut': 120000
  },
};

const ROLE = {
  'Heri': 'Mandor', 'Sueb': 'Tukang', 'Supar': 'Tukang', 'Jo': 'Tukang', 'Muji': 'Tukang',
  'Aris': 'Tukang', 'Adit': 'Kuli', 'Ahmad': 'Kuli', 'Rudi': 'Kuli', 'Risky': 'Kuli',
  'Samsul': 'Kuli', 'Izzut': 'Kuli'
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
