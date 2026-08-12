const fs = require('fs');
const d = JSON.parse(fs.readFileSync('data.json', 'utf8'));
let maxId = Math.max(...d.transactions.map(t => t.id));
const S = 'Uang Ayah';
const items = [
  { date: '2026-07-20', cat: 'Upah', sub: 'Tukang', desc: 'Upah tukang pintu stainless', qty: 1, unit: 'orang', ppu: 15000000, total: 15000000 },
  { date: '2026-07-30', cat: 'Material', sub: '', desc: 'Paku 4" 1 dus', qty: 1, unit: 'dus', ppu: 352500, total: 352500 },
  { date: '2026-07-30', cat: 'Material', sub: '', desc: 'Bata ringan 3 kibik', qty: 3, unit: 'kibik', ppu: 473333.333, total: 1420000 },
  { date: '2026-07-31', cat: 'Upah', sub: 'Arsitek', desc: 'Upah arsitek Lito', qty: 1, unit: 'orang', ppu: 6000000, total: 6000000 },
  { date: '2026-08-03', cat: 'Material', sub: '', desc: 'Keramik BIG 1 dus', qty: 1, unit: 'dus', ppu: 88725, total: 88725 },
  { date: '2026-08-05', cat: 'Material', sub: '', desc: 'Shower', qty: 1, unit: 'pcs', ppu: 36000, total: 36000 },
  { date: '2026-08-05', cat: 'Material', sub: '', desc: 'Kran Onda double', qty: 1, unit: 'pcs', ppu: 113000, total: 113000 },
  { date: '2026-08-05', cat: 'Material', sub: '', desc: 'Saklar single', qty: 4, unit: 'pcs', ppu: 12900, total: 51600 },
  { date: '2026-08-05', cat: 'Material', sub: '', desc: 'Saklar double', qty: 1, unit: 'pcs', ppu: 17000, total: 17000 },
  { date: '2026-08-05', cat: 'Material', sub: '', desc: 'Paket kasur 90cm + lemari besi', qty: 1, unit: 'paket', ppu: 2699000, total: 2699000 },
  { date: '2026-08-05', cat: 'Upah', sub: 'Tukang', desc: 'Upah tukang pintu stainless', qty: 1, unit: 'orang', ppu: 10000000, total: 10000000 },
  { date: '2026-08-07', cat: 'Lain-lain', sub: '', desc: 'Jasa buang sampah', qty: 1, unit: 'jasa', ppu: 130000, total: 130000 },
  { date: '2026-08-09', cat: 'Material', sub: '', desc: 'Panasonic stop kontak', qty: 10, unit: 'pcs', ppu: 17000, total: 170000 },
  { date: '2026-08-09', cat: 'Material', sub: '', desc: 'Masko fitting', qty: 8, unit: 'pcs', ppu: 5300, total: 42400 },
  { date: '2026-08-09', cat: 'Material', sub: '', desc: 'Fitting Panasonic', qty: 10, unit: 'pcs', ppu: 8500, total: 85000 },
  { date: '2026-08-11', cat: 'Upah', sub: 'Tukang', desc: 'Upah tukang pintu stainless', qty: 1, unit: 'orang', ppu: 2000000, total: 2000000 },
  { date: '2026-08-11', cat: 'Struktur Bangunan', sub: 'Dak Lantai 3', desc: 'Besi 10 250 pcs', qty: 250, unit: 'pcs', ppu: 71000, total: 17750000 },
  { date: '2026-08-11', cat: 'Struktur Bangunan', sub: 'Dak Lantai 3', desc: 'Bendrat 3 roll', qty: 3, unit: 'roll', ppu: 261000, total: 783000 },
];
const first = maxId + 1;
for (const it of items) {
  maxId++;
  d.transactions.push({
    id: maxId, date: it.date, category: it.cat, subcategory: it.sub,
    description: it.desc, quantity: it.qty, unit: it.unit,
    price_per_unit: it.ppu, total: it.total, notes: '', funding_source: S,
  });
}
fs.writeFileSync('data.json', JSON.stringify(d, null, 2));
console.log('Added IDs', first, '..', maxId, '| total:', d.transactions.length);
