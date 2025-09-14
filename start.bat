@echo off
REM Start script for ValleyPreview Perfume E-commerce Platform on Windows
REM This script handles both development and production environments

echo === ValleyPreview Perfume E-commerce Platform ===
echo Environment: %NODE_ENV%
if "%NODE_ENV%"=="" echo Environment: development (default)
echo Port: %PORT%
if "%PORT%"=="" echo Port: 5000 (default)

REM Function to check if we're running on Railway
set IS_RAILWAY=
if defined RAILWAY_ENVIRONMENT set IS_RAILWAY=1
if defined RAILWAY_PROJECT_ID set IS_RAILWAY=1

REM Main execution logic
if defined IS_RAILWAY (
    echo Running on Railway
    call :start_production
) else (
    if /I "%NODE_ENV%"=="production" (
        echo Running in production mode
        call :start_production
    ) else (
        echo Running in development mode
        call :start_development
    )
)
goto :eof

REM Function to install dependencies
:install_dependencies
echo Installing project dependencies...
if defined IS_RAILWAY (
    REM On Railway, try npm ci first for faster builds, fallback to npm install if there are issues
    echo Attempting to use npm ci for faster builds...
    npm ci --only=production 2>nul
    if errorlevel 1 (
        echo npm ci failed, falling back to npm install...
        npm install --only=production
    )
) else (
    REM For local development
    npm install
)
if errorlevel 1 (
    echo Error: Failed to install dependencies
    exit /b 1
)
goto :eof

REM Function to install dev dependencies (needed for build)
:install_dev_dependencies
echo Installing development dependencies for build...
npm install --include=dev
if errorlevel 1 (
    echo Error: Failed to install development dependencies
    exit /b 1
)
goto :eof

REM Function to build the project
:build_project
echo Building project...

REM Check if tsc is available, if not install dev dependencies
where tsc >nul 2>&1
if errorlevel 1 (
    call :install_dev_dependencies
)

REM Run build script
npm run build
if errorlevel 1 (
    echo Error: Failed to build project
    exit /b 1
)
goto :eof

REM Function to start development server
:start_development
echo Starting development server...

REM Install all dependencies including dev dependencies
call :install_dependencies
call :install_dev_dependencies

REM Convert images to WebP format (if cwebp is available)
echo Converting images to WebP format...
if exist "client\src\assets\*.jpg" (
    for %%f in (client\src\assets\*.jpg) do (
        echo Converting %%~nf.jpg to WebP...
        cwebp -q 80 "%%f" -o "client\src\assets\%%~nf.webp" 2>nul
    )
)

if exist "client\src\assets\*.png" (
    for %%f in (client\src\assets\*.png) do (
        echo Converting %%~nf.png to WebP...
        cwebp -q 80 "%%f" -o "client\src\assets\%%~nf.webp" 2>nul
    )
)

REM Start the development server
echo Server will be available at http://localhost:%PORT%
if "%PORT%"=="" set PORT=5000
npm run dev
goto :eof

REM Function to start production server
:start_production
echo Starting production server...

REM Install production dependencies
call :install_dependencies

REM On Railway, we might want to skip image conversion for faster deploys
if defined IS_RAILWAY (
    echo Skipping image conversion on Railway for faster deployment
) else (
    REM Convert images to WebP format (if cwebp is available)
    echo Converting images to WebP format...
    if exist "client\src\assets\*.jpg" (
        for %%f in (client\src\assets\*.jpg) do (
            echo Converting %%~nf.jpg to WebP...
            cwebp -q 80 "%%f" -o "client\src\assets\%%~nf.webp" 2>nul
        )
    )

    if exist "client\src\assets\*.png" (
        for %%f in (client\src\assets\*.png) do (
            echo Converting %%~nf.png to WebP...
            cwebp -q 80 "%%f" -o "client\src\assets\%%~nf.webp" 2>nul
        )
    )
)

REM Build the project if not already built or if running locally
if not exist "dist" (
    call :build_project
) else (
    if not defined IS_RAILWAY (
        call :build_project
    ) else (
        echo Using pre-built dist directory
    )
)

REM Start the production server
echo Server will be available at http://localhost:%PORT%
if "%PORT%"=="" set PORT=5000
npm run start
goto :eof