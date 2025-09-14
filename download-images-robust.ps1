# Robust PowerShell script to download perfume images from multiple sources
# Run this script in PowerShell

# Create directory for images if it doesn't exist
$imagesDir = "c:\Games\ValleyPreview\perfume-images"
if (!(Test-Path $imagesDir)) {
    New-Item -ItemType Directory -Path $imagesDir
}

# Multiple sources for each perfume image
$brands = @{
    "versace-eros" = @(
        "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=1920&h=800&fit=crop&auto=format&q=90",
        "https://images.unsplash.com/photo-1588405748880-12d1d2a59db9?w=1920&h=800&fit=crop&auto=format&q=90",
        "https://images.unsplash.com/photo-1600143082400-8b0c4d2c8bc1?ixlib=rb-4.0.3"
    )
    "dior-sauvage" = @(
        "https://images.unsplash.com/photo-1588405748880-12d1d2a59db9?w=1920&h=800&fit=crop&auto=format&q=90",
        "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=1920&h=800&fit=crop&auto=format&q=90",
        "https://images.unsplash.com/photo-1600143082400-8b0c4d2c8bc1?ixlib=rb-4.0.3"
    )
}

Write-Host "Starting robust image downloads..." -ForegroundColor Green

foreach ($brand in $brands.Keys) {
    $downloaded = $false
    $sources = $brands[$brand]
    
    foreach ($url in $sources) {
        if ($downloaded) { continue }
        
        $filename = "$brand.jpg"
        $outputPath = Join-Path $imagesDir $filename
        Write-Host "Trying to download $filename from $url..." -ForegroundColor Yellow
        
        try {
            Invoke-WebRequest -Uri $url -OutFile $outputPath -TimeoutSec 30
            $fileInfo = Get-Item $outputPath
            if ($fileInfo.Length -gt 10000) {  # Check if file is larger than 10KB
                Write-Host "Successfully downloaded $filename ($([math]::Round($fileInfo.Length/1024)) KB)" -ForegroundColor Green
                $downloaded = $true
            } else {
                Write-Host "Downloaded file too small, trying next source..." -ForegroundColor Red
                Remove-Item $outputPath -Force
            }
        }
        catch {
            Write-Host "Failed to download from this source, trying next..." -ForegroundColor Red
        }
    }
    
    if (-not $downloaded) {
        Write-Host "Failed to download $brand from all sources" -ForegroundColor Red
    }
}

Write-Host "Robust image download process completed!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Check downloaded images in c:\Games\ValleyPreview\perfume-images\" -ForegroundColor Cyan
Write-Host "2. Move images to c:\Games\ValleyPreview\client\src\assets\" -ForegroundColor Cyan
Write-Host "3. Convert all images to WebP format and resize to 1920x800px" -ForegroundColor Cyan
Write-Host "4. Update the brand-showcase.tsx component imports" -ForegroundColor Cyan
Write-Host "5. Replace Unsplash URLs with local image imports" -ForegroundColor Cyan