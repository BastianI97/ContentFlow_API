# ContentFlow — API REST

## Descripción

API REST desarrollada para la Evaluación Parcial 2 de Bases de Datos No Relacionales de Duoc UC.

El proyecto permite consultar y registrar usuarios y publicaciones mediante solicitudes HTTP, utilizando MongoDB Atlas como base de datos.

## Tecnologías utilizadas

- Node.js
- Express
- MongoDB Atlas
- MongoDB Node.js Driver
- dotenv
- Postman

## Requisitos

- Node.js y npm instalados.
- Acceso a un clúster MongoDB Atlas.
- Usuario de base de datos con permisos de lectura y escritura.
- Archivo `.env` configurado.

## Instalación

1. Descargar o clonar el repositorio.
2. Abrir la carpeta `ContentFlow_API` en VS Code.
3. Ejecutar `npm install`.
4. Crear un archivo `.env` utilizando `.env.example` como referencia.
5. Configurar `MONGODB_URI`, `DB_NAME` y `PORT`.
6. Ejecutar `node server.js`.

La API estará disponible en `http://localhost:3000`.

## Endpoints

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/` | Comprueba que la API está funcionando |
| GET | `/usuarios` | Recupera hasta 10 usuarios |
| GET | `/publicaciones` | Recupera hasta 10 publicaciones |
| POST | `/usuarios` | Registra un usuario |
| POST | `/publicaciones` | Registra una publicación |

## Validaciones y manejo de errores

La API implementa validaciones de campos obligatorios, tipos de datos e integridad referencial entre publicaciones y usuarios.

Utiliza códigos HTTP para comunicar el resultado de las operaciones:

- `200`: consulta exitosa.
- `201`: registro creado.
- `400`: datos inválidos o incompletos.
- `404`: usuario asociado inexistente.
- `409`: identificador duplicado.
- `500`: error interno.

## Pruebas

Las solicitudes HTTP están disponibles en el archivo exportado de Postman `ContentFlow_API_Evaluacion2.postman_collection.json`.

Las operaciones de inserción fueron verificadas directamente en MongoDB Compass.

## Seguridad

Las credenciales se almacenan en `.env`, archivo excluido del repositorio mediante `.gitignore`.

El archivo `.env.example` contiene únicamente valores de ejemplo.

## Limitaciones

- Los endpoints GET devuelven un máximo de 10 documentos.
- La API es un prototipo académico y no incorpora autenticación HTTP.
- La aplicación requiere acceso autorizado al clúster MongoDB Atlas.
- Los registros de prueba deben identificarse y administrarse separadamente de los datos originales.