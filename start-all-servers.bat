@echo off
echo Starting WebPM Application...
echo.

echo [1/2] Starting Backend Server...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo [2/2] Starting Frontend Server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo Both servers are starting...
echo - Backend will be available at: http://localhost:5000
echo - Frontend will be available at: http://localhost:5175
echo.
echo Press any key to close this window...
pause > nul
