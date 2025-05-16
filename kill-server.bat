@echo off
echo Killing any Node.js processes on port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    if not %%a==0 (
        echo Found process: %%a
        taskkill /F /PID %%a /T
    )
)
echo Done.
