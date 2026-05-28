const fs = require('fs');
let g = fs.readFileSync('generate.js', 'utf8');

// 1. Add CSS for inner date collapsibles
const cssInsert = `
        .date-inner-collapsible {
            background: #f8f9fa;
            padding: 12px 20px;
            border-radius: 10px;
            margin-bottom: 8px;
            cursor: pointer;
            transition: 0.3s;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-left: 4px solid #667eea;
        }
        .date-inner-collapsible:hover {
            background: #e8ecf1;
        }
        .date-inner-collapsible h4 {
            color: #667eea;
            font-size: 1em;
            margin: 0;
            display: flex;
            align-items: center;
            gap: 12px;
        }
        .date-inner-collapsible .arrow {
            color: #667eea;
            font-size: 0.9em;
            transition: transform 0.3s;
        }
        .date-inner-collapsible.active .arrow {
            transform: rotate(-180deg);
        }
        .date-inner-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
            background: #fdfdfd;
            border-radius: 0 0 10px 10px;
            margin-top: -4px;
            margin-bottom: 8px;
        }
        .date-inner-content.active {
            max-height: 2000px;
            transition: max-height 0.5s ease-in;
            padding: 15px 20px 15px 20px;
        }`;
g = g.replace(`        .footer {`, cssInsert + `\n\n        .footer {`);

// 2. Replace generateDateSections function
const start = g.indexOf('function generateDateSections()');
const end = g.indexOf('function generateTransactionRows()');

const newFn = `function generateDateSections() {
    let sections = '';
    let weekCounter = 0;
    
    function getWeekStart(dateStr) {
        const d = new Date(dateStr);
        const day = d.getDay();
        const diff = day === 0 ? 1 : (1 - day);
        const mon = new Date(d);
        mon.setDate(d.getDate() + diff);
        return mon.toISOString().split('T')[0];
    }
    
    const weekGroups = {};
    sortedDates.forEach(date => {
        const wk = getWeekStart(date);
        if (!weekGroups[wk]) weekGroups[wk] = [];
        weekGroups[wk].push(date);
    });
    
    const sortedWeeks = Object.keys(weekGroups).sort().reverse();
    weekCounter = 0;
    
    sortedWeeks.forEach((weekStart, idx) => {
        const dates = weekGroups[weekStart].sort();
        weekCounter++;
        const weekNum = weekCounter;
        
        let weekTotal = 0;
        let txCount = 0;
        dates.forEach(d => {
            transactionsByDate[d].forEach(tx => {
                weekTotal += tx.total;
                txCount++;
            });
        });
        
        const firstDate = new Date(dates[0]);
        const lastDate = new Date(dates[dates.length - 1]);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
        let dateRange = dates.length === 1
            ? \`\${firstDate.getDate()} \${months[firstDate.getMonth()]}\`
            : \`\${firstDate.getDate()}-\${lastDate.getDate()} \${months[lastDate.getMonth()]}\`;
        
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
        
        // Per-date mini collapsibles (oldest first)
        dates.forEach(date => {
            const transactions = transactionsByDate[date];
            const dateTotal = transactions.reduce((sum, tx) => sum + tx.total, 0);
            const txCountByCat = {};
            transactions.forEach(tx => {
                const cat = tx.category === 'Lain-lain' ? 'Jajan' : tx.category;
                txCountByCat[cat] = (txCountByCat[cat] || 0) + 1;
            });
            const catSummary = Object.entries(txCountByCat).map(([k,v]) => \`\${v}\${k[0].toLowerCase()}\`).join(', ');
            const workDescription = data.daily_work && data.daily_work[date] ? data.daily_work[date] : '';
            const workDot = workDescription ? ' 🔨' : '';
            
            // Date mini header
            sections += \`
                    <div class="date-inner-collapsible">
                        <h4>
                            <span>📆 \${formatDate(date)}</span>
                            <span style="font-size: 0.8em; color: #888;">\${transactions.length} tx</span>
                            <span style="font-size: 0.8em; color: #999;">\${catSummary}\${workDot}</span>
                        </h4>
                        <div style="display: flex; align-items: center; gap: 10px;">
                            <strong style="color: #764ba2; font-size: 0.95em;">\${formatRupiah(dateTotal)}</strong>
                            <span class="arrow">▼</span>
                        </div>
                    </div>
                    <div class="date-inner-content">\`;
            
            // Transaction details
            const byCategory = {};
            transactions.forEach(tx => {
                const cat = tx.category === 'Lain-lain' ? 'Jajan' : tx.category;
                if (!byCategory[cat]) byCategory[cat] = [];
                byCategory[cat].push(tx);
            });
            
            if (workDescription) {
                sections += \`
                        <div style="padding: 10px 15px; margin-bottom: 12px; background: #f0f7ff; border-left: 4px solid #667eea; border-radius: 6px;">
                            <p style="margin: 0; font-size: 0.9em;">📋 <strong>Pekerjaan:</strong> \${workDescription}</p>
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
                    <div style="margin-top: 10px; padding: 12px 15px; background: #667eea10; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #667eea; font-weight: 600;">Total Minggu \${weekNum}</span>
                        <strong style="font-size: 1.1em; color: #667eea;">\${formatRupiah(weekTotal)}</strong>
                    </div>
                </div>\`;
    });
    
    return sections;
}

`;

// Update JS to handle inner collapsibles
const jsUpdate = `
        // Week collapsibles
        document.querySelectorAll('.date-collapsible').forEach(header => {
            header.addEventListener('click', function() {
                this.classList.toggle('active');
                const content = this.nextElementSibling;
                if (content && content.classList.contains('date-content')) {
                    content.classList.toggle('active');
                }
            });
        });
        
        // Date inner collapsibles (inside weeks)
        document.querySelectorAll('.date-inner-collapsible').forEach(header => {
            header.addEventListener('click', function() {
                this.classList.toggle('active');
                const content = this.nextElementSibling;
                if (content && content.classList.contains('date-inner-content')) {
                    content.classList.toggle('active');
                }
            });
        });
`;

const oldJs = `        // Week collapsibles
        document.querySelectorAll('.date-collapsible').forEach`;

g = g.substring(0, start) + newFn + g.substring(end);
g = g.replace(oldJs, jsUpdate);

fs.writeFileSync('generate.js', g);
console.log('Updated to 2-level collapsible');