@echo off
setlocal
echo +++ EXECUTING launchBackend.bat +++
pushd "%~dp0\..\.."
node backend/src/main.js
popd
pause
echo +++ EXECUTED launchBackend.bat +++
endlocal