$ErrorActionPreference = "Stop"

Write-Host "Building Quasar Orbit for multiple platforms..." -ForegroundColor Cyan

if (-not (Test-Path "build")) {
    New-Item -ItemType Directory -Path "build" | Out-Null
    Write-Host "Created build directory" -ForegroundColor Cyan
}

Write-Host "`nBuilding for Linux AMD64..." -ForegroundColor Yellow
$env:GOOS = "linux"
$env:GOARCH = "amd64"
go build -o build/quasar_orbit_linux_amd64
Write-Host "Built: build/quasar_orbit_linux_amd64" -ForegroundColor Green

Write-Host "`nBuilding for Linux x86 (32-bit)..." -ForegroundColor Yellow
$env:GOOS = "linux"
$env:GOARCH = "386"
go build -o build/quasar_orbit_linux_386
Write-Host "Built: build/quasar_orbit_linux_386" -ForegroundColor Green

Write-Host "`nBuilding for Windows AMD64 (64-bit)..." -ForegroundColor Yellow
$env:GOOS = "windows"
$env:GOARCH = "amd64"
go build -o build/quasar_orbit_windows_amd64.exe
Write-Host "Built: build/quasar_orbit_windows_amd64.exe" -ForegroundColor Green


Write-Host "`nBuilding for Windows x86 (32-bit)..." -ForegroundColor Yellow
$env:GOOS = "windows"
$env:GOARCH = "386"
go build -o build/quasar_orbit_windows_386.exe
Write-Host "Built: build/quasar_orbit_windows_386.exe" -ForegroundColor Green

Write-Host "`nAll builds completed successfully!" -ForegroundColor Green
