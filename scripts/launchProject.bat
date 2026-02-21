@echo off
title launchProject
echo +++ EXECUTING launchProject.bat +++
start cmd /k "launchBackend.bat"
start cmd /k "launchFrontend.bat"   
echo +++ EXECUTED launchProject.bat +++