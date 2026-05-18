const fs = require('fs');
const path = require('path');

// Read data.json
const dataPath = path.join(__dirname, 'data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Helper function to format currency
function formatRupiah(amount) {
    return 'Rp ' + amount.toLocaleString('id-ID');
}

// Helper function to format number with dot separator
function formatNumber(num) {
    return num.toLocaleString('id-ID');
}

// Group transactions by date
const transactionsByDate = {};
data.transactions.forEach(tx => {
    if (!transactionsByDate[tx.date]) {
        transactionsByDate[tx.date] = [];
    }
    transactionsByDate[tx.date].push(tx);
});

// Sort dates
const sortedDates = Object.keys(transactionsByDate).sort();

// Format date to Indonesian
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}

// Calculate category breakdown with details
const categoryDetails = {
    'Struktur Bangunan': [],
    'Upah': { Kuli: [], Tukang: [], Mandor: [] },
    'Material': [],
    'Alat': [],
    'Jajan': []
};

data.transactions.forEach(tx => {
    if (tx.category === 'Upah' && tx.subcategory) {
        if (!categoryDetails.Upah[tx.subcategory]) {
            categoryDetails.Upah[tx.subcategory] = [];
        }
        categoryDetails.Upah[tx.subcategory].push(tx);
    } else {
        const category = tx.category === 'Lain-lain' ? 'Jajan' : tx.category;
        if (!Array.isArray(categoryDetails[category])) {
            categoryDetails[category] = [];
        }
        categoryDetails[category].push(tx);
    }
});

// Generate HTML
const html = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pembangunan Kos UM 2 Lantai</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 20px;
            min-height: 100vh;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            text-align: center;
        }
        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .header p {
            font-size: 1.2em;
            opacity: 0.9;
        }
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            padding: 40px;
            background: #f8f9fa;
        }
        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            text-align: center;
            transition: transform 0.3s;
        }
        .stat-card:hover {
            transform: translateY(-5px);
        }
        .stat-card .icon {
            font-size: 2.5em;
            margin-bottom: 10px;
        }
        .stat-card .label {
            color: #666;
            font-size: 0.9em;
            margin-bottom: 5px;
        }
        .stat-card .value {
            font-size: 1.8em;
            font-weight: bold;
            color: #667eea;
        }
        .content {
            padding: 40px;
        }
        .section {
            margin-bottom: 40px;
        }
        .section h2 {
            color: #333;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 3px solid #667eea;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background: white;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            border-radius: 10px;
            overflow: hidden;
            overflow-x: auto;
            display: block;
        }
        table thead,
        table tbody {
            display: table;
            width: 100%;
            table-layout: fixed;
        }
        th {
            background: #667eea;
            color: white;
            padding: 15px;
            text-align: left;
            font-weight: 600;
        }
        td {
            padding: 15px;
            border-bottom: 1px solid #eee;
        }
        tr:hover {
            background: #f8f9fa;
        }
        .category-breakdown {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .category-card {
            background: white;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
        }
        .category-card h3 {
            color: #667eea;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .category-card .total {
            font-size: 1.8em;
            font-weight: bold;
            color: #333;
            margin-bottom: 10px;
        }
        .category-card .percentage {
            color: #666;
            font-size: 0.9em;
        }
        .item-list {
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        .item {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding: 8px 0;
            color: #666;
            gap: 10px;
        }
        .item span {
            flex: 1;
            word-wrap: break-word;
            overflow-wrap: break-word;
        }
        .item strong {
            flex-shrink: 0;
            white-space: nowrap;
            text-align: right;
            min-width: 120px;
        }
        .collapsible {
            background: #667eea;
            color: white;
            cursor: pointer;
            padding: 18px;
            width: 100%;
            border: none;
            text-align: left;
            outline: none;
            font-size: 1.1em;
            font-weight: 600;
            border-radius: 10px;
            transition: 0.3s;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .collapsible:hover {
            background: #764ba2;
        }
        .collapsible:after {
            content: '\\25BC';
            font-size: 0.8em;
            transition: transform 0.3s;
        }
        .collapsible.active:after {
            transform: rotate(-180deg);
        }
        .collapsible-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
        }
        .collapsible-content.active {
            max-height: 5000px;
            transition: max-height 0.5s ease-in;
        }
        .date-collapsible {
            background: white;
            padding: 20px 25px;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            margin-bottom: 20px;
            cursor: pointer;
            transition: 0.3s;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .date-collapsible:hover {
            box-shadow: 0 8px 20px rgba(0,0,0,0.15);
        }
        .date-collapsible h3 {
            color: #667eea;
            font-size: 1.3em;
            margin: 0;
        }
        .date-collapsible .arrow {
            color: #667eea;
            font-size: 1.2em;
            transition: transform 0.3s;
        }
        .date-collapsible.active .arrow {
            transform: rotate(-180deg);
        }
        .date-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
            background: white;
            border-radius: 0 0 15px 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            margin-top: -15px;
            margin-bottom: 20px;
        }
        .date-content.active {
            max-height: 3000px;
            transition: max-height 0.5s ease-in;
            padding: 0 25px 25px 25px;
        }
        .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            color: #666;
            font-size: 0.9em;
        }
        @media (max-width: 768px) {
            .header h1 {
                font-size: 1.8em;
            }
            .stats {
                grid-template-columns: 1fr;
            }
            .category-breakdown {
                grid-template-columns: 1fr;
            }
            table {
                font-size: 0.85em;
            }
            th, td {
                padding: 10px 5px;
            }
            .item strong {
                min-width: 100px;
                font-size: 0.9em;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏗️ Pembangunan Kos UM 2 Lantai</h1>
            <p>Periode: ${formatDate(data.start_date)} - Sekarang</p>
        </div>

        <div class="stats">
            <div class="stat-card">
                <div class="icon">💰</div>
                <div class="label">Total Pengeluaran</div>
                <div class="value">Rp ${(data.summary.total_spent / 1000000).toFixed(2)} Jt</div>
            </div>
            <div class="stat-card">
                <div class="icon">🏗️</div>
                <div class="label">Struktur Bangunan</div>
                <div class="value">${((data.summary.by_category['Struktur Bangunan'] / data.summary.total_spent) * 100).toFixed(1)}%</div>
            </div>
            <div class="stat-card">
                <div class="icon">👷</div>
                <div class="label">Upah Pekerja</div>
                <div class="value">${((data.summary.by_category.Upah / data.summary.total_spent) * 100).toFixed(1)}%</div>
            </div>
            <div class="stat-card">
                <div class="icon">📦</div>
                <div class="label">Material & Alat</div>
                <div class="value">${(((data.summary.by_category.Material + data.summary.by_category.Alat) / data.summary.total_spent) * 100).toFixed(1)}%</div>
            </div>
        </div>

        <div class="content">
            <div class="section">
                <h2>📊 Breakdown per Kategori</h2>
                <div class="category-breakdown">
                    ${generateCategoryCards()}
                </div>
            </div>

            <div class="section">
                <h2>📅 Rincian per Tanggal</h2>
                ${generateDateSections()}
            </div>

            <div class="section">
                <button class="collapsible">📋 List Semua Transaksi</button>
                <div class="collapsible-content">
                <table>
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Tanggal</th>
                            <th>Kategori</th>
                            <th>Deskripsi</th>
                            <th>Qty</th>
                            <th>Harga Satuan</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${generateTransactionRows()}
                    </tbody>
                </table>
                </div>
            </div>

            <div class="section">
                <h2>💼 Tarif Upah Standar</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Posisi</th>
                            <th>Tarif per Hari</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Kuli</td>
                            <td><strong>${formatRupiah(data.wage_rates.kuli_full_day)}</strong></td>
                        </tr>
                        <tr>
                            <td>Tukang</td>
                            <td><strong>${formatRupiah(data.wage_rates.tukang_full_day)}</strong></td>
                        </tr>
                        <tr>
                            <td>Mandor</td>
                            <td><strong>${formatRupiah(data.wage_rates.mandor_full_day)}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="footer">
            <p>Terakhir diupdate: ${formatDate(new Date().toISOString().split('T')[0])} | Data otomatis tersinkronisasi</p>
        </div>
    </div>

    <script>
        // Collapsible functionality for List Semua Transaksi
        var coll = document.getElementsByClassName("collapsible");
        for (var i = 0; i < coll.length; i++) {
            coll[i].addEventListener("click", function() {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                content.classList.toggle("active");
            });
        }

        // Collapsible functionality for Date sections
        var dateColl = document.getElementsByClassName("date-collapsible");
        for (var i = 0; i < dateColl.length; i++) {
            dateColl[i].addEventListener("click", function() {
                this.classList.toggle("active");
                var content = this.nextElementSibling;
                content.classList.toggle("active");
            });
        }
    </script>
</body>
</html>`;

function generateCategoryCards() {
    let cards = '';
    
    // Struktur Bangunan
    if (data.summary.by_category['Struktur Bangunan'] > 0) {
        const percentage = ((data.summary.by_category['Struktur Bangunan'] / data.summary.total_spent) * 100).toFixed(1);
        cards += `
                    <div class="category-card">
                        <h3><span>🏗️</span> Struktur Bangunan</h3>
                        <div class="total">${formatRupiah(data.summary.by_category['Struktur Bangunan'])}</div>
                        <div class="percentage">${percentage}% dari total</div>
                        <div class="item-list">
                            ${categoryDetails['Struktur Bangunan'].map(tx => `
                            <div class="item">
                                <span>${tx.description} (${tx.quantity} ${tx.unit})</span>
                                <strong>${formatRupiah(tx.total)}</strong>
                            </div>`).join('')}
                        </div>
                    </div>`;
    }
    
    // Upah
    if (data.summary.by_category.Upah > 0) {
        const percentage = ((data.summary.by_category.Upah / data.summary.total_spent) * 100).toFixed(1);
        const kuliTotal = categoryDetails.Upah.Kuli.reduce((sum, tx) => sum + tx.total, 0);
        const tukangTotal = categoryDetails.Upah.Tukang.reduce((sum, tx) => sum + tx.total, 0);
        const mandorTotal = categoryDetails.Upah.Mandor.reduce((sum, tx) => sum + tx.total, 0);
        
        cards += `
                    <div class="category-card">
                        <h3><span>👷</span> Upah Pekerja</h3>
                        <div class="total">${formatRupiah(data.summary.by_category.Upah)}</div>
                        <div class="percentage">${percentage}% dari total</div>
                        <div class="item-list">
                            ${kuliTotal > 0 ? `<div class="item"><span>Kuli</span><strong>${formatRupiah(kuliTotal)}</strong></div>` : ''}
                            ${tukangTotal > 0 ? `<div class="item"><span>Tukang</span><strong>${formatRupiah(tukangTotal)}</strong></div>` : ''}
                            ${mandorTotal > 0 ? `<div class="item"><span>Mandor</span><strong>${formatRupiah(mandorTotal)}</strong></div>` : ''}
                        </div>
                    </div>`;
    }
    
    // Material
    if (data.summary.by_category.Material > 0) {
        const percentage = ((data.summary.by_category.Material / data.summary.total_spent) * 100).toFixed(1);
        cards += `
                    <div class="category-card">
                        <h3><span>🧱</span> Material</h3>
                        <div class="total">${formatRupiah(data.summary.by_category.Material)}</div>
                        <div class="percentage">${percentage}% dari total</div>
                        <div class="item-list">
                            ${categoryDetails.Material.map(tx => `
                            <div class="item">
                                <span>${tx.description} (${tx.quantity}${tx.unit})</span>
                                <strong>${formatRupiah(tx.total)}</strong>
                            </div>`).join('')}
                        </div>
                    </div>`;
    }
    
    // Alat
    if (data.summary.by_category.Alat > 0) {
        const percentage = ((data.summary.by_category.Alat / data.summary.total_spent) * 100).toFixed(1);
        cards += `
                    <div class="category-card">
                        <h3><span>🔧</span> Alat</h3>
                        <div class="total">${formatRupiah(data.summary.by_category.Alat)}</div>
                        <div class="percentage">${percentage}% dari total</div>
                        <div class="item-list">
                            ${categoryDetails.Alat.map(tx => `
                            <div class="item">
                                <span>${tx.description}</span>
                                <strong>${formatRupiah(tx.total)}</strong>
                            </div>`).join('')}
                        </div>
                    </div>`;
    }
    
    // Jajan & Minuman
    if (data.summary.by_category.Jajan > 0) {
        const percentage = ((data.summary.by_category.Jajan / data.summary.total_spent) * 100).toFixed(1);
        cards += `
                    <div class="category-card">
                        <h3><span>🍔</span> Jajan & Minuman</h3>
                        <div class="total">${formatRupiah(data.summary.by_category.Jajan)}</div>
                        <div class="percentage">${percentage}% dari total</div>
                        <div class="item-list">
                            ${categoryDetails.Jajan.map(tx => `
                            <div class="item">
                                <span>${tx.description}</span>
                                <strong>${formatRupiah(tx.total)}</strong>
                            </div>`).join('')}
                        </div>
                    </div>`;
    }
    
    return cards;
}

function generateDateSections() {
    let sections = '';
    
    sortedDates.forEach(date => {
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
        
        sections += `
                <div class="date-collapsible">
                    <h3>📆 ${formatDate(date)}</h3>
                    <span class="arrow">▼</span>
                </div>
                <div class="date-content">`;
        
        // Add work description if exists
        if (workDescription) {
            sections += `
                    <div style="padding: 15px 20px; margin-bottom: 20px; background: #f0f7ff; border-left: 4px solid #667eea; border-radius: 8px;">
                        <h4 style="color: #667eea; margin-bottom: 8px; font-size: 1em;">📋 Pekerjaan Hari Ini:</h4>
                        <p style="color: #333; margin: 0; line-height: 1.6;">${workDescription}</p>
                    </div>`;
        }
        
        // Generate category sections
        Object.keys(byCategory).forEach(category => {
            const icon = {
                'Jajan': '🍔',
                'Material': '🧱',
                'Upah': '💰',
                'Alat': '🔧',
                'Struktur Bangunan': '🏗️'
            }[category] || '📦';
            
            sections += `
                    <div style="padding-left: 20px; margin-bottom: 20px;">
                        <h4 style="color: #764ba2; margin-bottom: 10px;">${icon} ${category}</h4>`;
            
            byCategory[category].forEach(tx => {
                let desc = tx.description;
                if (tx.subcategory) {
                    desc = `${tx.quantity} ${tx.subcategory.toLowerCase()} ${tx.description.includes('full day') ? 'full day' : tx.description} (${tx.quantity} orang @ ${formatRupiah(tx.price_per_unit)})`;
                } else if (tx.quantity > 1 || tx.unit !== 'item') {
                    desc = `${tx.description} (${tx.quantity} ${tx.unit}${tx.price_per_unit ? ' @ ' + formatRupiah(tx.price_per_unit) : ''})`;
                }
                
                sections += `
                        <div class="item">
                            <span>${desc}</span>
                            <strong>${formatRupiah(tx.total)}</strong>
                        </div>`;
            });
            
            sections += `
                    </div>`;
        });
        
        sections += `
                    <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #667eea; text-align: right;">
                        <strong style="font-size: 1.2em; color: #667eea;">Subtotal: ${formatRupiah(dateTotal)}</strong>
                    </div>
                </div>`;
    });
    
    return sections;
}

function generateTransactionRows() {
    return data.transactions.map((tx, index) => {
        const category = tx.subcategory ? `${tx.category} - ${tx.subcategory}` : tx.category;
        return `
                        <tr>
                            <td>${index + 1}</td>
                            <td>${formatDate(tx.date)}</td>
                            <td>${category}</td>
                            <td>${tx.description}</td>
                            <td>${tx.quantity} ${tx.unit}</td>
                            <td>${formatRupiah(tx.price_per_unit)}</td>
                            <td><strong>${formatRupiah(tx.total)}</strong></td>
                        </tr>`;
    }).join('');
}

// Write HTML file
fs.writeFileSync(path.join(__dirname, 'index.html'), html);
console.log('✅ index.html generated successfully!');
