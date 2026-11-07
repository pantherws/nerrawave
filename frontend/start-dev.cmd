@echo off
setlocal
cd /d "%~dp0"

echo.
echo  Nerrawave - reset dev server
echo  =============================
echo.

echo [1/3] Freeing port 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr :3000 ^| findstr LISTENING') do (
  taskkill /F /PID %%a >nul 2>&1
)

echo [2/3] Removing .next cache...
if exist .next rmdir /s /q .next

echo [3/3] Starting Next.js on http://localhost:3000 ...
echo.
echo  Folder: %CD%
echo  About page: http://localhost:3000/about
echo  Tip: View Source on /about and search for "about-solid-panel"
echo.
call npx next dev -p 3000

endlocal
