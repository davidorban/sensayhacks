@echo off
echo Vercel Deployment Monitor - Log Analyzer
echo ======================================
echo.

if "%~1"=="" (
  echo Usage: monitor-logs.bat [log-file]
  echo.
  echo Example: monitor-logs.bat build-error.log
  exit /b 1
)

echo Analyzing log file: %1
echo.
node monitor-deployment.js --log=%1
