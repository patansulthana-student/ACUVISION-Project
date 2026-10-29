@echo off
title ACUVISION Launcher

echo ==========================================
echo           ACUVISION LAUNCHER
echo ==========================================
echo.

cd /d "C:\Users\patan\OneDrive\Desktop\ACUVISION\backend"

echo Starting ACUVISION Flask backend...
start "ACUVISION BACKEND" cmd /k python app.py

echo.
echo Waiting for backend...
timeout /t 6 /nobreak >nul

echo Opening ACUVISION Dashboard...
powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process 'http://127.0.0.1:5500/frontend/login.html'"

echo.
echo ACUVISION started successfully.
echo.
pause