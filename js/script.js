/* ============================================================
   SECUREBANKING TRANSMIT — MATH SIMULATION ENGINE
   Simulasi Enkripsi Pesan & Kalkulator Fungsi Komposisi/Invers
   ============================================================ */

(function () {
  'use strict';

  // Helper selektor elemen
  const $ = (id) => document.getElementById(id);

  /* -----------------------------------------------------------
     1. FORMATTER & MATEMATIKA DASAR
     ----------------------------------------------------------- */

  /**
   * Format angka untuk menghindari artefak floating point (misal: 0.0000000000001).
   */
  function formatNumber(num) {
    if (Math.abs(num) < 1e-10) num = 0;
    // Maksimal 8 digit desimal, hilangkan trailing zeros
    return Number(num.toFixed(8)).toString();
  }

  /**
   * Representasi string fungsi linear: m*x + n
   * Contoh: "8x + 5", "x - 3", "-2x", "5"
   */
  function formatLinear(m, n) {
    let result = '';

    if (Math.abs(m) > 1e-10) {
      if (Math.abs(m - 1) < 1e-10) {
        result = 'x';
      } else if (Math.abs(m + 1) < 1e-10) {
        result = '−x';
      } else {
        result = formatNumber(m) + 'x';
      }
    }

    if (Math.abs(n) > 1e-10) {
      if (result) {
        result += ` ${n > 0 ? '+' : '−'} ${formatNumber(Math.abs(n))}`;
      } else {
        result = formatNumber(n);
      }
    }

    return result || '0';
  }

  /**
   * Representasi string fungsi invers: (x - n) / m
   */
  function formatInverse(m, n) {
    if (Math.abs(m) < 1e-10) {
      return 'Tidak memiliki invers (gradien = 0)';
    }
    const sign = n > 0 ? '−' : '+';
    const absN = formatNumber(Math.abs(n));
    return `(x ${sign} ${absN}) / ${formatNumber(m)}`;
  }

  /**
   * Aturan Konversi Karakter ke Angka:
   * - Spasi = 0
   * - Huruf Kapital A..Z = 1..26
   * - Huruf Kecil a..z = -1..-26
   */
  function charToCode(ch) {
    if (ch === ' ') return 0;
    if (ch >= 'A' && ch <= 'Z') return ch.charCodeAt(0) - 64;
    if (ch >= 'a' && ch <= 'z') return -(ch.charCodeAt(0) - 96);
    return null; // Karakter tidak didukung
  }

  /**
   * Aturan Konversi Angka Kembali ke Huruf
   */
  function codeToChar(num, originalChar) {
    num = Math.round(num * 1e8) / 1e8;
    if (originalChar === ' ') return ' ';
    if (originalChar >= 'A' && originalChar <= 'Z' && num >= 1 && num <= 26 && Number.isInteger(num)) {
      return String.fromCharCode(64 + num);
    }
    if (originalChar >= 'a' && originalChar <= 'z' && num <= -1 && num >= -26 && Number.isInteger(num)) {
      return String.fromCharCode(96 + Math.abs(num));
    }
    return `[${formatNumber(num)}]`;
  }

  /* -----------------------------------------------------------
     2. BAGIAN 01: ENKRIPSI & DEKRIPSI PESAN
     ----------------------------------------------------------- */

  function processCipher() {
    const messageInput = $('message').value;
    const a = Number($('a').value);
    const b = Number($('b').value);
    const c = Number($('c').value);
    const d = Number($('d').value);
    const errorEl = $('cipherError');
    const successEl = $('successNote');

    // Validasi kelengkapan form
    const inputs = [$('a').value, $('b').value, $('c').value, $('d').value];
    if (!messageInput || inputs.some((val) => !val.trim()) || ![a, b, c, d].every(Number.isFinite)) {
      errorEl.textContent = 'Masukkan pesan dan isi semua parameter angka kunci fungsi (a, b, c, d).';
      errorEl.hidden = false;
      successEl.textContent = '';
      return;
    }

    // Validasi keterbalikan fungsi (invers)
    if (a === 0 || c === 0) {
      errorEl.textContent = 'Parameter a dan c tidak boleh 0, karena fungsi tidak akan memiliki fungsi invers untuk didekripsi.';
      errorEl.hidden = false;
      successEl.textContent = '';
      return;
    }

    // Ubah pesan menjadi deretan angka (x)
    const codeList = [...messageInput].map(charToCode);
    if (codeList.some((code) => code === null)) {
      errorEl.textContent = 'Simulasi ini saat ini hanya mendukung huruf alfabet (A–Z, a–z) dan spasi.';
      errorEl.hidden = false;
      successEl.textContent = '';
      return;
    }

    errorEl.hidden = true;

    // Perhitungan Komposisi (f ∘ g)(x) = f(g(x)) = a(cx + d) + b = ac*x + (ad + b)
    const compSlope = a * c;
    const compConst = a * d + b;

    // Enkripsi tiap angka
    const encryptedNumbers = codeList.map((x) => compSlope * x + compConst);

    // Proses Dekripsi Invers: (f ∘ g)⁻¹(y) = g⁻¹(f⁻¹(y))
    const decryptedNumbers = encryptedNumbers.map((y) => {
      const step1 = (y - b) / a; // f⁻¹(y)
      const step2 = (step1 - d) / c; // g⁻¹(...)
      return step2;
    });

    // Perbarui UI Panel Enkripsi
    $('convertedNumbers').textContent = codeList.map(formatNumber).join(', ');
    $('encryptFormula').textContent = `f(g(x)) = ${formatLinear(compSlope, compConst)}`;
    $('encrypted').textContent = encryptedNumbers.map(formatNumber).join(', ');

    $('finvCipher').textContent = formatInverse(a, b);
    $('ginvCipher').textContent = formatInverse(c, d);
    $('inverseFormula').textContent = `(f ∘ g)⁻¹(x) = ${formatInverse(compSlope, compConst)}`;

    // Buat langkah perincian dekripsi
    $('decryptSteps').innerHTML = encryptedNumbers.map((y, idx) => {
      const valY = formatNumber(y);
      const afterF = formatNumber((y - b) / a);
      const afterG = formatNumber(decryptedNumbers[idx]);
      return `<div>
        <b>${idx + 1}. Angka ciphertext = ${valY}</b><br>
        1) Terapkan f⁻¹(${valY}) = (${valY} − ${formatNumber(b)}) / ${formatNumber(a)} = ${afterF}<br>
        2) Terapkan g⁻¹(${afterF}) = (${afterF} − ${formatNumber(d)}) / ${formatNumber(c)} = <b>${afterG}</b>
      </div>`;
    }).join('');

    // Rekonstruksi pesan asli
    const decodedMessage = decryptedNumbers.map((num, idx) => codeToChar(num, messageInput[idx])).join('');
    $('decrypted').textContent = decodedMessage;
    successEl.textContent = '✓ Pesan berhasil didekripsi menggunakan fungsi invers bertingkat g⁻¹(f⁻¹(x)).';
  }

  // Tombol salin hasil enkripsi
  const copyBtn = $('copyBtn');
  if (copyBtn) {
    copyBtn.onclick = async () => {
      const textToCopy = $('encrypted').textContent;
      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Tersalin ✓';
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      } catch (e) {
        copyBtn.textContent = 'Salin manual: ' + textToCopy;
      }
    };
  }

  /* -----------------------------------------------------------
     3. BAGIAN 02: KALKULATOR FUNGSI & LANGKAH PENJELASAN
     ----------------------------------------------------------- */

  function processCalculator() {
    const a = Number($('ca').value);
    const b = Number($('cb').value);
    const c = Number($('cc').value);
    const d = Number($('cd').value);
    const errorEl = $('functionError');

    const inputs = [$('ca').value, $('cb').value, $('cc').value, $('cd').value];
    if (inputs.some((val) => !val.trim()) || ![a, b, c, d].every(Number.isFinite)) {
      errorEl.textContent = 'Harap periksa kolom input: semua nilai fungsi harus berupa angka valid.';
      errorEl.hidden = false;
      return;
    }

    // Komposisi f(g(x)) = a(cx + d) + b
    const fgSlope = a * c;
    const fgConst = a * d + b;

    // Komposisi g(f(x)) = c(ax + b) + d
    const gfSlope = c * a;
    const gfConst = c * b + d;

    // Tampilkan pada kartu
    $('fg').textContent = formatLinear(fgSlope, fgConst);
    $('gf').textContent = formatLinear(gfSlope, gfConst);
    $('finv').textContent = formatInverse(a, b);
    $('ginv').textContent = formatInverse(c, d);
    $('fginv').textContent = formatInverse(fgSlope, fgConst);
    $('gfinv').textContent = formatInverse(gfSlope, gfConst);

    const hasZero = a === 0 || c === 0;
    errorEl.hidden = !hasZero;
    if (hasZero) {
      errorEl.textContent = 'Perhatian: Nilai a = 0 atau c = 0 menyebabkan fungsi tidak memiliki invers.';
    }
  }

  // Kamus objek rincian penjelasan langkah matematis
  const detailExplanations = {
    fg: (a, b, c, d) => [
      'Komposisi (f ∘ g)(x)',
      `Rumus: f(g(x)) = a(cx + d) + b<br>
       Substitusi nilai: (${formatNumber(a)}) × (${formatNumber(c)}x + ${formatNumber(d)}) + (${formatNumber(b)})<br>
       Jabarkan: (${formatNumber(a * c)})x + (${formatNumber(a * d)}) + (${formatNumber(b)})<br>
       Hasil akhir: <b>(f ∘ g)(x) = ${formatLinear(a * c, a * d + b)}</b>`
    ],
    gf: (a, b, c, d) => [
      'Komposisi (g ∘ f)(x)',
      `Rumus: g(f(x)) = c(ax + b) + d<br>
       Substitusi nilai: (${formatNumber(c)}) × (${formatNumber(a)}x + ${formatNumber(b)}) + (${formatNumber(d)})<br>
       Jabarkan: (${formatNumber(c * a)})x + (${formatNumber(c * b)}) + (${formatNumber(d)})<br>
       Hasil akhir: <b>(g ∘ f)(x) = ${formatLinear(c * a, c * b + d)}</b>`
    ],
    finv: (a, b) => [
      'Invers f⁻¹(x)',
      `Mulai dari persamaan: y = ${formatLinear(a, b)}<br>
       Tukar variabel x dan y: x = ${formatNumber(a)}y + ${formatNumber(b)}<br>
       Isolasi y: ${formatNumber(a)}y = x − (${formatNumber(b)})<br>
       Hasil akhir: <b>f⁻¹(x) = ${formatInverse(a, b)}</b>`
    ],
    ginv: (a, b, c, d) => [
      'Invers g⁻¹(x)',
      `Mulai dari persamaan: y = ${formatLinear(c, d)}<br>
       Tukar variabel x dan y: x = ${formatNumber(c)}y + ${formatNumber(d)}<br>
       Isolasi y: ${formatNumber(c)}y = x − (${formatNumber(d)})<br>
       Hasil akhir: <b>g⁻¹(x) = ${formatInverse(c, d)}</b>`
    ],
    fginv: (a, b, c, d) => [
      'Invers dari Komposisi (f ∘ g)⁻¹(x)',
      `Fungsi komposisi adalah (f ∘ g)(x) = ${formatLinear(a * c, a * d + b)}.<br>
       Sifat Invers Komposisi: <b>(f ∘ g)⁻¹ = g⁻¹ ∘ f⁻¹</b> (urutan fungsi dibalik).<br>
       Isolasi: y = (${formatNumber(a * c)})x + (${formatNumber(a * d + b)})<br>
       Hasil invers: <b>(f ∘ g)⁻¹(x) = ${formatInverse(a * c, a * d + b)}</b>`
    ],
    gfinv: (a, b, c, d) => [
      'Invers dari Komposisi (g ∘ f)⁻¹(x)',
      `Fungsi komposisi adalah (g ∘ f)(x) = ${formatLinear(c * a, c * b + d)}.<br>
       Sifat Invers Komposisi: <b>(g ∘ f)⁻¹ = f⁻¹ ∘ g⁻¹</b> (urutan fungsi dibalik).<br>
       Isolasi: y = (${formatNumber(c * a)})x + (${formatNumber(c * b + d)})<br>
       Hasil invers: <b>(g ∘ f)⁻¹(x) = ${formatInverse(c * a, c * b + d)}</b>`
    ]
  };

  /* -----------------------------------------------------------
     4. EVENT LISTENERS & INISIALISASI
     ----------------------------------------------------------- */

  function initApp() {
    // Event listener enkripsi
    const encryptBtn = $('encryptBtn');
    if (encryptBtn) {
      encryptBtn.onclick = processCipher;
    }

    const messageInput = $('message');
    if (messageInput) {
      messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') processCipher();
      });
    }

    // Event listener kalkulator
    const calculateBtn = $('calculate');
    if (calculateBtn) {
      calculateBtn.onclick = processCalculator;
    }

    // Event listener klik kartu detail perhitungan
    document.querySelectorAll('[data-detail]').forEach((btn) => {
      btn.onclick = () => {
        const ids = ['ca', 'cb', 'cc', 'cd'];
        if (ids.some((id) => !$(id).value.trim())) return;

        const [a, b, c, d] = ids.map((id) => Number($(id).value));
        const [title, explanation] = detailExplanations[btn.dataset.detail](a, b, c, d);

        $('detailTitle').textContent = title;
        $('detailText').innerHTML = explanation;

        document.querySelectorAll('.resultcard').forEach((card) => {
          card.classList.toggle('selected', card === btn);
        });
      };
    });

    // Jalankan perhitungan awal secara otomatis
    processCipher();
    processCalculator();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    initApp();
  }
})();

