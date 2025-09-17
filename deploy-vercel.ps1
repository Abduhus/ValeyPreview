# Vercel Deployment Script for ValleyPreview (PowerShell)
# This script automates the deployment process to Vercel

Write-Host "🚀 Starting Vercel deployment for ValleyPreview..." -ForegroundColor Green
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

# Check if Vercel CLI is installed
if (-not (Test-Command "vercel")) {
    Write-Host "⚠️ Vercel CLI not found. Installing..." -ForegroundColor Yellow
    if (-not (Invoke-SafeCommand "npm install -g vercel" "Installing Vercel CLI")) {
        Write-Host "❌ Failed to install Vercel CLI. Please install manually: npm install -g vercel" -ForegroundColor Red
        exit 1
    }
}

# Check if logged in to Vercel
try {
    vercel whoami | Out-Null
    Write-Host "✅ Already logged in to Vercel" -ForegroundColor Green
}
catch {
    Write-Host "⚠️ Not logged in to Vercel. Please log in..." -ForegroundColor Yellow
    if (-not (Invoke-SafeCommand "vercel login" "Logging in to Vercel")) {
        Write-Host "❌ Failed to log in to Vercel. Please run: vercel login" -ForegroundColor Red
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

# Verify Vercel configuration
Write-Host "🔧 Verifying Vercel configuration..." -ForegroundColor Yellow

if (-not (Test-Path "vercel.json")) {
    Write-Host "❌ vercel.json not found. This is required for Vercel deployment." -ForegroundColor Red
    exit 1
}
else {
    Write-Host "✅ vercel.json found" -ForegroundColor Green
}

if (-not (Test-Path "api/index.js")) {
    Write-Host "❌ api/index.js not found. This is required for Vercel serverless functions." -ForegroundColor Red
    exit 1
}
else {
    Write-Host "✅ api/index.js found" -ForegroundColor Green
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

# Deploy to Vercel
Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Yellow
try {
    vercel --prod
    Write-Host "✅ Successfully deployed to Vercel!" -ForegroundColor Green
}
catch {
    Write-Host "❌ Deployment failed: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Display deployment information
Write-Host ""
Write-Host "🌐 Vercel Deployment Information:" -ForegroundColor Cyan
Write-Host "=" * 50 -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Deployment completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Dashboard: https://vercel.com/dashboard" -ForegroundColor Cyan
Write-Host "📋 View logs: vercel logs" -ForegroundColor Cyan
Write-Host "🔧 Manage domains: vercel domains" -ForegroundColor Cyan
Write-Host ""

# Display post-deployment checklist
Write-Host "📋 Post-Deployment Checklist:" -ForegroundColor Cyan
Write-Host "=" * 30 -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Verify health endpoint: https://your-app.vercel.app/health" -ForegroundColor Green
Write-Host "✅ Test main application functionality" -ForegroundColor Green
Write-Host "✅ Check function logs in Vercel dashboard" -ForegroundColor Green
Write-Host "✅ Set up custom domain (optional)" -ForegroundColor Green
Write-Host "✅ Configure environment variables" -ForegroundColor Green
Write-Host "✅ Set up database if needed" -ForegroundColor Green
Write-Host ""

Write-Host "🔗 Useful Links:" -ForegroundColor Cyan
Write-Host "   - Vercel Dashboard: https://vercel.com/dashboard" -ForegroundColor Gray
Write-Host "   - Vercel Docs: https://vercel.com/docs" -ForegroundColor Gray
Write-Host "   - GitHub Repository: https://github.com/Abduhus/ValeyPreview" -ForegroundColor Gray
Write-Host ""

Write-Host "🎉 Vercel deployment completed!" -ForegroundColor Green

# Ask if user wants to open Vercel dashboard
Write-Host ""
$openDashboard = Read-Host "Would you like to open the Vercel dashboard now? (y/n)"
if ($openDashboard -eq "y" -or $openDashboard -eq "Y") {
    Start-Process "https://vercel.com/dashboard"
    Write-Host "🌐 Opening Vercel dashboard..." -ForegroundColor Green
}

Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")