const fs = require('fs');
let g = fs.readFileSync('generate.js', 'utf8');

// Find the Kuli comment that comes after Tukang section
const marker = "        }\n        \n        // Kuli\n        if (data.workers.kuli";

g = g.replace(marker, `        }

        // Tukang Baru
        if (data.workers.tukang_baru && data.workers.tukang_baru.length > 0) {
            data.workers.tukang_baru.forEach(worker => {
                const weekAttendance = weekDates.filter(d => worker.attendance[d]);
                if (weekAttendance.length > 0) {
                    const hadirCount = weekAttendance.filter(d => worker.attendance[d] === 'hadir').length;
                    const totalGaji = hadirCount * worker.rate;
                    
                    html += \`
                        <div class="category-card">
                            <div class="category-header">
                                <h3>
                                    <span style="background: #fff3e0; padding: 6px 12px; border-radius: 6px; font-weight: bold;">TUKANG: \${worker.name}</span>
                                    <span class="arrow">?</span>
                                </h3>
                                <div class="total">\${formatRupiah(totalGaji)}</div>
                                <div class="percentage">\${hadirCount} hari x \${formatRupiah(worker.rate)}</div>
                            </div>
                            <div class="category-details">
                                <div class="item-list" style="padding: 0 25px 25px 25px;">
                                    \${weekAttendance.map(date => \`
                                    <div class="item" style="padding: 10px 0; border-bottom: 1px solid #f0f0f0;">
                                        <span>\${formatDate(date)}</span>
                                        <strong>
                                            <span style="padding: 4px 12px; border-radius: 4px; background: \${worker.attendance[date] === 'hadir' ? '#e8f5e9' : '#ffebee'}; color: \${worker.attendance[date] === 'hadir' ? '#2e7d32' : '#c62828'}; font-size: 0.9em;">
                                                \${worker.attendance[date] === 'hadir' ? 'HADIR' : 'IZIN'}
                                            </span>
                                        </strong>
                                    </div>\`).join('')}
                                </div>
                            </div>
                        </div>\`;
                }
            });
        }
        
        // Kuli
        if (data.workers.kuli`);

fs.writeFileSync('generate.js', g);
console.log('Added tukang_baru section');