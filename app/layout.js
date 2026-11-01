import './globals.css';

export const metadata = {
  title: 'SecureBanking Transmit | MathFunction Lab',
  description: 'Simulasi interaktif protokol enkripsi matematika berbasis fungsi komposisi dan invers (Next.js Version).',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
