@echo off
echo Converting all perfume images to WebP format...
echo.

REM Check if cwebp is installed
where cwebp >nul 2>&1
if %errorlevel% neq 0 (
    echo cwebp not found. Please install WebP tools from:
    echo https://developers.google.com/speed/webp/docs/precompiled
    echo.
    echo Or use an online converter like https://squoosh.app/
    pause
    exit /b
)

REM Set the assets directory
set ASSETS_DIR=client\src\assets

echo Converting images in %ASSETS_DIR%...
echo.

REM Convert all JPG images to WebP
for %%f in ("%ASSETS_DIR%\*.jpg") do (
    echo Converting %%~nxf to WebP...
    cwebp -q 80 "%%f" -o "%%~dpnf.webp"
    echo Done.
    echo.
)

echo All JPG images have been converted to WebP format.
echo Remember to update the import statements in brand-showcase.tsx to use .webp extensions
echo and replace the Unsplash URLs with local image imports.
echo.
pause