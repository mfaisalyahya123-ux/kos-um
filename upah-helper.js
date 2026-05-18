// Helper untuk auto-generate upah harian
// Aturan:
// - Senin-Sabtu: 3 kuli, 1 tukang, 1 mandor (default)
// - Minggu: LIBUR (Rp 0)
// - Hanya catat kalau ada perubahan dari default

const DEFAULT_UPAH = {
    kuli: { count: 3, rate: 120000 },
    tukang: { count: 1, rate: 135000 },
    mandor: { count: 1, rate: 150000 }
};

function isWeekend(dateStr) {
    const date = new Date(dateStr);
    return date.getDay() === 0; // 0 = Minggu
}

function shouldAutoAddUpah(date, existingTransactions) {
    // Cek apakah hari Minggu
    if (isWeekend(date)) {
        return false; // Minggu libur
    }
    
    // Cek apakah sudah ada upah manual untuk tanggal ini
    const hasManualUpah = existingTransactions.some(tx => 
        tx.date === date && tx.category === 'Upah'
    );
    
    return !hasManualUpah; // Auto-add kalau belum ada upah manual
}

function generateDefaultUpah(date, nextId) {
    return [
        {
            id: nextId,
            date: date,
            category: 'Upah',
            subcategory: 'Kuli',
            description: `${DEFAULT_UPAH.kuli.count} kuli full day`,
            quantity: DEFAULT_UPAH.kuli.count,
            unit: 'orang',
            price_per_unit: DEFAULT_UPAH.kuli.rate,
            total: DEFAULT_UPAH.kuli.count * DEFAULT_UPAH.kuli.rate,
            notes: 'auto-generated'
        },
        {
            id: nextId + 1,
            date: date,
            category: 'Upah',
            subcategory: 'Tukang',
            description: `${DEFAULT_UPAH.tukang.count} tukang full day`,
            quantity: DEFAULT_UPAH.tukang.count,
            unit: 'orang',
            price_per_unit: DEFAULT_UPAH.tukang.rate,
            total: DEFAULT_UPAH.tukang.count * DEFAULT_UPAH.tukang.rate,
            notes: 'auto-generated'
        },
        {
            id: nextId + 2,
            date: date,
            category: 'Upah',
            subcategory: 'Mandor',
            description: `${DEFAULT_UPAH.mandor.count} mandor full day`,
            quantity: DEFAULT_UPAH.mandor.count,
            unit: 'orang',
            price_per_unit: DEFAULT_UPAH.mandor.rate,
            total: DEFAULT_UPAH.mandor.count * DEFAULT_UPAH.mandor.rate,
            notes: 'auto-generated'
        }
    ];
}

module.exports = {
    DEFAULT_UPAH,
    isWeekend,
    shouldAutoAddUpah,
    generateDefaultUpah
};
