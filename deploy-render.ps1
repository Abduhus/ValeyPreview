# Render Deployment Script for ValleyPreview (PowerShell)
# This script prepares and guides through Render.com deployment

Write-Host "🚀 Starting Render deployment for ValleyPreview..." -ForegroundColor Green
Write-Host ""

# Set execution policy for this session
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force

# Change to script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Function to check if a command exists
function Test-Command($command) {
    try {
        Get-Command $command -ErrorAction Stop
        return $true
    }
    catch {
        return $false
    }
}

# Function to run commands with error handling
function Invoke-SafeCommand($command, $description) {
    Write-Host "📋 $description..." -ForegroundColor Yellow
    try {
        Invoke-Expression $command
        Write-Host "✅ $description completed successfully" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ $description failed: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Check if Node.js is installed
if (-not (Test-Command "node")) {
    Write-Host "❌ Node.js is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if npm is installed
if (-not (Test-Command "npm")) {
    Write-Host "❌ npm is not installed. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    exit 1
}

# Check if git is installed
if (-not (Test-Command "git")) {
    Write-Host "❌ Git is not installed. Please install Git from https://git-scm.com/" -ForegroundColor Red
    exit 1
}

# Check git status
$gitStatus = git status --porcelain
if ($gitStatus) {
    Write-Host "⚠️ You have uncommitted changes:" -ForegroundColor Yellow
    Write-Host $gitStatus
    Write-Host "Please commit your changes before deploying." -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Git repository is clean" -ForegroundColor Green

# Verify Render configuration
Write-Host "🔧 Verifying Render configuration..." -ForegroundColor Yellow

if (-not (Test-Path "render.json")) {
    Write-Host "❌ render.json not found. Creating default configuration..." -ForegroundColor Red
    $renderConfig = @{
        buildCommand = "npm install && npm run build"
        startCommand = "node server-render.js"
        envVars = @(
            @{ key = "NODE_ENV"; value = "production" }
            @{ key = "PORT"; value = "10000" }
        )
    } | ConvertTo-Json -Depth 3
    $renderConfig | Out-File -FilePath "render.json" -Encoding UTF8
    Write-Host "✅ Created render.json" -ForegroundColor Green
}
else {
    Write-Host "✅ render.json found" -ForegroundColor Green
}

if (-not (Test-Path "server-render.js")) {
    Write-Host "❌ server-render.js not found. This is required for Render deployment." -ForegroundColor Red
    exit 1
}
else {
    Write-Host "✅ server-render.js found" -ForegroundColor Green
}

# Test build locally
Write-Host "🔨 Testing build process locally..." -ForegroundColor Yellow
if (-not (Invoke-SafeCommand "npm install" "Installing dependencies")) {
    exit 1
}

if (-not (Invoke-SafeCommand "npm run build" "Building application")) {
    Write-Host "❌ Build failed. Please fix build issues before deploying." -ForegroundColor Red
    exit 1
}

# Push to GitHub
Write-Host "📤 Pushing latest changes to GitHub..." -ForegroundColor Yellow
try {
    git push origin main
    Write-Host "✅ Successfully pushed to GitHub" -ForegroundColor Green
}
catch {
    Write-Host "❌ Failed to push to GitHub. Please ensure your changes are committed and try again." -ForegroundColor Red
    exit 1
}

# Display deployment instructions
Write-Host ""
Write-Host "🌐 Render Deployment Instructions:" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host ""
Write-Host "1. 🔗 Go to Render Dashboard:" -ForegroundColor White
Write-Host "   https://render.com/" -ForegroundColor Gray
Write-Host ""
Write-Host "2. 🔐 Sign in with GitHub" -ForegroundColor White
Write-Host ""
Write-Host "3. ➕ Create New Web Service:" -ForegroundColor White
Write-Host "   - Click 'New +' → 'Web Service'" -ForegroundColor Gray
Write-Host "   - Connect your GitHub repository: Abduhus/ValeyPreview" -ForegroundColor Gray
Write-Host "   - Select the main branch" -ForegroundColor Gray
Write-Host ""
Write-Host "4. ⚙️ Configure Service:" -ForegroundColor White
Write-Host "   - Name: valley-preview-perfume" -ForegroundColor Gray
Write-Host "   - Environment: Node" -ForegroundColor Gray
Write-Host "   - Build Command: npm install && npm run build" -ForegroundColor Gray
Write-Host "   - Start Command: node server-render.js" -ForegroundColor Gray
Write-Host ""
Write-Host "5. 🔧 Set Environment Variables:" -ForegroundColor White
Write-Host "   - NODE_ENV = production" -ForegroundColor Gray
Write-Host "   - PORT = 10000" -ForegroundColor Gray
Write-Host ""
Write-Host "6. 🚀 Deploy:" -ForegroundColor White
Write-Host "   - Click 'Create Web Service'" -ForegroundColor Gray
Write-Host "   - Render will automatically build and deploy" -ForegroundColor Gray
Write-Host ""
Write-Host "7. 📊 Monitor Deployment:" -ForegroundColor White
Write-Host "   - Watch build logs in Render dashboard" -ForegroundColor Gray
Write-Host "   - Check health endpoint: /health" -ForegroundColor Gray
Write-Host "   - Your app will be available at: https://your-service.onrender.com" -ForegroundColor Gray
Write-Host ""

# Display post-deployment checklist
Write-Host "📋 Post-Deployment Checklist:" -ForegroundColor Cyan
Write-Host "=" * 30 -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Verify health endpoint: https://your-app.onrender.com/health" -ForegroundColor Green
Write-Host "✅ Test main application functionality" -ForegroundColor Green
Write-Host "✅ Check logs for any errors" -ForegroundColor Green
Write-Host "✅ Set up custom domain (optional)" -ForegroundColor Green
Write-Host "✅ Configure monitoring alerts" -ForegroundColor Green
Write-Host "✅ Set up database if needed" -ForegroundColor Green
Write-Host ""

Write-Host "🔗 Useful Links:" -ForegroundColor Cyan
Write-Host "   - Render Dashboard: https://dashboard.render.com/" -ForegroundColor Gray
Write-Host "   - Render Docs: https://render.com/docs" -ForegroundColor Gray
Write-Host "   - GitHub Repository: https://github.com/Abduhus/ValeyPreview" -ForegroundColor Gray
Write-Host ""

Write-Host "🎉 Ready for Render deployment!" -ForegroundColor Green
Write-Host "📝 Follow the instructions above to deploy via Render dashboard." -ForegroundColor Yellow

# Ask if user wants to open Render dashboard
Write-Host ""
$openDashboard = Read-Host "Would you like to open the Render dashboard now? (y/n)"
if ($openDashboard -eq "y" -or $openDashboard -eq "Y") {
    Start-Process "https://render.com/"
    Write-Host "🌐 Opening Render dashboard..." -ForegroundColor Green
}

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")