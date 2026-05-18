# ATURAN PENCATATAN KOS UM

## 📋 Aturan Umum

### 1. Format Summary
- **Pisahkan kategori:** Jajan | Material | Upah (Kuli/Tukang/Mandor) | Alat | Struktur Bangunan
- **Jangan gabung** kategori yang berbeda

### 2. Tarif Upah Standar
- **Kuli full day:** Rp 120.000
- **Tukang full day:** Rp 135.000
- **Mandor full day:** Rp 150.000
- **Kuli setengah hari:** Rp 70.000

---

## 🔄 UPAH REPEAT OTOMATIS (BARU!)

### Aturan Default Harian:
**Senin - Sabtu (hari kerja):**
- 3 kuli full day → Rp 360.000
- 1 tukang full day → Rp 135.000
- 1 mandor full day → Rp 150.000
- **Total upah harian default: Rp 645.000**

**Minggu:**
- **LIBUR** → Tidak ada upah pekerja

### Cara Kerja:
1. **Tidak perlu tulis upah setiap hari** - Otomatis tercatat
2. **Hanya tulis kalau ada perubahan:**
   - "Hari ini cuma 2 kuli"
   - "Tambah 1 tukang lagi"
   - "Mandor tidak masuk"
3. **Kalau tidak ada info upah** → Pakai default (3 kuli, 1 tukang, 1 mandor)
4. **Minggu otomatis libur** → Rp 0 upah

### Contoh:

**❌ TIDAK PERLU LAGI:**
```
Senin: 3 kuli, 1 tukang, 1 mandor
Selasa: 3 kuli, 1 tukang, 1 mandor
Rabu: 3 kuli, 1 tukang, 1 mandor
```

**✅ CUKUP TULIS INI:**
```
Senin: Beli semen 500rb
Selasa: (tidak ada transaksi lain)
Rabu: Hari ini cuma 2 kuli
Minggu: (otomatis libur, tidak perlu tulis)
```

---

## 📝 Kategori

### Material
- Paku, besi, semen, pasir, batu bata, dll
- Item kecil yang berulang

### Struktur Bangunan
- Beton, besi beton, rangka besar
- Item besar yang tidak berulang

### Alat
- Linggis, pacul, scaffolding, mixer, dll
- Alat kerja (beli atau sewa)

### Jajan & Minuman
- Roti, kopi, galon, rokok, dll
- Konsumsi pekerja

### Upah
- Kuli, Tukang, Mandor
- **Otomatis tercatat setiap hari kerja (Senin-Sabtu)**
- **Minggu libur (Rp 0)**

---

## 🎯 Reminder

- Kirim transaksi natural: "Beli semen 10 sak 500rb"
- Tidak perlu format khusus
- Saya akan parse otomatis
- **Upah otomatis tercatat, kecuali ada perubahan**
- **Minggu = libur otomatis**
