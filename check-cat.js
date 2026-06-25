const d = JSON.parse(require('fs').readFileSync('kos-um/data.json','utf8'));
const cats = {};
d.transactions.forEach(t => {
    if(!cats[t.category]) cats[t.category] = {};
    const sub = t.subcategory || 'lainnya';
    if(!cats[t.category][sub]) cats[t.category][sub] = 0;
    cats[t.category][sub] += t.total;
});
Object.keys(cats).forEach(c => {
    console.log(c + ':');
    Object.keys(cats[c]).forEach(sub => {
        console.log('  ' + sub + ': Rp ' + cats[c][sub]);
    });
});
