# JIMBO DevAssist Sci-Fi Launcher
$Host.UI.RawUI.WindowTitle = "JIMBO-Pro OS :: INITIALIZING..."

function Show-Header {
    Clear-Host
    Write-Host "====================================================" -ForegroundColor Cyan
    Write-Host "   _ ___ __  __ ____   ____     ____  ____   ___ " -ForegroundColor Cyan
    Write-Host "  | |_  |  \/  | __ ) / __ \   |  _ \|  _ \ / _ \" -ForegroundColor Cyan
    Write-Host "  | | | | |\/| |  _ \| |  | |  | |_) | |_) | | | |" -ForegroundColor Cyan
    Write-Host " _| |_| | |  | | |_) | |__| |  |  __/|  _ <| |_| |" -ForegroundColor Cyan
    Write-Host "|_|\___/|_|  |_|____/ \____/   |_|   |_| \_\\___/ " -ForegroundColor Cyan
    Write-Host "====================================================" -ForegroundColor Cyan
    Write-Host " SYSTEM: JIMBO-Pro OS v3.0.1" -ForegroundColor Gray
    Write-Host " STATUS: INITIALIZING CORE ENVELOPE..." -ForegroundColor Yellow
}

Show-Header
Start-Sleep -Milliseconds 500

Write-Host "`n[+] Checking dependencies..." -ForegroundColor Gray
if (!(Test-Path "node_modules")) {
    Write-Host "[!] node_modules missing. Running npm install..." -ForegroundColor Yellow
    & npm.cmd install
}

Write-Host "[+] Synchronizing environment keys..." -ForegroundColor Gray
# (Simulated key sync)

Write-Host "[+] Launching Dev Server (Vite)..." -ForegroundColor Cyan
# Using cmd /c to ensure it runs correctly without opening the .ps1 file in Notepad
Start-Process "cmd.exe" -ArgumentList "/c npm.cmd run dev" -WindowStyle Hidden

Write-Host "[+] Waiting for Aether Network (localhost:5173)..." -ForegroundColor Gray
while (!(Test-NetConnection -ComputerName localhost -Port 5173 -InformationLevel Quiet)) {
    Write-Host "." -NoNewline -ForegroundColor Gray
    Start-Sleep -Seconds 1
}

Write-Host "`n[!] ACCESS GRANTED. LAUNCHING INTERFACE." -ForegroundColor Green -BackgroundColor Black
Start-Process "chrome.exe" -ArgumentList "--app=http://localhost:5173", "--start-maximized"

Write-Host "`nTerminating launcher in 3 seconds..." -ForegroundColor Gray
Start-Sleep -Seconds 3
exit
