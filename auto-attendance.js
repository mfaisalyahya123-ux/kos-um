const fs = require('fs');

/**
 * Auto-generate attendance for a given date
 * @param {string} date - Format: YYYY-MM-DD
 * @param {object} data - The data.json object
 * @returns {object} Updated data object
 */
function autoAttendance(date, data) {
  const dayOfWeek = new Date(date).getDay(); // 0=Sunday, 1=Monday, ..., 6=Saturday
  const isSunday = dayOfWeek === 0;
  const status = isSunday ? 'libur' : 'hadir';

  // Update attendance for all active workers
  ['mandor', 'tukang', 'tukang_baru', 'kuli'].forEach(role => {
    if (data.workers[role]) {
      data.workers[role].forEach(worker => {
        // Only set if not already set (don't override manual entries)
        if (!worker.attendance[date]) {
          worker.attendance[date] = status;
        }
      });
    }
  });

  return data;
}

/**
 * Generate wage transactions for a given date based on attendance
 * @param {string} date - Format: YYYY-MM-DD
 * @param {object} data - The data.json object
 * @returns {array} Array of wage transactions
 */
function generateWageTransactions(date, data) {
  const transactions = [];
  let nextId = Math.max(...data.transactions.map(t => t.id)) + 1;

  // Mandor
  const mandorPresent = data.workers.mandor.filter(w => w.attendance[date] === 'hadir');
  if (mandorPresent.length > 0) {
    mandorPresent.forEach(w => {
      transactions.push({
        id: nextId++,
        date: date,
        category: "Upah",
        subcategory: "Mandor",
        description: `Upah mandor ${w.name}`,
        quantity: 1,
        unit: "orang",
        price_per_unit: w.rate,
        total: w.rate,
        notes: "",
        funding_source: "Uang Ayah"
      });
    });
  }

  // Tukang (combine tukang + tukang_baru)
  const tukangPresent = [
    ...data.workers.tukang.filter(w => w.attendance[date] === 'hadir'),
    ...data.workers.tukang_baru.filter(w => w.attendance[date] === 'hadir')
  ];
  if (tukangPresent.length > 0) {
    const names = tukangPresent.map(w => w.name).join(', ');
    const total = tukangPresent.reduce((sum, w) => sum + w.rate, 0);
    transactions.push({
      id: nextId++,
      date: date,
      category: "Upah",
      subcategory: "Tukang",
      description: `Upah tukang (${names})`,
      quantity: tukangPresent.length,
      unit: "orang",
      price_per_unit: 135000,
      total: total,
      notes: "",
      funding_source: "Uang Ayah"
    });
  }

  // Kuli
  const kuliPresent = data.workers.kuli.filter(w => w.attendance[date] === 'hadir');
  if (kuliPresent.length > 0) {
    const names = kuliPresent.map(w => w.name).join(', ');
    const total = kuliPresent.reduce((sum, w) => sum + w.rate, 0);
    transactions.push({
      id: nextId++,
      date: date,
      category: "Upah",
      subcategory: "Kuli",
      description: `Upah kuli (${names})`,
      quantity: kuliPresent.length,
      unit: "orang",
      price_per_unit: 120000,
      total: total,
      notes: "",
      funding_source: "Uang Ayah"
    });
  }

  return transactions;
}

// Main execution
const data = JSON.parse(fs.readFileSync('data.json', 'utf8'));
const today = '2026-06-01';

// 1. Auto-generate attendance
autoAttendance(today, data);

// 2. Generate wage transactions
const wageTransactions = generateWageTransactions(today, data);
data.transactions.push(...wageTransactions);

// 3. Ensure daily_work entry exists
if (!data.daily_work[today]) {
  data.daily_work[today] = "";
}

// 4. Update summary
const allDates = Object.keys(data.daily_work).sort();
data.summary.start_date = allDates[0];
data.summary.end_date = allDates[allDates.length - 1];

// Save
fs.writeFileSync('data.json', JSON.stringify(data, null, 2));

console.log('✅ Auto-attendance & wages generated!');
console.log(`   Date: ${today}`);
console.log(`   Transactions added: ${wageTransactions.length}`);
wageTransactions.forEach(tx => {
  console.log(`   - ID ${tx.id}: ${tx.description} Rp ${tx.total.toLocaleString('id-ID')}`);
});

module.exports = { autoAttendance, generateWageTransactions };
