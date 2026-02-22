@echo off
title launchProject
echo +++ EXECUTING launchProject.bat +++
cd /d C:\Users\ottoc\projects\ToDoJS\scripts\windows
start cmd /k "launchBackend.bat"
start cmd /k "launchFrontend.bat"   
echo +++ EXECUTED launchProject.bat +++