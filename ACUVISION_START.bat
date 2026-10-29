
@echo off
title ACUVISION

echo ==========================================
echo           ACUVISION STARTING
echo ==========================================
echo.

REM ==========================================
REM START FRONTEND SERVER
REM ==========================================

echo Starting ACUVISION frontend...

start "ACUVISION FRONTEND" cmd /k "cd /d C:\Users\patan\OneDrive\Desktop\ACUVISION\frontend && python -m http.server 8000"

timeout /t 2 /nobreak >nul


REM ==========================================
REM START FLASK BACKEND
REM ==========================================

echo Starting ACUVISION backend...

start "ACUVISION BACKEND" cmd /k "cd /d C:\Users\patan\OneDrive\Desktop\ACUVISION\backend && python app.py"

timeout /t 6 /nobreak >nul


REM ==========================================
REM OPEN LOGIN PAGE
REM ==========================================

echo Opening ACUVISION Login...

powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "Start-Process 'http://127.0.0.1:8000/login.html'"


echo.
echo ==========================================
echo       ACUVISION STARTED SUCCESSFULLY
echo ==========================================
echo.
pause