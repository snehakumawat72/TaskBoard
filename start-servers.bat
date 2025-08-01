@echo off
echo Starting WebPM Development Servers...
echo.

echo Starting Backend Server (Port 5000)...
start "Backend Server" cmd /k "cd /d "%~dp0backend" && npm run dev"

echo Waiting 3 seconds...
timeout /t 3 /nobreak > nul

echo Starting Frontend Server (Port 5175)...
start "Frontend Server" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5175
echo.
pause
