'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from './context/AuthContext';

// Formatter angka desimal
function formatNumber(num) {
  const n = Number(num);
  if (!Number.isFinite(n)) return '0';
  if (Math.abs(n) < 1e-10) return '0';
  return Number(n.toFixed(8)).toString();
}

// Representasi linear mx + n
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

// Representasi fungsi invers
function formatInverse(m, n) {
  if (Math.abs(m) < 1e-10) {
    return 'Tidak memiliki invers (gradien = 0)';
  }
  const sign = n > 0 ? '−' : '+';
  const absN = formatNumber(Math.abs(n));
  return `(x ${sign} ${absN}) / ${formatNumber(m)}`;
}

// Konversi karakter alfabet ke angka
function charToCode(ch) {
  if (ch === ' ') return 0;
  if (ch >= 'A' && ch <= 'Z') return ch.charCodeAt(0) - 64;
  if (ch >= 'a' && ch <= 'z') return -(ch.charCodeAt(0) - 96);
  return null;
}

// Rekonstruksi angka kembali ke karakter
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

export default function HomePage() {
  const { user, login, logout } = useAuth();

  const handleQuickGuest = () => {
    login({
      name: 'Tamu / Guest',
      email: 'tamu@browser.local',
      color: '#6c8190',
      isGuest: true
    });
  };

  // State Enkripsi
  const [message, setMessage] = useState('TELKOM');
  const [a, setA] = useState('2');
  const [b, setB] = useState('3');
  const [c, setC] = useState('4');
  const [d, setD] = useState('1');
  const [copied, setCopied] = useState(false);

  // State Kalkulator
  const [ca, setCa] = useState('2');
  const [cb, setCb] = useState('1');
  const [cc, setCc] = useState('1');
  const [cd, setCd] = useState('-3');
  const [selectedDetail, setSelectedDetail] = useState(null);

  // Komputasi Enkripsi & Dekripsi
  const cipherData = useMemo(() => {
    const numA = Number(a);
    const numB = Number(b);
    const numC = Number(c);
    const numD = Number(d);

    if (!message.trim() || [a, b, c, d].some(v => v === '') || ![numA, numB, numC, numD].every(Number.isFinite)) {
      return { error: 'Masukkan pesan dan isi semua parameter kunci fungsi (a, b, c, d).' };
    }

    if (numA === 0 || numC === 0) {
      return { error: 'Nilai a dan c tidak boleh 0, karena fungsi tidak akan memiliki fungsi invers.' };
    }

    const codeList = [...message].map(charToCode);
    if (codeList.some(code => code === null)) {
      return { error: 'Simulasi ini hanya mendukung karakter alfabet (A–Z, a–z) dan spasi.' };
    }

    const compSlope = numA * numC;
    const compConst = numA * numD + numB;
    const encryptedNumbers = codeList.map(x => compSlope * x + compConst);

    const steps = encryptedNumbers.map((y, idx) => {
      const step1 = (y - numB) / numA;
      const step2 = (step1 - numD) / numC;
      return {
        y,
        step1,
        step2,
        char: codeToChar(step2, message[idx])
      };
    });

    const decryptedMessage = steps.map(s => s.char).join('');

    return {
      error: null,
      codeList,
      compSlope,
      compConst,
      encryptedNumbers,
      steps,
      decryptedMessage,
      formula: `f(g(x)) = ${formatLinear(compSlope, compConst)}`,
      finv: formatInverse(numA, numB),
      ginv: formatInverse(numC, numD),
      compInv: `(f ∘ g)⁻¹(x) = ${formatInverse(compSlope, compConst)}`
    };
  }, [message, a, b, c, d]);

  // Komputasi Kalkulator
  const calcData = useMemo(() => {
    const numA = Number(ca);
    const numB = Number(cb);
    const numC = Number(cc);
    const numD = Number(cd);

    if ([ca, cb, cc, cd].some(v => v === '') || ![numA, numB, numC, numD].every(Number.isFinite)) {
      return { error: 'Harap periksa kolom input kalkulator: semua nilai harus berupa angka valid.' };
    }

    const hasZero = numA === 0 || numC === 0;
    const fgSlope = numA * numC;
    const fgConst = numA * numD + numB;
    const gfSlope = numC * numA;
    const gfConst = numC * numB + numD;

    return {
      error: hasZero ? 'Perhatian: Nilai a = 0 atau c = 0 menyebabkan fungsi tidak memiliki invers.' : null,
      fg: formatLinear(fgSlope, fgConst),
      gf: formatLinear(gfSlope, gfConst),
      finv: formatInverse(numA, numB),
      ginv: formatInverse(numC, numD),
      fginv: formatInverse(fgSlope, fgConst),
      gfinv: formatInverse(gfSlope, gfConst),
      a: numA,
      b: numB,
      c: numC,
      d: numD
    };
  }, [ca, cb, cc, cd]);

  // Rincian Langkah Kalkulator
  const detailExplanations = useMemo(() => {
    if (!calcData || calcData.error) return {};
    const { a, b, c, d } = calcData;
    return {
      fg: {
        title: 'Komposisi (f ∘ g)(x)',
        text: `f(g(x)) = a(cx + d) + b = (${formatNumber(a)}) × (${formatNumber(c)}x + ${formatNumber(d)}) + (${formatNumber(b)}) = (${formatNumber(a * c)})x + (${formatNumber(a * d)}) + (${formatNumber(b)}) = ${formatLinear(a * c, a * d + b)}`
      },
      gf: {
        title: 'Komposisi (g ∘ f)(x)',
        text: `g(f(x)) = c(ax + b) + d = (${formatNumber(c)}) × (${formatNumber(a)}x + ${formatNumber(b)}) + (${formatNumber(d)}) = (${formatNumber(c * a)})x + (${formatNumber(c * b)}) + (${formatNumber(d)}) = ${formatLinear(c * a, c * b + d)}`
      },
      finv: {
        title: 'Invers f⁻¹(x)',
        text: `Mulai dari y = ${formatLinear(a, b)} → Tukar variabel x = ${formatNumber(a)}y + ${formatNumber(b)} → Isolasi y = (x − ${formatNumber(b)}) / ${formatNumber(a)} → f⁻¹(x) = ${formatInverse(a, b)}`
      },
      ginv: {
        title: 'Invers g⁻¹(x)',
        text: `Mulai dari y = ${formatLinear(c, d)} → Tukar variabel x = ${formatNumber(c)}y + ${formatNumber(d)} → Isolasi y = (x − ${formatNumber(d)}) / ${formatNumber(c)} → g⁻¹(x) = ${formatInverse(c, d)}`
      },
      fginv: {
        title: 'Invers dari Komposisi (f ∘ g)⁻¹(x)',
        text: `Fungsi komposisi adalah (f ∘ g)(x) = ${formatLinear(a * c, a * d + b)}. Sifat invers komposisi: (f ∘ g)⁻¹ = g⁻¹ ∘ f⁻¹ (urutan dibalik). Maka (f ∘ g)⁻¹(x) = ${formatInverse(a * c, a * d + b)}`
      },
      gfinv: {
        title: 'Invers dari Komposisi (g ∘ f)⁻¹(x)',
        text: `Fungsi komposisi adalah (g ∘ f)(x) = ${formatLinear(c * a, c * b + d)}. Sifat invers komposisi: (g ∘ f)⁻¹ = f⁻¹ ∘ g⁻¹ (urutan dibalik). Maka (g ∘ f)⁻¹(x) = ${formatInverse(c * a, c * b + d)}`
      }
    };
  }, [calcData]);

  // Salin ke Clipboard
  const handleCopy = async () => {
    if (!cipherData.encryptedNumbers) return;
    try {
      await navigator.clipboard.writeText(cipherData.encryptedNumbers.map(formatNumber).join(', '));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      alert('Gagal menyalin otomatis.');
    }
  };

  return (
    <>
      {/* HEADER */}
      <header className="topbar">
        <a className="logo" href="#">
          <span className="logoicon">S</span>
          <span>
            SecureBanking <em>Transmit</em>
            <small>MATHEMATICAL ENCRYPTION PROTOCOL · NEXT.JS</small>
          </span>
        </a>

        <nav aria-label="Navigasi Utama">
          <a href="#alur">Cara Kerja</a>
          <a href="#transmit">
            Enkripsi Pesan {!user && <span className="lock-badge" title="Terkunci - Butuh Login">🔒</span>}
          </a>
          <a href="#calculator">
            Kalkulator {!user && <span className="lock-badge" title="Terkunci - Butuh Login">🔒</span>}
          </a>
          <a href="#guide">Materi</a>
        </nav>

        {user ? (
          <div className="user-nav-chip">
            <span
              className="user-nav-avatar"
              style={{ backgroundColor: user.color || '#167c80' }}
            >
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
            <div className="user-nav-info">
              <span className="user-nav-name">{user.name}</span>
              <span className="user-nav-tag">{user.email || 'Online'}</span>
            </div>
            <button type="button" onClick={logout} className="user-nav-logout">
              Keluar
            </button>
          </div>
        ) : (
          <Link href="/login" className="login-btn-top" aria-label="Masuk ke Akun">
            <svg
              viewBox="0 0 24 24"
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            <span>Masuk</span>
          </Link>
        )}
      </header>

      {/* KONTEN UTAMA */}
      <main>
        {/* HERO SECTION */}
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span></span> SIMULASI PENGIRIMAN PESAN
            </div>
            <h1>
              Kirim pesan rahasia<br />
              <span>dengan fungsi matematika.</span>
            </h1>
            <p>
              Bayangkan Perusahaan A ingin mengirim pesan ke Bank Mitra. Pesan diubah menjadi angka, diproses dengan fungsi komposisi, lalu dikembalikan menggunakan fungsi invers.
            </p>
            <a className="primary" href="#alur">
              Pelajari cara kerja <b>↗</b>
            </a>
            <div className="hero-meta">
              <span>01 / UBAH KE ANGKA</span>
              <span>02 / ENKRIPSI</span>
              <span>03 / BACA KEMBALI</span>
            </div>
          </div>

          <div className="network-card">
            <div className="cardtop">
              <span>JALUR PENGIRIMAN</span>
              <span className="live"><i></i> SIMULASI</span>
            </div>
            <div className="network">
              <div className="node">
                <span className="nodeicon">A</span>
                <b>Perusahaan A</b>
                <small>PENGIRIM</small>
              </div>
              <div className="route">
                <span className="route-label">ANGKA ENKRIPSI</span>
                <div className="route-line"><i></i><i></i><i></i></div>
                <span className="lock">⌑</span>
              </div>
              <div className="node">
                <span className="nodeicon bank">B</span>
                <b>Bank Mitra</b>
                <small>PENERIMA</small>
              </div>
            </div>
            <div className="network-foot">
              <span>FUNGSI KOMPOSISI</span>
              <strong>(f ∘ g)(x)</strong>
            </div>
            <div className="network-foot">
              <span>FUNGSI PEMBALIK / INVERS</span>
              <strong>(f ∘ g)⁻¹(x)</strong>
            </div>
          </div>
        </section>

        {/* TICKER */}
        <div className="ticker" aria-hidden="true">
          <span>● SIMULASI MATEMATIKA</span>
          <span>NEXT.JS APP ROUTER</span>
          <span>100% TANPA DATABASE</span>
          <span>● BERSIFAT INVERS</span>
        </div>

        {/* ALUR MATEMATIKA */}
        <section id="alur" className="section protocol">
          <div className="eyebrow">SEBELUM MULAI</div>
          <h2>Bagaimana ceritanya?</h2>
          <p className="intro-copy">
            Anggap saja Perusahaan A ingin mengirim pesan kepada Bank Mitra. Keduanya mengikuti aturan hitung matematika yang disepakati. Website ini memperagakan cara pesan diubah menjadi representasi angka, diproses dengan fungsi komposisi, lalu dikembalikan secara presisi memakai invers tanpa database.
          </p>

          <div className="guide-grid">
            <article>
              <span className="guide-num">01</span>
              <h3>1. Tulis Pesan (Bisa &gt; 1 Kata)</h3>
              <p>
                Pengunjung dapat menuliskan pesan <b>lebih dari 1 kata</b> (misalnya berupa kalimat lengkap dengan spasi). Huruf kapital A–Z diubah menjadi 1–26, huruf kecil a–z menjadi −1 sampai −26, dan spasi bernilai 0.
              </p>
              <div className="equation">TELKOM INDONESIA → 20, 5, 12, 11, 15, 13, 0, 9, 14, 4, 15, 14, 5, 19, 9, 1</div>
            </article>

            <article>
              <span className="guide-num">02</span>
              <h3>2. Kunci Fungsi Dinamis (Bebas Diubah)</h3>
              <p>
                Fungsi linear f(x) = ax + b dan g(x) = cx + d <b>tidak bersifat tetap</b>! Pengunjung bebas mengubah angka parameter a, b, c, dan d sesuai keinginan (syarat: a ≠ 0 dan c ≠ 0 agar memiliki invers).
              </p>
              <div className="equation">E(x) = (f ∘ g)(x) = a(cx + d) + b = acx + (ad + b)</div>
            </article>

            <article>
              <span className="guide-num">03</span>
              <h3>3. Bank Mitra Membuka Pesan</h3>
              <p>
                Penerima memakai rumus invers dengan urutan terbalik: (f ∘ g)⁻¹ = g⁻¹ ∘ f⁻¹. Angka ciphertext dihitung kembali ke angka awal, lalu diterjemahkan kembali menjadi teks asli secara utuh.
              </p>
              <div className="equation">(f ∘ g)⁻¹(x) = g⁻¹(f⁻¹(x))</div>
            </article>
          </div>

          <div className="dynamic-notice">
            <span>💡</span>
            <p>
              <b>Informasi Fleksibilitas Pengunjung:</b> Anda bebas mengetikkan pesan sepanjang beberapa kata (dilengkapi spasi) dan bebas bereksplorasi mengganti nilai koefisien fungsi f(x) dan g(x) pada ruang pengiriman. Rumus komposisi dan langkah pembalik akan dihitung ulang secara dinamis dan instan!
            </p>
          </div>

          <div className="notice concept-notice">
            <span>!</span>
            <p><b>Catatan penting:</b> Ini adalah contoh simulasi pembelajaran matematika sekolah, bukan aplikasi bank sungguhan. Tidak ada database dan tidak ada data nyata yang disimpan.</p>
          </div>
        </section>

        {/* SEKSI ENKRIPSI */}
        <section id="transmit" className="section">
          <div className="section-head">
            <div>
              <div className="eyebrow">BAGIAN 01 — RUANG PENGIRIMAN</div>
              <h2>Ubah pesan menjadi angka rahasia</h2>
              <p>Masukkan pesan dan aturan fungsi. Website akan menunjukkan angka awal, hasil enkripsi, serta cara membuka kembali pesan.</p>
            </div>
            <div className="section-index">
              CONTOH SIMULASI <b>SB-2048</b>
            </div>
          </div>

          {!user ? (
            <div className="feature-lock-overlay">
              <div className="lock-card">
                <div className="lock-icon-bubble">🔒</div>
                <h3>Ruang Enkripsi Pesan Dibatasi</h3>
                <p>
                  Untuk dapat memasukkan pesan rahasia, mengubah huruf ke angka, dan melihat proses dekripsi matematika secara langsung, silakan masuk ke akun demo atau masuk sebagai tamu terlebih dahulu.
                </p>
                <div className="lock-actions">
                  <Link href="/login" className="primary">
                    Masuk ke Akun <b>→</b>
                  </Link>
                  <button type="button" onClick={handleQuickGuest} className="quick-guest-btn">
                    ⚡ Masuk Cepat sebagai Tamu (Guest)
                  </button>
                </div>
                <span className="lock-note">
                  * Pengunjung tanpa login hanya dapat membaca materi dan alur cara kerja.
                </span>
              </div>
            </div>
          ) : (
            <>
              <div className="user-status-pill">
                <i></i> SESI AKTIF: {user.name} ({user.isGuest ? 'Mode Tamu' : 'Akun Demo'})
              </div>
              <div className="twocol">
                {/* INPUT PANEL */}
                <article className="panel">
                  <div className="panel-heading">
                    <span className="step">01</span>
                    <div>
                      <h3>Pesan dan kunci fungsi</h3>
                      <p>Kunci adalah angka a, b, c, dan d yang menentukan perhitungan.</p>
                    </div>
                  </div>

                  <label className="field-label">
                    PESAN ASLI (BISA &gt; 1 KATA)
                    <input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      maxLength={120}
                      placeholder="Contoh: TELKOM INDONESIA (bisa > 1 kata)"
                    />
                  </label>

              {/* FUNGSI F */}
              <div className="keybox">
                <div className="keyhead">
                  <span className="keybadge">f</span>
                  <div>
                    <b>Fungsi f(x)</b>
                    <small>f(x) = ax + b</small>
                  </div>
                  <span className="keytag">KEY 01</span>
                </div>
                <div className="inputgrid">
                  <label>
                    Angka a
                    <input type="number" step="any" value={a} onChange={(e) => setA(e.target.value)} />
                  </label>
                  <label>
                    Angka b
                    <input type="number" step="any" value={b} onChange={(e) => setB(e.target.value)} />
                  </label>
                </div>
              </div>

              {/* FUNGSI G */}
              <div className="keybox">
                <div className="keyhead">
                  <span className="keybadge purple">g</span>
                  <div>
                    <b>Fungsi g(x)</b>
                    <small>g(x) = cx + d</small>
                  </div>
                  <span className="keytag">KEY 02</span>
                </div>
                <div className="inputgrid">
                  <label>
                    Angka c
                    <input type="number" step="any" value={c} onChange={(e) => setC(e.target.value)} />
                  </label>
                  <label>
                    Angka d
                    <input type="number" step="any" value={d} onChange={(e) => setD(e.target.value)} />
                  </label>
                </div>
              </div>

              <div className="notice">
                <span>i</span>
                <p>Nilai <b>a</b> dan <b>c</b> harus bukan 0 supaya proses pembalikan (invers) bisa dilakukan.</p>
              </div>

              {cipherData.error && <div className="error">{cipherData.error}</div>}

              {!cipherData.error && (
                <div className="converted">
                  <div className="smallcap">PESAN ASLI → ANGKA</div>
                  <div className="numbers">{cipherData.codeList.map(formatNumber).join(', ')}</div>
                  <p>Huruf kapital A–Z = 1–26 · Huruf kecil a–z = −1 sampai −26 · Spasi = 0</p>
                </div>
              )}
            </article>

            {/* HASIL ENKRIPSI */}
            <article className="panel result-panel">
              <div className="panel-heading">
                <span className="step">02</span>
                <div>
                  <h3>Hasil enkripsi</h3>
                  <p>Ini deretan angka ciphertext yang akan dikirim ke Bank Mitra.</p>
                </div>
                <span className="encrypted-stamp">ENCRYPTED</span>
              </div>

              {!cipherData.error && (
                <>
                  <div className="formula-card">
                    <div className="smallcap">RUMUS FUNGSI KOMPOSISI</div>
                    <strong>{cipherData.formula}</strong>
                    <div className="formula-rule">Artinya: hitung g(x) lebih dahulu, lalu masukkan hasilnya ke f(x).</div>
                  </div>

                  <div className="cipher-output">
                    <div className="smallcap">HASIL ENKRIPSI / DERETAN ANGKA</div>
                    <div className="numbers big">{cipherData.encryptedNumbers.map(formatNumber).join(', ')}</div>
                    <button className="copy" type="button" onClick={handleCopy}>
                      {copied ? 'Tersalin ✓' : 'Salin angka'}
                    </button>
                  </div>

                  <div className="decrypt">
                    <div className="decrypt-head">
                      <span className="step light">03</span>
                      <div>
                        <h3>Cara membuka pesan</h3>
                        <p>Bank Mitra memakai fungsi invers untuk mendapatkan kembali angka awal.</p>
                      </div>
                    </div>

                    <div className="calcrow">
                      <span>Fungsi invers f⁻¹(x)</span>
                      <b>{cipherData.finv}</b>
                    </div>
                    <div className="calcrow">
                      <span>Fungsi invers g⁻¹(x)</span>
                      <b>{cipherData.ginv}</b>
                    </div>
                    <div className="calcrow">
                      <span>Invers dari komposisi</span>
                      <b>{cipherData.compInv}</b>
                    </div>

                    <div className="steps">
                      {cipherData.steps.map((st, i) => (
                        <div key={i}>
                          <b>{i + 1}. Angka ciphertext = {formatNumber(st.y)}</b><br />
                          1) f⁻¹({formatNumber(st.y)}) = ({formatNumber(st.y)} − {formatNumber(b)}) / {formatNumber(a)} = {formatNumber(st.step1)}<br />
                          2) g⁻¹({formatNumber(st.step1)}) = ({formatNumber(st.step1)} − {formatNumber(d)}) / {formatNumber(c)} = <b>{formatNumber(st.step2)}</b>
                        </div>
                      ))}
                    </div>

                    <div className="decoded">
                      <span>PESAN SETELAH DIBUKA</span>
                      <strong>{cipherData.decryptedMessage}</strong>
                    </div>
                  </div>

                  <div className="success">✓ Pesan berhasil dibuka kembali menggunakan invers bertingkat.</div>
                </>
              )}
            </article>
          </div>
        </>
      )}
    </section>

        {/* SEKSI KALKULATOR */}
        <section id="calculator" className="section">
          <div className="section-head">
            <div>
              <div className="eyebrow">BAGIAN 02 — KALKULATOR FUNGSI</div>
              <h2>Pelajari komposisi dan invers</h2>
              <p>Ubah angka pada fungsi, lalu pilih hasil pada kartu yang ingin kamu pahami langkahnya.</p>
            </div>
            <div className="section-index">
              MODE <b>BELAJAR</b>
            </div>
          </div>

          {!user ? (
            <div className="feature-lock-overlay">
              <div className="lock-card">
                <div className="lock-icon-bubble">🔒</div>
                <h3>Kalkulator Fungsi Interaktif Dibatasi</h3>
                <p>
                  Gunakan akun demo (Alfien, Tatang, Sindi) atau masuk mode tamu untuk membuka kalkulator fungsi komposisi, invers, dan penjabaran aljabar langkah demi langkah.
                </p>
                <div className="lock-actions">
                  <Link href="/login" className="primary">
                    Masuk ke Akun <b>→</b>
                  </Link>
                  <button type="button" onClick={handleQuickGuest} className="quick-guest-btn">
                    ⚡ Masuk Cepat sebagai Tamu (Guest)
                  </button>
                </div>
                <span className="lock-note">
                  * Akses publik tanpa login dibatasi hanya untuk membaca pengantar alur cara kerja dan materi matematika.
                </span>
              </div>
            </div>
          ) : (
            <div className="twocol">
            {/* INPUT KALKULATOR */}
            <article className="panel">
              <div className="panel-heading">
                <span className="step">04</span>
                <div>
                  <h3>Masukkan fungsi</h3>
                  <p>Gunakan bentuk umum f(x) = ax + b dan g(x) = cx + d.</p>
                </div>
              </div>

              <div className="keybox">
                <div className="keyhead">
                  <span className="keybadge">f</span>
                  <div>
                    <b>Fungsi f(x)</b>
                    <small>f(x) = ax + b</small>
                  </div>
                </div>
                <div className="inputgrid">
                  <label>
                    Angka a
                    <input type="number" step="any" value={ca} onChange={(e) => setCa(e.target.value)} />
                  </label>
                  <label>
                    Angka b
                    <input type="number" step="any" value={cb} onChange={(e) => setCb(e.target.value)} />
                  </label>
                </div>
              </div>

              <div className="keybox">
                <div className="keyhead">
                  <span className="keybadge purple">g</span>
                  <div>
                    <b>Fungsi g(x)</b>
                    <small>g(x) = cx + d</small>
                  </div>
                </div>
                <div className="inputgrid">
                  <label>
                    Angka c
                    <input type="number" step="any" value={cc} onChange={(e) => setCc(e.target.value)} />
                  </label>
                  <label>
                    Angka d
                    <input type="number" step="any" value={cd} onChange={(e) => setCd(e.target.value)} />
                  </label>
                </div>
              </div>

              {calcData.error && <div className="error">{calcData.error}</div>}
            </article>

            {/* HASIL GRID */}
            <article className="panel">
              <div className="panel-heading">
                <span className="step">05</span>
                <div>
                  <h3>Hasil perhitungan</h3>
                  <p>Klik salah satu kartu untuk melihat langkah penjabarannya.</p>
                </div>
              </div>

              <div className="result-grid">
                <button
                  type="button"
                  className={`resultcard ${selectedDetail === 'fg' ? 'selected' : ''}`}
                  onClick={() => setSelectedDetail('fg')}
                >
                  <span>(f ∘ g)(x)</span>
                  <strong>{calcData.fg}</strong>
                  <small>Lihat langkah ↗</small>
                </button>
                <button
                  type="button"
                  className={`resultcard ${selectedDetail === 'gf' ? 'selected' : ''}`}
                  onClick={() => setSelectedDetail('gf')}
                >
                  <span>(g ∘ f)(x)</span>
                  <strong>{calcData.gf}</strong>
                  <small>Lihat langkah ↗</small>
                </button>
                <button
                  type="button"
                  className={`resultcard ${selectedDetail === 'finv' ? 'selected' : ''}`}
                  onClick={() => setSelectedDetail('finv')}
                >
                  <span>f⁻¹(x)</span>
                  <strong>{calcData.finv}</strong>
                  <small>Lihat langkah ↗</small>
                </button>
                <button
                  type="button"
                  className={`resultcard ${selectedDetail === 'ginv' ? 'selected' : ''}`}
                  onClick={() => setSelectedDetail('ginv')}
                >
                  <span>g⁻¹(x)</span>
                  <strong>{calcData.ginv}</strong>
                  <small>Lihat langkah ↗</small>
                </button>
                <button
                  type="button"
                  className={`resultcard ${selectedDetail === 'fginv' ? 'selected' : ''}`}
                  onClick={() => setSelectedDetail('fginv')}
                >
                  <span>(f ∘ g)⁻¹(x)</span>
                  <strong>{calcData.fginv}</strong>
                  <small>Lihat langkah ↗</small>
                </button>
                <button
                  type="button"
                  className={`resultcard ${selectedDetail === 'gfinv' ? 'selected' : ''}`}
                  onClick={() => setSelectedDetail('gfinv')}
                >
                  <span>(g ∘ f)⁻¹(x)</span>
                  <strong>{calcData.gfinv}</strong>
                  <small>Lihat langkah ↗</small>
                </button>
              </div>

              <div className="detail">
                <div className="smallcap">LANGKAH PERHITUNGAN</div>
                <h4>{selectedDetail && detailExplanations[selectedDetail] ? detailExplanations[selectedDetail].title : 'Pilih salah satu hasil fungsi'}</h4>
                <p>{selectedDetail && detailExplanations[selectedDetail] ? detailExplanations[selectedDetail].text : 'Klik kartu hasil di atas untuk memunculkan langkah aljabar lengkap.'}</p>
              </div>
            </article>
          </div>
        )}
      </section>

        {/* MATERI RINGKAS */}
        <section id="guide" className="section protocol">
          <div className="eyebrow">BAGIAN 03 — MATERI SINGKAT</div>
          <h2>Matematika di balik simulasi</h2>

          <div className="guide-grid">
            <article>
              <span className="guide-num">01</span>
              <h3>1. Mengubah huruf menjadi angka</h3>
              <p>Pesan diubah menjadi angka sebelum masuk ke fungsi. Kapital A–Z bernilai 1–26, huruf kecil a–z bernilai −1 sampai −26, dan spasi bernilai 0.</p>
              <div className="equation">A = 1, B = 2, …, Z = 26</div>
              <div className="equation">a = −1, b = −2, …, z = −26</div>
            </article>

            <article>
              <span className="guide-num">02</span>
              <h3>2. Mengenkripsi dengan komposisi</h3>
              <p>Fungsi g dikerjakan lebih dahulu, kemudian hasilnya dimasukkan ke fungsi f.</p>
              <div className="equation">E(x) = (f ∘ g)(x) = f(g(x))</div>
              <div className="equation">E(x) = acx + ad + b</div>
            </article>

            <article>
              <span className="guide-num">03</span>
              <h3>3. Membuka pesan dengan invers</h3>
              <p>Urutan proses dibalik agar angka awal dapat ditemukan kembali.</p>
              <div className="equation">(f ∘ g)⁻¹ = g⁻¹ ∘ f⁻¹</div>
              <div className="equation">f⁻¹(x) = (x − b) / a</div>
            </article>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer>
        <a className="logo" href="#">
          <span className="logoicon">S</span>
          <span>
            SecureBanking <em>Transmit</em>
            <small>NEXT.JS · MATHFUNCTION LAB</small>
          </span>
        </a>
        <span>SIMULATOR ENKRIPSI FUNGSI · NEXT.JS · TANPA DATABASE</span>
      </footer>
    </>
  );
}
