# Script to set up app icon from VisualSort_logo.png
# Note: This copies the same image to all sizes. For best results, use https://icon.kitchen/ to generate proper sizes.

$sourceLogo = "VisualSort_logo.png"
$resPath = "android\app\src\main\res"

# Check if source exists
if (-not (Test-Path $sourceLogo)) {
    Write-Host "Error: $sourceLogo not found!" -ForegroundColor Red
    exit 1
}

Write-Host "Setting up app icons..." -ForegroundColor Green

# Create directories if they don't exist
$sizes = @("mdpi", "hdpi", "xhdpi", "xxhdpi", "xxxhdpi")

foreach ($size in $sizes) {
    $dir = "$resPath\mipmap-$size"
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    
    # Copy to ic_launcher.png
    Copy-Item $sourceLogo "$dir\ic_launcher.png" -Force
    Write-Host "  Copied to mipmap-$size/ic_launcher.png" -ForegroundColor Cyan
    
    # Copy to ic_launcher_round.png
    Copy-Item $sourceLogo "$dir\ic_launcher_round.png" -Force
    Write-Host "  Copied to mipmap-$size/ic_launcher_round.png" -ForegroundColor Cyan
}

Write-Host "`nDone! Icons copied to all mipmap folders." -ForegroundColor Green
Write-Host "`nNOTE: For best results, use https://icon.kitchen/ to generate properly sized icons." -ForegroundColor Yellow
Write-Host "Then copy the generated mipmap-* folders to: $resPath" -ForegroundColor Yellow
Write-Host "`nRun 'npm run android' to rebuild the app with new icons." -ForegroundColor Green
