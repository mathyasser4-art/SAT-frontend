# Abacus Heroes - Development Server Startup Script
# This script helps you start the development server easily

Write-Host "Starting Abacus Heroes Development Server..." -ForegroundColor Green
Write-Host ""

# Check if .env exists, if not create it from example
if (!(Test-Path ".env")) {
    Write-Host "Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host ".env file created successfully!" -ForegroundColor Green
}

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-Host "Installing dependencies... This may take a few minutes." -ForegroundColor Yellow
    npm install
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
    Write-Host ""
}

# Stop any existing node processes on common ports
Write-Host "Checking for existing processes..." -ForegroundColor Yellow
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 1

# Start the development server
Write-Host ""
Write-Host "Starting React development server..." -ForegroundColor Green
Write-Host "The app will open automatically in your browser at http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

npm start