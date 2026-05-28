const fs = require('fs');
let g = fs.readFileSync('generate.js', 'utf8');

// Find the Struktur Bangunan card rendering block
const marker1 = 'categoryDetails[\'Struktur Bangunan\'].map';
const start = g.indexOf(marker1);
const end = g.indexOf(').join(\'\')}', start);

if (start > 0 && end > 0) {
    console.log('Found block from', start, 'to', end);
    // The full block including the template
    const blockStart = start;
    const blockEnd = end + 10; // after ).join('')}
    
    const newCode = `(() => {
                                    // Group by Lantai tag in description
                                    const groups = {};
                                    categoryDetails['Struktur Bangunan'].forEach(tx => {
                                        const match = tx.description.match(/\\(Lantai \\d+ - [^)]+\\)/);
                                        const key = match ? match[1] : 'Lainnya';
                                        if (!groups[key]) groups[key] = [];
                                        groups[key].push(tx);
                                    });
                                    const sortedKeys = Object.keys(groups).sort((a,b) => {
                                        if (a === 'Lainnya') return 1;
                                        if (b === 'Lainnya') return -1;
                                        return a.localeCompare(b);
                                    });
                                    let html = '';
                                    sortedKeys.forEach(key => {
                                        const items = groups[key];
                                        const subtotal = items.reduce((s,tx) => s + tx.total, 0);
                                        html += \`
                                    <div style="margin-bottom: 15px;">
                                        <h4 style="color: #e67e22; font-size: 0.95em; margin-bottom: 8px; padding: 6px 10px; background: #fff8e1; border-radius: 6px;">
                                            \${key === 'Lainnya' ? '📦 Lainnya' : '🏠 ' + key}
                                            <span style="float: right; font-weight: 600; font-size: 0.9em;">\${'Rp ' + subtotal.toLocaleString('id-ID')}</span>
                                        </h4>
                                        \${items.map(tx => \`
                                        <div class="item">
                                            <span>\${tx.description} (\${tx.quantity} \${tx.unit})</span>
                                            <strong>\${formatRupiah(tx.total)}</strong>
                                        </div>\`).join('')}
                                    </div>\`;
                                    });
                                    return html;
                                })()`;
    
    g = g.substring(0, blockStart) + newCode + g.substring(blockEnd);
    fs.writeFileSync('generate.js', g);
    console.log('Replaced SB card with lantai grouping');
} else {
    console.log('NOT FOUND, start:', start, 'end:', end);
}