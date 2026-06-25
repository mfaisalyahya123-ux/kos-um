const s = require('fs').readFileSync('kos-um/generate.js','utf8');
const lines = s.split('\n');
lines.forEach((l,i) => {
    if (l.includes('Struktur Bangunan') && l.includes('if')) console.log(i+1+': '+l);
    if (l.includes('Lainnya') && l.includes('key ===')) console.log(i+1+': '+l);
    if (l.includes('cleanDesc')) console.log(i+1+': '+l);
});
