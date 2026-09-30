@echo off
title Hentikan Server HEIMA.CREATIVE
color 0c

echo ===================================================
echo        MENGHENTIKAN SERVER HEIMA.CREATIVE
echo ===================================================
echo.

taskkill /F /IM node.exe >nul 2>&1

echo Server berhasil dihentikan.
echo.
pause
