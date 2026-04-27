@echo off
REM Script para iniciar ZeroFinances Frontend
REM Ejecuta: npm start en el directorio correcto

cd /d "%~dp0ZeroFinancesFront"

echo.
echo ========================================
echo    ZeroFinances - Frontend Dev Server
echo ========================================
echo.
echo Iniciando Expo...
echo.

npm start

pause
