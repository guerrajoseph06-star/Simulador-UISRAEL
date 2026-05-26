@echo off
echo ================================================
echo  Publicando cambios del Simulador UISRAEL...
echo ================================================
echo.

cd /d "%~dp0"

xcopy /Y /Q "C:\Users\Usuario\Documents\GitHub\Simulador UISRAEL\index.html" "%~dp0"
xcopy /Y /Q "C:\Users\Usuario\Documents\GitHub\Simulador UISRAEL\manifest.json" "%~dp0"
xcopy /Y /Q "C:\Users\Usuario\Documents\GitHub\Simulador UISRAEL\sw.js" "%~dp0"

git add -A
git commit -m "actualizar simulador"
git push origin main

echo.
echo ================================================
echo  LISTO! Cambios publicados. Espera 2 minutos.
echo ================================================
pause
