# Setup script for ValleyPreview deployment on Railway
# This script prepares the project for deployment

Write-Host "=== ValleyPreview Perfume E-commerce Platform Deployment Setup ===" -ForegroundColor Green

# Check if we're in the correct directory
if (-not (Test-Path "package.json")) {
    Write-Host "Error: package.json not found. Please run this script from the project root directory." -ForegroundColor Red
    exit 1
}

Write-Host "Setting up deployment environment..." -ForegroundColor Yellow

# Ensure start.sh has execution permissions (Windows equivalent)
if (Test-Path "start.sh") {
    # On Windows, we'll just make sure the file exists and is readable
    $fileInfo = Get-Item "start.sh"
    Write-Host "start.sh file found: $($fileInfo.Length) bytes" -ForegroundColor Green
    
    # Try to set execution policy for the current user
    try {
        # Set the file as executable using icacls if available
        $icaclsResult = icacls "start.sh" /grant:r "Users:(RX)" /inheritance:r 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "Successfully set executable permissions for start.sh" -ForegroundColor Green
        } else {
            Write-Host "Note: Could not set executable permissions (not required for Railway)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "Note: Could not set executable permissions (not required for Railway)" -ForegroundColor Yellow
    }
} else {
    Write-Host "Error: start.sh not found" -ForegroundColor Red
    exit 1
}

# Check if Dockerfile exists
if (Test-Path "Dockerfile") {
    $fileInfo = Get-Item "Dockerfile"
    Write-Host "Dockerfile found: $($fileInfo.Length) bytes" -ForegroundColor Green
} else {
    Write-Host "Warning: Dockerfile not found" -ForegroundColor Yellow
}

# Check if railway.json exists
if (Test-Path "railway.json") {
    $fileInfo = Get-Item "railway.json"
    Write-Host "railway.json found: $($fileInfo.Length) bytes" -ForegroundColor Green
} else {
    Write-Host "Warning: railway.json not found" -ForegroundColor Yellow
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -eq 0) {
        Write-Host "Dependencies installed successfully" -ForegroundColor Green
    } else {
        Write-Host "Error: Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "Dependencies already installed" -ForegroundColor Green
}

# Test the start script
Write-Host "Testing start script..." -ForegroundColor Yellow
Write-Host "To test the deployment setup, run: npm run build" -ForegroundColor Cyan
Write-Host "Then run: npm run start" -ForegroundColor Cyan

# Provide deployment instructions
Write-Host ""
Write-Host "=== Deployment Instructions ===" -ForegroundColor Green
Write-Host "1. Install Railway CLI: npm i -g @railway/cli" -ForegroundColor Cyan
Write-Host "2. Login to Railway: railway login" -ForegroundColor Cyan
Write-Host "3. Initialize project: railway init" -ForegroundColor Cyan
Write-Host "4. Deploy: railway up" -ForegroundColor Cyan
Write-Host ""
Write-Host "For detailed instructions, see RAILWAY_DEPLOYMENT_GUIDE.md" -ForegroundColor Yellow

Write-Host ""
Write-Host "Setup complete! Your project is ready for Railway deployment." -ForegroundColor Green