@echo off
title SecureBanking Transmit - Web Server
echo ====================================================
echo    SECUREBANKING TRANSMIT — MENJALANKAN WEBSITE
echo ====================================================
echo.

:: Cek apakah Node.js terpasang
where node >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Node.js terdeteksi. Memulai server lokal...
    node server.js
    goto end
)

:: Jika tidak ada Node.js, cek Python
where python >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Python terdeteksi. Membuka browser di http://localhost:8000 ...
    start http://localhost:8000
    python -m http.server 8000
    goto end
)

:: Fallback: Buka langsung file index.html di browser
echo [INFO] Membuka index.html langsung di browser...
start index.html

:end
pause

