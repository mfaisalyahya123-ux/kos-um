const fs = require('fs');
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));

data.daily_work["2026-05-29"] = "Persiapan ngecor - kuli dan mandor";
data.daily_work["2026-05-30"] = "Kuli 4 ngecor, tukang baru 2 dan mandor buat bekesting";

fs.writeFileSync('data.json', JSON.stringify(data, null, 2));
console.log('✅ Daily work updated');
