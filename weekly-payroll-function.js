// Add this function to generate.js after generateFundingSourceBreakdown

function generateWeeklyPayroll() {
    // Get all wage transactions
    const wageTransactions = data.transactions.filter(tx => tx.category === 'Upah');
    
    // Group by week (Senin-Sabtu)
    const weeks = {};
    wageTransactions.forEach(tx => {
        const date = new Date(tx.date);
        const dayOfWeek = date.getDay(); // 0=Sunday, 1=Monday, 6=Saturday
        
        // Find the Saturday of this week
        const daysUntilSaturday = dayOfWeek === 0 ? 6 : (6 - dayOfWeek);
        const saturday = new Date(date);
        saturday.setDate(date.getDate() + daysUntilSaturday);
        const saturdayStr = saturday.toISOString().split('T')[0];
        
        if (!weeks[saturdayStr]) {
            weeks[saturdayStr] = {
                kuli: [],
                tukang: [],
                mandor: []
            };
        }
        
        if (tx.subcategory) {
            const key = tx.subcategory.toLowerCase();
            if (weeks[saturdayStr][key]) {
                weeks[saturdayStr][key].push(tx);
            }
        }
    });
    
    // Sort weeks
    const sortedWeeks = Object.keys(weeks).sort().reverse();
    
    let html = '';
    sortedWeeks.forEach((saturdayStr, index) => {
        const week = weeks[saturdayStr];
        const saturday = new Date(saturdayStr);
        
        // Calculate Monday of this week
        const monday = new Date(saturday);
        monday.setDate(saturday.getDate() - 5);
        
        const kuliTotal = week.kuli.reduce((sum, tx) => sum + tx.total, 0);
        const tukangTotal = week.tukang.reduce((sum, tx) => sum + tx.total, 0);
        const mandorTotal = week.mandor.reduce((sum, tx) => sum + tx.total, 0);
        const weekTotal = kuliTotal + tukangTotal + mandorTotal;
        
        const kuliDays = week.kuli.length;
        const tukangDays = week.tukang.length;
        const mandorDays = week.mandor.length;
        
        html += `
                <div style="background: white; padding: 25px; border-radius: 15px; box-shadow: 0 5px 15px rgba(0,0,0,0.1); margin-bottom: 20px;">
                    <h3 style="color: #667eea; margin-bottom: 15px; font-size: 1.2em;">
                        Minggu ${sortedWeeks.length - index} (${formatDate(monday.toISOString().split('T')[0])} - ${formatDate(saturdayStr)})
                    </h3>
                    <div style="padding-left: 20px;">
                        ${kuliTotal > 0 ? `<div class="item"><span>Kuli (${kuliDays} hari)</span><strong>${formatRupiah(kuliTotal)}</strong></div>` : ''}
                        ${tukangTotal > 0 ? `<div class="item"><span>Tukang (${tukangDays} hari)</span><strong>${formatRupiah(tukangTotal)}</strong></div>` : ''}
                        ${mandorTotal > 0 ? `<div class="item"><span>Mandor (${mandorDays} hari)</span><strong>${formatRupiah(mandorTotal)}</strong></div>` : ''}
                    </div>
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #667eea; text-align: right;">
                        <strong style="font-size: 1.2em; color: #667eea;">Total Gajian: ${formatRupiah(weekTotal)}</strong>
                        <div style="color: #666; font-size: 0.9em; margin-top: 5px;">Dibayar Sabtu ${formatDate(saturdayStr)}</div>
                    </div>
                </div>`;
    });
    
    return html;
}
