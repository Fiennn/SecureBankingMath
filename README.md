# SecureBanking Transmit — MathFunction Lab
> **Simulasi Protokol Enkripsi Matematika Berbasis Fungsi Komposisi & Invers (100% Standalone / Tanpa Database)**

Website interaktif ini memodelkan sistem pengiriman pesan rahasia antara **Perusahaan A** (pengirim) dan **Bank Mitra** (penerima).
Semua perhitungan berjalan langsung di memori browser secara real-time **tanpa database sama sekali** (tidak membutuhkan SQL, IndexedDB, maupun koneksi internet/server luar).

---

## 🚀 Cara Menjalankan Website

### Cara 1: Sekali Klik (Windows)
Klik dua kali file `start.bat`. Browser default otomatis membuka `http://localhost:3000`.

### Cara 2: Langsung Buka di Browser (Tanpa Server)
Cukup **klik dua kali** file `index.html` untuk langsung membukanya di browser favoritmu (Google Chrome, Microsoft Edge, Firefox, dll).

### Cara 3: Terminal (Node.js)
```bash
npm start
```
*atau:*
```bash
node server.js
```

### Cara 4: VS Code Live Server
Klik kanan `index.html` > pilih **Open with Live Server**.

---

## 📁 Struktur Folder Proyek (Bersih & Terstruktur)

```text
SecureBanking_MathFunctionLab/
├── index.html            # Halaman utama website simulasi matematika
├── server.js             # Local web server ringan (opsional)
├── package.json          # Script npm
├── start.bat             # Launcher 1-klik untuk Windows
├── README.md             # Dokumentasi lengkap proyek
│
├── css/
│   └── style.css         # Desain tampilan modern & responsif
│
└── js/
    └── script.js         # Logika matematika (enkripsi, dekripsi, kalkulator)
```

---

## 🧮 Alur Matematika

1. **Konversi Huruf ke Angka**:
   - Spasi = `0`
   - Huruf kapital `A`–`Z` = `1` sampai `26`
   - Huruf kecil `a`–`z` = `-1` sampai `-26`

2. **Kunci Fungsi**:
   - $f(x) = ax + b$
   - $g(x) = cx + d$
   *(Syarat: $a \neq 0$ dan $c \neq 0$ agar dapat dibalik/invers).*

3. **Enkripsi (Fungsi Komposisi)**:
   $$(f \circ g)(x) = f(g(x)) = a(cx + d) + b = acx + (ad + b)$$

4. **Dekripsi (Fungsi Invers)**:
   $$(f \circ g)^{-1}(x) = g^{-1}(f^{-1}(x))$$
   - $f^{-1}(x) = \frac{x - b}{a}$
   - $g^{-1}(x) = \frac{x - d}{c}$

---

## 💡 Fitur Utama

- **Ruang Pengiriman**: Mengubah teks menjadi kode angka, mengenkripsi dengan komposisi $(f \circ g)(x)$, dan membuktikan proses dekripsi langkah demi langkah.
- **Kalkulator Fungsi Komposisi & Invers**: Menghitung $(f \circ g)$, $(g \circ f)$, $f^{-1}$, $g^{-1}$, $(f \circ g)^{-1}$, dan $(g \circ f)^{-1}$ lengkap dengan penjabaran aljabar.
- **Salin Otomatis**: Tombol salin hasil enkripsi dengan satu klik.
- **100% Client-side**: Ringan, cepat, aman, dan tanpa ketergantungan database apapun.
