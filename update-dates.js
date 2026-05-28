const fs = require('fs');
const g = fs.readFileSync('generate.js', 'utf8');
const start = g.indexOf('function generateDateSections()');
const end = g.indexOf('function generateTransactionRows()');

const newFn = `function generateDateSections() {
    let sections = '';
    
    // Helper: get Monday of the week for a given date
    function getWeekStart(dateStr) {
        const d = new Date(dateStr);
        const day = d.getDay();
        const diff = day === 0 ? 1 : (1 - day);
        const mon = new Date(d);
        mon.setDate(d.getDate() + diff);
        return mon.toISOString().split('T')[0];
    }
    
    // Group dates into weeks
    const weekGroups = {};
    sortedDates.forEach(date => {
        const wk = getWeekStart(date);
        if (!weekGroups[wk]) weekGroups[wk] = [];
        weekGroups[wk].push(date);
    });
    
    // Sort weeks (newest first)
    const sortedWeeks = Object.keys(weekGroups).sort().reverse();
    
    sortedWeeks.forEach((weekStart, idx) => {
        const dates = weekGroups[weekStart].sort();
        const weekNum = sortedWeeks.length - idx;
        
        // Calculate week total and count
        let weekTotal = 0;
        let txCount = 0;
        dates.forEach(d => {
            transactionsByDate[d].forEach(tx => {
                weekTotal += tx.total;
                txCount++;
            });
        });
        
        // Format date range
        const firstDate = new Date(dates[dates.length - 1]);
        const lastDate = new Date(dates[0]);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        let dateRange;
        if (dates.length === 1) {
            dateRange = \`\${firstDate.getDate()} \${months[firstDate.getMonth()]}\`;
        } else {
            dateRange = \`\${firstDate.getDate()}-\${lastDate.getDate()} \${months[lastDate.getMonth()]}\`;
        }
        
        // Week header
        sections += \`
                <div class="date-collapsible" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
                    <div style="text-align: left;">
                        <h3 style="color: white; margin: 0;">📅 Minggu \${weekNum} (\${dateRange})</h3>
                        <span style="font-size: 0.85em; opacity: 0.9;">\${txCount} transaksi · \${dates.length} hari</span>
                    </div>
                    <div style="display: flex; align-items: center; gap: 15px;">
                        <strong style="font-size: 1.2em;">\${formatRupiah(weekTotal)}</strong>
                        <span class="arrow" style="color: white;">▼</span>
                    </div>
                </div>
                <div class="date-content">\`;
        
        // Per-date breakdown (oldest first)
        dates.reverse().forEach(date => {
            const transactions = transactionsByDate[date];
            const dateTotal = transactions.reduce((sum, tx) => sum + tx.total, 0);
            const workDescription = data.daily_work && data.daily_work[date] ? data.daily_work[date] : '';
            
            // Group by category
            const byCategory = {};
            transactions.forEach(tx => {
                const cat = tx.category === 'Lain-lain' ? 'Jajan' : tx.category;
                if (!byCategory[cat]) byCategory[cat] = [];
                byCategory[cat].push(tx);
            });
            
            sections += \`
                    <div style="margin-bottom: 15px; padding: 15px; background: #f8f9fa; border-radius: 10px; border-left: 4px solid #667eea;">
                        <h4 style="color: #667eea; margin-bottom: 10px; font-size: 1em;">📆 \${formatDate(date)} — <span style="color: #764ba2;">\${formatRupiah(dateTotal)}</span></h4>\`;
            
            if (workDescription) {
                sections += \`
                        <div style="padding: 8px 12px; margin-bottom: 12px; background: #f0f7ff; border-radius: 6px; font-size: 0.9em;">
                            📋 <strong>Pekerjaan:</strong> \${workDescription}
                        </div>\`;
            }
            
            Object.keys(byCategory).forEach(category => {
                const icon = {
                    'Jajan': '🍔',
                    'Material': '🧱',
                    'Upah': '💰',
                    'Alat': '🔧',
                    'Struktur Bangunan': '🏗️'
                }[category] || '📦';
                
                sections += \`
                        <div style="padding-left: 10px; margin-bottom: 8px;">
                            <h5 style="color: #764ba2; margin-bottom: 5px; font-size: 0.9em;">\${icon} \${category}</h5>\`;
                
                byCategory[category].forEach(tx => {
                    let desc = tx.description;
                    if (tx.subcategory) {
                        desc = \`\${tx.quantity} \${tx.subcategory.toLowerCase()} \${tx.description.includes('full day') ? 'full day' : tx.description} (\${tx.quantity} orang @ \${formatRupiah(tx.price_per_unit)})\`;
                    } else if (tx.quantity > 1 || tx.unit !== 'item') {
                        desc = \`\${tx.description} (\${tx.quantity} \${tx.unit}\${tx.price_per_unit ? ' @ ' + formatRupiah(tx.price_per_unit) : ''})\`;
                    }
                    
                    sections += \`
                            <div class="item" style="font-size: 0.85em;">
                                <span>\${desc}</span>
                                <strong>\${formatRupiah(tx.total)}</strong>
                            </div>\`;
                });
                
                sections += \`
                        </div>\`;
            });
            
            sections += \`
                    </div>\`;
        });
        
        // Week total footer
        sections += \`
                    <div style="margin-top: 5px; padding: 12px 15px; background: #667eea10; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #667eea; font-weight: 600;">Total Minggu \${weekNum}</span>
                        <strong style="font-size: 1.1em; color: #667eea;">\${formatRupiah(weekTotal)}</strong>
                    </div>
                </div>\`;
    });
    
    return sections;
}

`;

fs.writeFileSync('generate.js', g.substring(0, start) + newFn + g.substring(end));
console.log('Replaced generateDateSections with week-grouped version');