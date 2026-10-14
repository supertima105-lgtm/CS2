Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "      🎯 CS2 TACTICS LAB — ЗАПУСК ПРИЛОЖЕНИЯ 🎯" -ForegroundColor Yellow
Write-Host "========================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Открытие приложения в браузере..." -ForegroundColor Green

Start-Process "$PSScriptRoot\app.html"

Write-Host "Готово! Приложение запущено." -ForegroundColor Green
Start-Sleep -Seconds 3
