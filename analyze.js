// Analyze the wage table from the image
const workers = [
  { no: 1, name: 'Heri', role: 'Mandor', days: [195000, 195000, 'x', 195000, 150000, 195000], total: 885000 },
  { no: 2, name: 'Supar', role: 'Tukang', days: [175000, 'x', 175000, 175000, 135000, 175000], total: 795000 },
  { no: 3, name: 'Sueb', role: 'Tukang', days: [175000, 175000, 175000, 175000, 135000, 175000], total: 970000 },
  { no: 4, name: 'Nur', role: 'Tukang', days: [175000, 175000, 135000, 'x', 'x', 'x'], total: 310000 },
  { no: 5, name: 'Paidi', role: 'Tukang', days: [175000, 'x', 'x', 'x', 'x', 'x'], total: null },
  { no: 6, name: 'Rudi', role: 'Kuli', days: [155000, 155000, 'x', 155000, 120000, 155000], total: 705000 },
  { no: 7, name: 'Riski', role: 'Kuli', days: [175000, 155000, 155000, 155000, 120000, 155000], total: 860000 },
  { no: 8, name: 'Adit', role: 'Kuli', days: [155000, 155000, 155000, 155000, 120000, 155000], total: 860000 },
  { no: 9, name: 'Ahmad', role: 'Kuli', days: [155000, 155000, 155000, 155000, 120000, 155000], total: 860000 },
  { no: 10, name: 'Muji', role: 'Tukang', days: [175000, 175000, 175000, 175000, 135000, 175000], total: 970000 },
];

const dayNames = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

console.log('=== ANALISIS GAJI MINGGU 6 ===\n');
console.log('Tarif: 2x = Mandor 195k / Tukang 175k / Kuli 155k');
console.log('Tarif: Normal = Mandor 150k / Tukang 135k / Kuli 120k\n');

workers.forEach(w => {
  console.log(`--- ${w.name} (${w.role}) ---`);
  w.days.forEach((gaji, i) => {
    if (gaji === 'x') {
      console.log(`  ${dayNames[i]}: TIDAK MASUK`);
    } else if (w.role === 'Mandor' && gaji === 195000) {
      console.log(`  ${dayNames[i]}: Rp ${gaji.toLocaleString()} (2x)`);
    } else if (w.role === 'Tukang' && gaji === 175000) {
      console.log(`  ${dayNames[i]}: Rp ${gaji.toLocaleString()} (2x)`);
    } else if (w.role === 'Kuli' && gaji === 155000) {
      console.log(`  ${dayNames[i]}: Rp ${gaji.toLocaleString()} (2x)`);
    } else {
      console.log(`  ${dayNames[i]}: Rp ${gaji.toLocaleString()} (normal)`);
    }
  });
  const calcTotal = w.days.filter(g => g !== 'x').reduce((s, g) => s + g, 0);
  console.log(`  TOTAL: Rp ${calcTotal.toLocaleString()} (claim: Rp ${w.total ? w.total.toLocaleString() : '-'})`);
  console.log();
});

// Cross-check daily totals
console.log('=== TOTAL PER HARI ===');
dayNames.forEach((dn, i) => {
  let total = 0;
  let count = 0;
  workers.forEach(w => {
    if (w.days[i] !== 'x') {
      total += w.days[i];
      count++;
    }
  });
  console.log(`${dn}: ${count} orang, Rp ${total.toLocaleString()}`);
});
