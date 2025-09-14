# PowerShell script to make start.sh executable on Windows
# This is needed for Railway deployment

Write-Host "Setting executable permissions for start.sh..." -ForegroundColor Green

# Check if start.sh exists
if (Test-Path "start.sh") {
    # Set the file as executable
    try {
        # Using icacls to grant execute permissions
        icacls "start.sh" /grant:r "Users:(RX)" /inheritance:r > $null
        Write-Host "✅ Successfully set executable permissions for start.sh" -ForegroundColor Green
    } catch {
        Write-Host "⚠️ Failed to set executable permissions using icacls" -ForegroundColor Yellow
        Write-Host "This might not be an issue for Railway deployment" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ start.sh not found!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Setup complete!" -ForegroundColor Green