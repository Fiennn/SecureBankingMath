/**
 * Simple Zero-Dependency Local Static Web Server
 * Menjalankan SecureBanking Transmit secara lokal dan membuka browser secara otomatis.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8'
};

const server = http.createServer((req, res) => {
  // Parsing pathname
  let reqUrl = req.url.split('?')[0];
  if (reqUrl === '/') reqUrl = '/index.html';

  // Decode URI component (e.g. spaces)
  let safePath;
  try {
    safePath = decodeURIComponent(reqUrl);
  } catch (e) {
    res.writeHead(400, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Bad Request');
    return;
  }

  // Prevent directory traversal
  const filePath = path.normalize(path.join(BASE_DIR, safePath));
  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!doctype html><html><head><title>404 Not Found</title></head>
        <body style="font-family:sans-serif;padding:40px;text-align:center;">
          <h1>404 - Halaman Tidak Ditemukan</h1>
          <p>File <code>${safePath}</code> tidak ditemukan di server.</p>
          <a href="/" style="color:#167c80;text-decoration:none;font-weight:bold;">← Kembali ke Beranda</a>
        </body></html>`);
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  const url = `http://localhost:${PORT}`;
  console.log('====================================================');
  console.log('   SECUREBANKING TRANSMIT — LOCAL WEB SERVER        ');
  console.log('====================================================');
  console.log(`Server aktif berjalan di: \x1b[36m${url}\x1b[0m`);
  console.log('Tekan Ctrl + C untuk mematikan server.');
  console.log('----------------------------------------------------');

  // Auto-open browser on Windows/macOS/Linux
  const openCmd = process.platform === 'win32'
    ? `start ${url}`
    : process.platform === 'darwin'
      ? `open ${url}`
      : `xdg-open ${url}`;

  exec(openCmd, (err) => {
    if (err) {
      console.log(`Buka tautan ini di browser kamu: ${url}`);
    }
  });
});

