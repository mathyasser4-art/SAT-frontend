# PowerShell script to switch API URLs to localhost
Write-Host "Switching API URLs to localhost..." -ForegroundColor Green

$files = Get-ChildItem -Path "src" -Filter "*.js" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match "https://abacus-2ntk.onrender.com") {
        $newContent = $content -replace "https://abacus-2ntk.onrender.com", "http://localhost:54112"
        Set-Content -Path $file.FullName -Value $newContent
        Write-Host "Updated: $($file.FullName)" -ForegroundColor Yellow
    }
}

Write-Host "`nDone! All API URLs now point to http://localhost:54112" -ForegroundColor Green
Write-Host "Run 'switch-to-production-api.ps1' to revert back to production URLs" -ForegroundColor Cyan