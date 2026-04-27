# Script PowerShell para iniciar ZeroFinances Frontend
# Ejecuta: .\start-dev.ps1 en PowerShell

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    ZeroFinances - Frontend Dev Server" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$frontendPath = Join-Path $projectPath "ZeroFinancesFront"

Write-Host "Directorio: $frontendPath" -ForegroundColor Yellow
Write-Host ""

Set-Location $frontendPath

Write-Host "Instalando dependencias (si es necesario)..." -ForegroundColor Green
npm install --legacy-peer-deps 2>&1 | Out-Null

Write-Host ""
Write-Host "Iniciando servidor Expo..." -ForegroundColor Green
Write-Host ""
Write-Host "Opciones:" -ForegroundColor Yellow
Write-Host "  w - Abrir en navegador (recomendado para desarrollo)"
Write-Host "  a - Abrir en Android"
Write-Host "  i - Abrir en iOS"
Write-Host "  r - Recargar"
Write-Host "  q - Salir"
Write-Host ""

npm start

Read-Host "Presiona Enter para cerrar"
