# Railway Deployment Script for ValleyPreview (PowerShell)
# This script automates the deployment process to Railway

Write-Host "🚀 Starting Railway deployment for ValleyPreview..." -ForegroundColor Green
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

# Check if Railway CLI is installed
if (-not (Test-Command "railway")) {
    Write-Host "⚠️ Railway CLI not found. Installing..." -ForegroundColor Yellow
    if (-not (Invoke-SafeCommand "npm install -g @railway/cli" "Installing Railway CLI")) {
        Write-Host "❌ Failed to install Railway CLI. Please install manually: npm install -g @railway/cli" -ForegroundColor Red
        exit 1
    }
}

# Check if logged in to Railway
try {
    railway whoami | Out-Null
    Write-Host "✅ Already logged in to Railway" -ForegroundColor Green
}
catch {
    Write-Host "⚠️ Not logged in to Railway. Please log in..." -ForegroundColor Yellow
    if (-not (Invoke-SafeCommand "railway login" "Logging in to Railway")) {
        Write-Host "❌ Failed to log in to Railway. Please run: railway login" -ForegroundColor Red
        exit 1
    }
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

# Check if Railway project is initialized
if (-not (Test-Path ".railway")) {
    Write-Host "🔧 Initializing Railway project..." -ForegroundColor Yellow
    if (-not (Invoke-SafeCommand "railway init" "Initializing Railway project")) {
        exit 1
    }
}
else {
    Write-Host "✅ Railway project already initialized" -ForegroundColor Green
}

# Set environment variables
Write-Host "🔧 Setting environment variables..." -ForegroundColor Yellow
$envVars = @(
    "NODE_ENV=production",
    "PORT=5000"
)

foreach ($envVar in $envVars) {
    try {
        railway variables set $envVar
        Write-Host "✅ Set $envVar" -ForegroundColor Green
    }
    catch {
        Write-Host "⚠️ Failed to set $envVar, continuing..." -ForegroundColor Yellow
    }
}

# Deploy to Railway
Write-Host "🚀 Deploying to Railway..." -ForegroundColor Yellow
try {
    railway up
    Write-Host "✅ Successfully deployed to Railway!" -ForegroundColor Green
}
catch {
    Write-Host "❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Get deployment URL
try {
    $url = railway domain
    if ($url -and $url -ne "No custom domain set") {
        Write-Host "🌍 Your application is available at: $url" -ForegroundColor Green
    }
    else {
        Write-Host "🌍 Your application is deployed! Check the Railway dashboard for the URL." -ForegroundColor Green
    }
}
catch {
    Write-Host "🌍 Deployment completed! Check the Railway dashboard for the URL." -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host "📊 You can monitor your deployment at: https://railway.app/dashboard" -ForegroundColor Cyan
Write-Host "📋 Check logs with: railway logs" -ForegroundColor Cyan
Write-Host "🔧 Manage environment variables with: railway variables" -ForegroundColor Cyan

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")