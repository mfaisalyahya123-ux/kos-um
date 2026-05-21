function generateWeeklyPayroll() {
    const wageTransactions = data.transactions.filter(tx => tx.category === 'Upah');
    const weeks = {};
    
    // Group by week
    wageTransactions.forEach(tx => {
        const date = new Date(tx.date);
        const dayOfWeek = date.getDay();
        const daysUntilSaturday = dayOfWeek === 0 ? 6 : (6 - dayOfWeek);
        const saturday = new Date(date);
        saturday.setDate(date.getDate() + daysUntilSaturday);
        const saturdayStr = saturday.toISOString().split('T')[0];
        
        if (!weeks[saturdayStr]) {
            weeks[saturdayStr] = { kuli: [], tukang: [], mandor: [] };
        }
        
        if (tx.subcategory) {
            const key = tx.subcategory.toLowerCase();
            if (weeks[saturdayStr][key]) {
                weeks[saturdayStr][key].push(tx);
            }
        }
    });
    
    const sortedWeeks = Object.keys(weeks).sort().reverse();
    let html = '';
    
    sortedWeeks.forEach((saturdayStr, index) => {
        const week = weeks[saturdayStr];
        const saturday = new Date(saturdayStr);
        const monday = new Date(saturday);
        monday.setDate(saturday.getDate() - 5);
        
        // Calculate totals
        const kuliTotal = week.kuli.reduce((sum, tx) => sum + tx.total, 0);
        const tukangTotal = week.tukang.reduce((sum, tx) => sum + tx.total, 0);
        const mandorTotal = week.mandor.reduce((sum, tx) => sum + tx.total, 0);
        const weekTotal = kuliTotal + tukangTotal + mandorTotal;
        
        // Count total attendance (sum of quantities)
        const kuliAbsensi = week.kuli.reduce((sum, tx) => sum + tx.quantity, 0);
        const tukangAbsensi = week.tukang.reduce((sum, tx) => sum + tx.quantity, 0);
        const mandorAbsensi = week.mandor.reduce((sum, tx) => sum + tx.quantity, 0);
        
        // Format tanggal singkat
        const mondayDate = monday.getDate();
        const saturdayDate = saturday.getDate();
        const monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][saturday.getMonth()];
        
        html += `
                <div class="category-card">
                    <div class="category-header">
                        <h3>
                            <span>📅 Minggu ${sortedWeeks.length - index} (${mondayDate}-${saturdayDate} ${monthName})</span>
                            <span class="arrow">▼</span>
                        </h3>
                        <div class="total">${formatRupiah(weekTotal)}</div>
                        <div class="percentage">Dibayar Sabtu ${saturdayDate} ${monthName}</div>
                    </div>
                    <div class="category-details">
                        <div class="item-list" style="padding: 0 25px 25px 25px;">`;
        
        // Kuli section with nested details
        if (kuliTotal > 0) {
            html += `
                            <div class="category-card" style="margin-bottom: 10px;">
                                <div class="category-header" style="padding: 10px 15px;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                                        <span>Kuli (${kuliAbsensi} Absensi × ${formatRupiah(data.wage_rates.kuli_full_day)})</span>
                                        <strong>${formatRupiah(kuliTotal)}</strong>
                                        <span class="arrow" style="margin-left: 10px;">▼</span>
                                    </div>
                                </div>
                                <div class="category-details">
                                    <div style="padding: 10px 15px; font-size: 0.9em;">
                                        ${week.kuli.map(tx => `
                                        <div class="item" style="padding: 5px 0;">
                                            <span>${formatDate(tx.date)}: ${tx.quantity} kuli</span>
                                            <strong>${formatRupiah(tx.total)}</strong>
                                        </div>`).join('')}
                                    </div>
                                </div>
                            </div>`;
        }
        
        // Tukang section with nested details
        if (tukangTotal > 0) {
            html += `
                            <div class="category-card" style="margin-bottom: 10px;">
                                <div class="category-header" style="padding: 10px 15px;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                                        <span>Tukang (${tukangAbsensi} Absensi × ${formatRupiah(data.wage_rates.tukang_full_day)})</span>
                                        <strong>${formatRupiah(tukangTotal)}</strong>
                                        <span class="arrow" style="margin-left: 10px;">▼</span>
                                    </div>
                                </div>
                                <div class="category-details">
                                    <div style="padding: 10px 15px; font-size: 0.9em;">
                                        ${week.tukang.map(tx => `
                                        <div class="item" style="padding: 5px 0;">
                                            <span>${formatDate(tx.date)}: ${tx.quantity} tukang</span>
                                            <strong>${formatRupiah(tx.total)}</strong>
                                        </div>`).join('')}
                                    </div>
                                </div>
                            </div>`;
        }
        
        // Mandor section with nested details
        if (mandorTotal > 0) {
            html += `
                            <div class="category-card" style="margin-bottom: 10px;">
                                <div class="category-header" style="padding: 10px 15px;">
                                    <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                                        <span>Mandor (${mandorAbsensi} Absensi × ${formatRupiah(data.wage_rates.mandor_full_day)})</span>
                                        <strong>${formatRupiah(mandorTotal)}</strong>
                                        <span class="arrow" style="margin-left: 10px;">▼</span>
                                    </div>
                                </div>
                                <div class="category-details">
                                    <div style="padding: 10px 15px; font-size: 0.9em;">
                                        ${week.mandor.map(tx => `
                                        <div class="item" style="padding: 5px 0;">
                                            <span>${formatDate(tx.date)}: ${tx.quantity} mandor</span>
                                            <strong>${formatRupiah(tx.total)}</strong>
                                        </div>`).join('')}
                                    </div>
                                </div>
                            </div>`;
        }
        
        html += `
                        </div>
                    </div>
                </div>`;
    });
    
    return html;
}
