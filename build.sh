#!/bin/bash
rm -rf build
mkdir build

# Copia los archivos necesarios a la carpeta de compilación
cp -r src build/
cp package*.json build/
cp Dockerfile build/
cp docker-compose.yml build/
cp .env.prod build/

cd build

docker build -t mttp-prod .

cd ..

echo "Compilación completada. La carpeta 'build' está lista para desplegar."