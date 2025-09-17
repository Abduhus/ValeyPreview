@echo off
echo Starting Railway deployment for ValleyPreview...
echo.

REM Change to the project directory
cd /d "%~dp0"

REM Run the deployment script
node deploy-to-railway.js

REM Pause to see results
pause