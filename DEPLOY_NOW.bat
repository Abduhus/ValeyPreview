@echo off
title Railway Deployment for ValleyPreviewqodo
color 0A

echo.
echo ========================================
echo   ValleyPreview Railway Deployment
echo ========================================
echo.

echo Choose your deployment method:
echo.
echo 1. Automated PowerShell Script (Recommended)
echo 2. Automated Node.js Script  
echo 3. Manual Railway CLI Commands
echo 4. Open Railway Web Interface
echo 5. View Deployment Instructions
echo 6. Exit
echo.

set /p choice="Enter your choice (1-6): "

if "%choice%"=="1" (
    echo.
    echo Starting PowerShell deployment script...
    powershell -ExecutionPolicy Bypass -File deploy-railway.ps1
    goto end
)

if "%choice%"=="2" (
    echo.
    echo Starting Node.js deployment script...
    node deploy-to-railway.js
    goto end
)

if "%choice%"=="3" (
    echo.
    echo Manual Railway CLI Commands:
    echo.
    echo 1. railway login
    echo 2. railway init
    echo 3. railway variables set NODE_ENV=production
    echo 4. railway up
    echo.
    echo Run these commands in order.
    goto end
)

if "%choice%"=="4" (
    echo.
    echo Opening Railway web interface...
    start https://railway.app/
    echo.
    echo Instructions:
    echo 1. Sign in with GitHub
    echo 2. Click "New Project"
    echo 3. Select "Deploy from GitHub repo"
    echo 4. Choose: Abduhus/ValeyPreview
    echo 5. Railway will auto-detect configuration
    goto end
)

if "%choice%"=="5" (
    echo.
    echo Opening deployment instructions...
    start notepad RAILWAY_DEPLOYMENT_INSTRUCTIONS.md
    goto end
)

if "%choice%"=="6" (
    echo.
    echo Goodbye!
    goto end
)

echo.
echo Invalid choice. Please try again.
pause
goto start

:end
echo.
echo Deployment process initiated!
echo Check Railway dashboard: https://railway.app/dashboard
echo.
pause