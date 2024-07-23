Para levantar el software en un entorno local, debe realizar los siguientes pasos:

###  (Node.js y TypeScript):

1. Clone el repositorio desde la URL proporcionada.
2. Navegue hasta el directorio del proyecto backend.
3. Cree la imagen del contenedor `docker build . -t servicio-mttp:latest`.
5. Inicie el servidor con el comando `docker run -p 3000:3000 servicio-mttp:latest`.

### Docker componse

* Levante la aplicación en el entorno de desarrollo:
`docker-compose up --build app-dev`
* Levante la aplicación en el entorno de producción:
`docker-compose up --build app-prod`