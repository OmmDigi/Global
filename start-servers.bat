@echo off
:: ==============================
:: Start Client and Server
:: ==============================

:: Start Client
start cmd /k "cd /d %~dp0Admin/free-react-tailwind-admin-dashboard-main && npm run dev"

:: Start Server
start cmd /k "cd /d %~dp0api && npm run dev"

start cmd /k "cd /d %~dp0client && npm run dev"

start cmd /k "cd /d %~dp0essl && npm run dev"

start cmd /k "cd /d %~dp0upload && npm run dev"


echo Both Client and Server are starting...
pause
