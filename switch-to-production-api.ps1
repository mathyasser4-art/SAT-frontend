# PowerShell script to switch API URLs back to production
Write-Host "Switching API URLs to production..." -ForegroundColor Green

$files = Get-ChildItem -Path "src" -Filter "*.js" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match "http://localhost:54112") {
        $newContent = $content -replace "http://localhost:54112", "https://abacus-2ntk.onrender.com"
        Set-Content -Path $file.FullName -Value $newContent
        Write-Host "Updated: $($file.FullName)" -ForegroundColor Yellow
    }
}

Write-Host "`nDone! All API URLs now point to https://abacus-2ntk.onrender.com" -ForegroundColor Green