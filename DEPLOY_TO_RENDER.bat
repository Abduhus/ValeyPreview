@echo off
title Render Deployment for ValleyPreviewqodo
color 0B

echo.
echo ==========================================
echo   ValleyPreview Render.com Deployment
echo ==========================================
echo.

echo Choose your deployment method:
echo.
echo 1. Automated PowerShell Script (Recommended)
echo 2. Automated Node.js Script  
echo 3. Open Render Web Dashboard
echo 4. View Deployment Guide
echo 5. Test Build Locally
echo 6. Check Project Status
echo 7. Exit
echo.

set /p choice="Enter your choice (1-7): "

if "%choice%"=="1" (
    echo.
    echo Starting PowerShell deployment script...
    powershell -ExecutionPolicy Bypass -File deploy-render.ps1
    goto end
)

if "%choice%"=="2" (
    echo.
    echo Starting Node.js deployment script...
    node deploy-to-render.js
    goto end
)

if "%choice%"=="3" (
    echo.
    echo Opening Render web dashboard...
    start https://render.com/
    echo.
    echo Instructions:
    echo 1. Sign in with GitHub
    echo 2. Click "New +" then "Web Service"
    echo 3. Connect repository: Abduhus/ValeyPreview
    echo 4. Configure:
    echo    - Build Command: npm install ^&^& npm run build
    echo    - Start Command: node server-render.js
    echo    - Environment Variables:
    echo      NODE_ENV=production
    echo      PORT=10000
    echo 5. Click "Create Web Service"
    goto end
)

if "%choice%"=="4" (
    echo.
    echo Opening deployment guide...
    if exist "RENDER_DEPLOYMENT_GUIDE.md" (
        start notepad RENDER_DEPLOYMENT_GUIDE.md
    ) else (
        echo Deployment guide not found. Please check the project files.
    )
    goto end
)

if "%choice%"=="5" (
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

if "%choice%"=="6" (
    echo.
    echo Checking project status...
    echo.
    echo ✅ Checking required files:
    if exist "package.json" (echo ✅ package.json found) else (echo ❌ package.json missing)
    if exist "render.json" (echo ✅ render.json found) else (echo ❌ render.json missing)
    if exist "server-render.js" (echo ✅ server-render.js found) else (echo ❌ server-render.js missing)
    if exist ".nvmrc" (echo ✅ .nvmrc found) else (echo ⚠️ .nvmrc not found)
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

if "%choice%"=="7" (
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
echo    - Render Dashboard: https://dashboard.render.com/
echo    - GitHub Repository: https://github.com/Abduhus/ValeyPreview
echo    - Health Check: https://your-app.onrender.com/health
echo.
pause