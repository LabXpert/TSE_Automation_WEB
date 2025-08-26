@echo off
cls
echo ================================
echo    TSE Mail Test Sistemi
echo ================================
echo.
echo [1] Test Email Gonder
echo [2] Gercek Rapor Gonder  
echo [3] Sistem Durumu Kontrol Et
echo [4] Rapor Dosya Bilgileri
echo [5] Cikis
echo.
set /p choice="Seciminizi yapin (1-5): "

if "%choice%"=="1" (
    echo.
    echo Test email gonderiliyor...
    echo --------------------------------
    powershell -Command "Invoke-WebRequest -Uri http://localhost:3002/test-email -Method POST -UseBasicParsing"
    echo.
    echo Test email gonderildi! Gmail'inizi kontrol edin.
    goto end
)

if "%choice%"=="2" (
    echo.
    echo Gercek rapor gonderiliyor...
    echo --------------------------------
    powershell -Command "Invoke-WebRequest -Uri http://localhost:3002/send-now -Method POST -UseBasicParsing"
    echo.
    echo Rapor gonderildi! 1-2 dakika icinde Gmail'inizi kontrol edin.
    goto end
)

if "%choice%"=="3" (
    echo.
    echo Sistem durumu kontrol ediliyor...
    echo --------------------------------
    powershell -Command "Invoke-WebRequest -Uri http://localhost:3002/health -UseBasicParsing"
    echo.
    goto end
)

if "%choice%"=="4" (
    echo.
    echo Rapor dosya bilgileri getiriliyor...
    echo --------------------------------
    powershell -Command "Invoke-WebRequest -Uri http://localhost:3002/reports/info -UseBasicParsing"
    echo.
    goto end
)

if "%choice%"=="5" (
    echo Cikis yapiliyor...
    exit
)

echo Gecersiz secim! Lutfen 1-5 arasi bir sayi girin.

:end
echo.
echo ================================
echo Baska bir test yapmak icin tekrar calistirin!
pause
