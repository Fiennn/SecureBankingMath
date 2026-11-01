'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

const DEMO_ACCOUNTS = [
  { name: 'Alfien Satria', email: 'alfien.satria@gmail.com', color: '#167c80' },
  { name: 'Tatang Vin', email: 'tatang.vin@bankmitra.id', color: '#7868b5' },
  { name: 'Sindi Dwi Kartika', email: 'sindi.dwi@telkom.id', color: '#c07a2c' }
];

export default function LoginPage() {
  const router = useRouter();
  const { user, login } = useAuth();
  const [customName, setCustomName] = useState('');
  const [customEmail, setCustomEmail] = useState('');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [statusMsg, setStatusMsg] = useState('');

  const handleSelectAccount = (account) => {
    setStatusMsg(`Masuk sebagai ${account.name}...`);
    login({
      name: account.name,
      email: account.email,
      color: account.color || '#167c80'
    });
    setTimeout(() => {
      router.push('/');
    }, 400);
  };

  const handleGoogleLogin = () => {
    handleSelectAccount({
      name: 'Alfien Satria (Google)',
      email: 'alfien.satria@gmail.com',
      color: '#4285F4'
    });
  };

  const handleGuestLogin = () => {
    setStatusMsg('Masuk sebagai Tamu...');
    login({
      name: 'Tamu / Guest',
      email: 'tamu@browser.local',
      color: '#6c8190'
    });
    setTimeout(() => {
      router.push('/');
    }, 350);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (!customName.trim() || !customEmail.trim()) {
      alert('Harap isi nama dan email.');
      return;
    }
    handleSelectAccount({
      name: customName.trim(),
      email: customEmail.trim(),
      color: '#167c80'
    });
  };

  return (
    <div className="login-page-wrap">
      {/* PANEL KIRI (VISUAL & FITUR) */}
      <aside className="login-visual-pane">
        <Link href="/" className="login-logo" aria-label="Beranda SecureBanking">
          <span className="logoicon">S</span>
          <span>
            <b>SecureBanking <em>Transmit</em></b>
            <small>MATHEMATICAL ENCRYPTION PROTOCOL</small>
          </span>
        </Link>

        <div className="login-visual-content">
          <span className="login-badge">
            <i></i> AKSES AMAN · MATHFUNCTION LAB
          </span>
          <h2>
            Satu identitas.<br />
            <span>Simulasi matematika real-time.</span>
          </h2>
          <p>
            Masuk untuk merasakan pengalaman protokol pengiriman pesan rahasia Perusahaan A ke Bank Mitra secara interaktif menggunakan fungsi komposisi dan invers.
          </p>

          <ul className="login-features">
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
              <span><b>100% Tanpa Database</b> — Cepat, aman, dan ringan</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="m4.93 4.93 4.24 4.24" />
                <path d="m14.83 9.17 4.24-4.24" />
                <path d="m14.83 14.83 4.24 4.24" />
                <path d="m9.17 14.83-4.24 4.24" />
                <circle cx="12" cy="12" r="4" />
              </svg>
              <span><b>Dukungan Next.js</b> — Siap deploy langsung ke Vercel</span>
            </li>
            <li>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
              </svg>
              <span><b>Sesi Client-Side</b> — Terbuka langsung di browsermu</span>
            </li>
          </ul>
        </div>
      </aside>

      {/* PANEL KANAN (FORMULIR MASUK) */}
      <main className="login-form-pane">
        <div className="login-top-bar">
          <Link href="/" className="back-home-btn">
            ← Kembali ke Beranda
          </Link>
          <span>Simulasi Edukasi</span>
        </div>

        <section className="login-card-box">
          <div className="login-card-header">
            <span className="card-badge">
              <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="10" width="16" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
              LOGIN AKUN
            </span>
            <h3>Masuk ke akunmu</h3>
            <p>Pilih akun contoh demo atau masuk sebagai tamu untuk membuka simulasi matematika.</p>
          </div>

          {statusMsg && (
            <div className="success" style={{ marginBottom: 14, padding: 10, background: '#eef8f5', borderRadius: 8 }}>
              {statusMsg}
            </div>
          )}

          {/* TOMBOL GOOGLE */}
          <button className="google-auth-btn" type="button" onClick={handleGoogleLogin}>
            <svg viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            </svg>
            <span>Lanjutkan dengan Google</span>
          </button>

          <div className="auth-divider">PILIH AKUN DEMO</div>

          {/* DAFTAR AKUN DEMO */}
          <div className="demo-account-list">
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                className="demo-account-item"
                onClick={() => handleSelectAccount(acc)}
              >
                <span className="demo-avatar" style={{ backgroundColor: acc.color }}>
                  {acc.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </span>
                <span className="demo-meta">
                  <b>{acc.name}</b>
                  <small>{acc.email}</small>
                </span>
                <span style={{ color: '#8fa8b1', fontSize: 13 }}>→</span>
              </button>
            ))}
          </div>

          {/* TOGGLE FORM CUSTOM */}
          {!showCustomForm ? (
            <button
              type="button"
              className="guest-btn"
              onClick={() => setShowCustomForm(true)}
              style={{ borderStyle: 'solid', color: 'var(--ink)' }}
            >
              Gunakan Nama / Akun Lain
            </button>
          ) : (
            <form onSubmit={handleCustomSubmit} className="custom-form">
              <label>
                NAMA LENGKAP
                <input
                  type="text"
                  placeholder="Contoh: Budi Santoso"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  required
                />
              </label>
              <label>
                EMAIL
                <input
                  type="email"
                  placeholder="budi@example.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  required
                />
              </label>
              <button type="submit" className="primary wide">
                Masuk ke Aplikasi <b>→</b>
              </button>
              <button
                type="button"
                className="guest-btn"
                onClick={() => setShowCustomForm(false)}
                style={{ marginTop: 4, padding: 6 }}
              >
                Tutup Form
              </button>
            </form>
          )}

          {/* MASUK SEBAGAI TAMU */}
          <button type="button" className="guest-btn" onClick={handleGuestLogin}>
            Masuk sebagai Tamu (Guest)
          </button>
        </section>
      </main>
    </div>
  );
}

