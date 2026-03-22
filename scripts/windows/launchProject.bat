@echo off
setlocal
title launchProject
echo +++ EXECUTING launchProject.bat +++
pushd "%~dp0"
start "" "%~dp0launchBackend.bat"
start "" "%~dp0launchFrontend.bat"
popd
echo +++ EXECUTED launchProject.bat +++
endlocal