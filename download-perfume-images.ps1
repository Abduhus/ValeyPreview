# PowerShell script to download perfume images
# Run this script in PowerShell

# Create directory for images
$imagesDir = "c:\Games\ValleyPreview\perfume-images"
if (!(Test-Path $imagesDir)) {
    New-Item -ItemType Directory -Path $imagesDir
}

# URLs for perfume images (using more reliable sources)
$images = @(
    @{url="https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=1920&h=800&fit=crop&auto=format&q=90"; filename="chanel-no5.jpg"},
    @{url="https://images.unsplash.com/photo-1588405748880-12d1d2a59db9?w=1920&h=800&fit=crop&auto=format&q=90"; filename="versace-eros.jpg"},
    @{url="https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=1920&h=800&fit=crop&auto=format&q=90"; filename="xerjoff-aventus.jpg"},
    @{url="https://images.unsplash.com/photo-1588405748880-12d1d2a59db9?w=1920&h=800&fit=crop&auto=format&q=90"; filename="dior-sauvage.jpg"},
    @{url="https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?w=1920&h=800&fit=crop&auto=format&q=90"; filename="armani-acqua-di-gio.jpg"}
)

Write-Host "Starting image downloads..." -ForegroundColor Green

foreach ($image in $images) {
    $outputPath = Join-Path $imagesDir $image.filename
    Write-Host "Downloading $($image.filename)..." -ForegroundColor Yellow
    
    try {
        Invoke-WebRequest -Uri $image.url -OutFile $outputPath
        Write-Host "Successfully downloaded $($image.filename)" -ForegroundColor Green
    }
    catch {
        Write-Host "Failed to download $($image.filename): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "Image download process completed!" -ForegroundColor Green
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Convert images to WebP format and resize to 1920x800px" -ForegroundColor Cyan
Write-Host "2. Move optimized images to c:\Games\ValleyPreview\client\src\assets\" -ForegroundColor Cyan
Write-Host "3. Update the brand-showcase.tsx component imports" -ForegroundColor Cyan
Write-Host "4. Replace Unsplash URLs with local image imports" -ForegroundColor Cyan