@echo off
echo Converting JPG images to WebP format...
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

REM Convert images in the assets folder
set ASSETS_DIR=client\src\assets

if exist "%ASSETS_DIR%\chanel-no5.jpg" (
    cwebp -q 80 "%ASSETS_DIR%\chanel-no5.jpg" -o "%ASSETS_DIR%\chanel-no5.webp"
    echo Converted chanel-no5.jpg to WebP
)

if exist "%ASSETS_DIR%\xerjoff-aventus.jpg" (
    cwebp -q 80 "%ASSETS_DIR%\xerjoff-aventus.jpg" -o "%ASSETS_DIR%\xerjoff-aventus.webp"
    echo Converted xerjoff-aventus.jpg to WebP
)

if exist "%ASSETS_DIR%\armani-acqua-di-gio.jpg" (
    cwebp -q 80 "%ASSETS_DIR%\armani-acqua-di-gio.jpg" -o "%ASSETS_DIR%\armani-acqua-di-gio.webp"
    echo Converted armani-acqua-di-gio.jpg to WebP
)

echo.
echo Conversion complete!
echo Remember to update the import statements in brand-showcase.tsx to use .webp extensions
pause