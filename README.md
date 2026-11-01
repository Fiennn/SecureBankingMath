# SecureBanking Transmit — MathFunction Lab (Next.js Edition)
> **Simulasi Protokol Enkripsi Matematika Berbasis Fungsi Komposisi & Invers (Built with Next.js App Router · 100% Standalone Tanpa Database)**

Website interaktif ini memodelkan sistem pengiriman pesan rahasia antara **Perusahaan A** (pengirim) dan **Bank Mitra** (penerima).
Dibangun menggunakan **Next.js (App Router)** dan siap dideploy langsung ke **Vercel** dengan 1 klik!

---

## ⚡ Fitur Utama

- **Framework Next.js**: Menggunakan App Router dan React Client Components yang reaktif dan modern.
- **Support Vercel Penuh**: Dioptimalkan untuk deployment di Vercel tanpa konfigurasi rumit.
- **100% Tanpa Database**: Seluruh kalkulasi matematika dihitung secara *real-time* langsung di memori browser (tidak memerlukan SQL, MongoDB, IndexedDB, maupun koneksi database apapun).
- **Desain Modern & Responsif**: Tampilan antarmuka profesional yang nyaman dibuka di desktop, tablet, maupun ponsel.

---

## 🚀 Cara Menjalankan Secara Lokal

1. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
2. Buka browser di [http://localhost:3000](http://localhost:3000).

*(Di Windows, Anda juga bisa langsung klik dua kali file `start.bat`).*

---

## ☁️ Cara Deploy ke Vercel

1. Buka [vercel.com](https://vercel.com) dan login dengan akun GitHub kamu.
2. Klik tombol **"Add New..."** > pilih **"Project"**.
3. Import repository **`SecureBankingMath`**.
4. Vercel akan otomatis mengenali project ini sebagai **Next.js**.
5. Klik **"Deploy"** dan website kamu akan langsung aktif!

---

## 📁 Struktur Folder Proyek

```text
SecureBanking_MathFunctionLab/
├── app/
│   ├── layout.js         # Root layout & metadata Next.js
│   ├── page.js           # Komponen utama simulasi matematika & kalkulator
│   └── globals.css       # Stylesheet global Next.js
├── next.config.js        # Konfigurasi Next.js
├── package.json          # Dependencies Next.js & React
├── package-lock.json     # Lockfile npm
├── start.bat             # Launcher 1-klik untuk local dev
└── README.md             # Dokumentasi proyek
```

---

## 🧮 Alur Matematika

1. **Konversi Huruf ke Angka**:
   - Spasi = `0`
   - Huruf kapital `A`–`Z` = `1` sampai `26`
   - Huruf kecil `a`–`z` = `-1` sampai `-26`

2. **Kunci Fungsi Linear**:
   - $f(x) = ax + b$
   - $g(x) = cx + d$
   *(Syarat: $a \neq 0$ dan $c \neq 0$ agar fungsi memiliki invers).*

3. **Enkripsi (Fungsi Komposisi)**:
   $$(f \circ g)(x) = f(g(x)) = a(cx + d) + b = acx + (ad + b)$$

4. **Dekripsi (Fungsi Invers)**:
   $$(f \circ g)^{-1}(x) = g^{-1}(f^{-1}(x))$$
   - $f^{-1}(x) = \frac{x - b}{a}$
   - $g^{-1}(x) = \frac{x - d}{c}$
