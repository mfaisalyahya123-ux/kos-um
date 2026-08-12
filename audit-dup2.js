const fs = require('fs');
const data = JSON.parse(fs.readFileSync(__dirname + '/data.json', 'utf8'));
const txs = data.transactions.filter(t => t.category !== 'Upah');

const keyMap = {};
txs.forEach(t => {
  const key = (t.description.trim().toLowerCase()) + '|' + t.date + '|' + t.total;
  if (!keyMap[key]) keyMap[key] = [];
  keyMap[key].push(t);
});

const pairs = [];
for (const [k, arr] of Object.entries(keyMap)) {
  if (arr.length > 1) {
    const totalDup = arr.reduce((s, x) => s + x.total, 0);
    pairs.push({
      count: arr.length,
      key: k,
      items: arr.map(x => ({id:x.id, cat:x.cat, unit:x.unit, qty:x.quantity, ppu:x.price_per_unit, total:x.total})),
      double_count_total: totalDup
    });
  }
}

const out = {duplicates: pairs, git_msg: 'ignore'};
fs.writeFileSync(__dirname + '/dup-report.json', JSON.stringify(out, null, 2));
console.log('wrote dup-report.json with ' + pairs.length + ' duplicate groups');
