const fs = require('fs');
let g = fs.readFileSync('generate.js', 'utf8');

const bs = 20942;
const be = 22228;

const newBlock = `sortedKeys.forEach(key => {
                                        const items = groups[key];
                                        const subtotal = items.reduce((s,tx) => s + tx.total, 0);
                                        const cleanDesc = (desc) => desc.replace(/\\s*\\(Lantai \\d+ - [^)]+\\)/, '');
                                        html += \`
                                    <div style="margin-bottom: 18px;">
                                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; background: #fff8e1; border-radius: 6px; margin-bottom: 10px;">
                                            <h4 style="color: #e67e22; font-size: 0.95em; margin: 0;">
                                                \${key === 'Lainnya' ? '📦 Lainnya' : '🏠 ' + key}
                                            </h4>
                                            <strong style="color: #e67e22; font-size: 0.95em; white-space: nowrap;">\${'Rp ' + subtotal.toLocaleString('id-ID')}</strong>
                                        </div>
                                        \${items.map(tx => \`
                                        <div style="display: flex; justify-content: space-between; align-items: flex-start; padding: 6px 8px 6px 12px; margin-bottom: 2px; gap: 20px;">
                                            <span style="flex: 1; text-align: left;">\${cleanDesc(tx.description)} (\${tx.quantity} \${tx.unit})</span>
                                            <strong style="flex-shrink: 0; text-align: right; white-space: nowrap;">\${formatRupiah(tx.total)}</strong>
                                        </div>\`).join('')}
                                    </div>\`;
                                    });`;

g = g.substring(0, bs) + newBlock + g.substring(be);
fs.writeFileSync('generate.js', g);
console.log('Replaced');