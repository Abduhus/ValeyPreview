@echo off
title Vercel Deployment for ValleyPreviewqodo
color 0E

echo.
echo ==========================================
echo   ValleyPreview Vercel Deployment
echo ==========================================
echo.

echo Choose your deployment method:
echo.
echo 1. Automated PowerShell Script (Recommended)
echo 2. Automated Node.js Script  
echo 3. Vercel CLI Commands
echo 4. Open Vercel Web Dashboard
echo 5. View Deployment Guide
echo 6. Validate Vercel Configuration
echo 7. Test Build Locally
echo 8. Check Project Status
echo 9. Exit
echo.

set /p choice="Enter your choice (1-9): "

if "%choice%"=="1" (
    echo.
    echo Starting PowerShell deployment script...
    powershell -ExecutionPolicy Bypass -File deploy-vercel.ps1
    goto end
)

if "%choice%"=="2" (
    echo.
    echo Starting Node.js deployment script...
    node deploy-to-vercel.js
    goto end
)

if "%choice%"=="3" (
    echo.
    echo Vercel CLI Commands:
    echo.
    echo 1. vercel login
    echo 2. vercel --prod
    echo.
    echo Run these commands in order.
    echo.
    echo Starting Vercel CLI deployment...
    vercel --prod
    goto end
)

if "%choice%"=="4" (
    echo.
    echo Opening Vercel web dashboard...
    start https://vercel.com/
    echo.
    echo Instructions:
    echo 1. Sign in with GitHub
    echo 2. Click "Add New..." then "Project"
    echo 3. Import repository: Abduhus/ValeyPreview
    echo 4. Configure:
    echo    - Framework Preset: Other
    echo    - Build Command: npm run build
    echo    - Output Directory: dist/public
    echo 5. Click "Deploy"
    goto end
)

if "%choice%"=="5" (
    echo.
    echo Opening deployment guide...
    if exist "VERCEL_DEPLOYMENT_GUIDE.md" (
        start notepad VERCEL_DEPLOYMENT_GUIDE.md
    ) else (
        echo Deployment guide not found. Please check the project files.
    )
    goto end
)

if "%choice%"=="6" (
    echo.
    echo Validating Vercel configuration...
    node validate-vercel-config.js
    if errorlevel 1 (
        echo ❌ Configuration validation failed
        goto end
    )
    echo ✅ Configuration is valid!
    goto end
)

if "%choice%"=="7" (
    echo.
    echo Testing build locally...
    echo Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        goto end
    )
    echo Building application...
    npm run build
    if errorlevel 1 (
        echo ❌ Build failed
        goto end
    )
    echo ✅ Build successful! Ready for deployment.
    goto end
)

if "%choice%"=="8" (
    echo.
    echo Checking project status...
    echo.
    echo ✅ Checking required files:
    if exist "package.json" (echo ✅ package.json found) else (echo ❌ package.json missing)
    if exist "vercel.json" (echo ✅ vercel.json found) else (echo ❌ vercel.json missing)
    if exist "api\index.js" (echo ✅ api/index.js found) else (echo ❌ api/index.js missing)
    echo.
    echo ✅ Checking Vercel CLI:
    vercel --version
    if errorlevel 1 (
        echo ❌ Vercel CLI not installed. Run: npm install -g vercel
    ) else (
        echo ✅ Vercel CLI installed
    )
    echo.
    echo ✅ Checking git status:
    git status --porcelain
    if errorlevel 1 (
        echo ❌ Git repository issue
    ) else (
        echo ✅ Git repository OK
    )
    echo.
    echo ✅ Checking remote repository:
    git remote get-url origin
    echo.
    goto end
)

if "%choice%"=="9" (
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
echo Deployment process completed!
echo.
echo 🔗 Useful Links:
echo    - Vercel Dashboard: https://vercel.com/dashboard
echo    - GitHub Repository: https://github.com/Abduhus/ValeyPreview
echo    - Health Check: https://your-app.vercel.app/health
echo    - Vercel Health: https://your-app.vercel.app/vercel/health
echo.
pause