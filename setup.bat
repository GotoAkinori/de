cd /d %~dp0

REM npm install
call npm install

REM make required directory
mkdir .\data\format
mkdir .\data\doc
mkdir .\data\schema
