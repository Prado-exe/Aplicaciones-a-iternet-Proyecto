@echo off

REM === Ruta a la carpeta donde está mongodump.exe ===
set MONGO_TOOLS="C:\RUTA\A\MONGODB-TOOLS\bin"

REM === URI de conexión ===
set MONGO_URI=mongodb://usuario_admin:contraseña@10.147.20.10:27017/fablab_db?authSource=admin

REM === Carpeta local sincronizada con Google Drive ===
REM (ajusta esta ruta si tu Drive está en otro lado)
set DRIVE_PATH="G:\Mi unidad\Backups_FabLab"


echo.
echo [INFO] Creando backup en %DRIVE_PATH%\backup_%DATE% ...
%MONGO_TOOLS%\mongodump.exe --uri="%MONGO_URI%" --out=%DRIVE_PATH%\backup_%DATE%

echo.
echo [INFO] Backup completado. Los archivos se sincronizaran con Google Drive.
pause
