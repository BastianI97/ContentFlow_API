
require("dotenv").config();

const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const URI = process.env.MONGODB_URI;

async function iniciarServidor() {
  if (!URI) {
    console.error("Falta MONGODB_URI en el archivo .env");
    process.exit(1);
  }

  const client = new MongoClient(URI, {
    serverSelectionTimeoutMS: 10000
  });

  try {
    await client.connect();

    const db = client.db(process.env.DB_NAME);
    await db.command({ ping: 1 });

    console.log("Conexión exitosa a MongoDB Atlas");
    console.log("Base de datos:", db.databaseName);

    app.get("/", (req, res) => {
      res.json({
        mensaje: "API REST ContentFlow funcionando"
      });
    });


app.get("/usuarios", async (req, res) => {
  try {
    const usuarios = await db
      .collection("usuarios")
      .find({})
      .limit(10)
      .toArray();

    res.status(200).json(usuarios);

  } catch (error) {
    console.error("Error al consultar usuarios:", error.message);

    res.status(500).json({
      error: "No se pudieron obtener los usuarios"
    });
  }
});



app.get("/publicaciones", async (req, res) => {
  try {
    const publicaciones = await db
      .collection("publicaciones")
      .find({})
      .limit(10)
      .toArray();

    res.status(200).json(publicaciones);

  } catch (error) {
    console.error("Error al consultar publicaciones:", error.message);

    res.status(500).json({
      error: "No se pudieron obtener las publicaciones"
    });
  }
});



app.post("/usuarios", async (req, res) => {
  try {
    const { _id, nombre, correo, pais, genero, dispositivo } = req.body;

    if (
      typeof _id !== "string" || !_id.trim() ||
      typeof nombre !== "string" || !nombre.trim() ||
      typeof correo !== "string" || !correo.trim()
    ) {
      return res.status(400).json({
        error: "ID, nombre y correo son obligatorios"
      });
    }

    const nuevoUsuario = {
      _id,
      nombre,
      correo,
      pais: pais || "No especificado",
      genero: genero || "No especificado",
      fecha_registro: new Date(),
      dispositivo: dispositivo || "Desktop"
    };

    await db.collection("usuarios").insertOne(nuevoUsuario);

    console.log("Usuario creado:", _id);

    res.status(201).json({
      mensaje: "Usuario registrado correctamente",
      usuario: nuevoUsuario
    });

  } catch (error) {
    console.error("Error al registrar usuario:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        error: "Ya existe un usuario con ese ID"
      });
    }

    res.status(500).json({
      error: "No se pudo registrar el usuario"
    });
  }
});




app.post("/publicaciones", async (req, res) => {
  try {
    const {
      _id,
      usuario_id,
      contenido,
      categoria,
      hashtags,
      tipo
    } = req.body;

    if (
      typeof _id !== "string" || !_id.trim() ||
      typeof usuario_id !== "string" || !usuario_id.trim() ||
      typeof contenido !== "string" || !contenido.trim() ||
      typeof categoria !== "string" || !categoria.trim() ||
      !Array.isArray(hashtags) ||
      !hashtags.every(h => typeof h === "string") ||
      !["Texto", "Imagen", "Video"].includes(tipo)
    ) {
      return res.status(400).json({
        error: "Datos de publicación inválidos o incompletos"
      });
    }

    const usuario = await db.collection("usuarios").findOne({
      _id: usuario_id
    });

    if (!usuario) {
      return res.status(404).json({
        error: "El usuario asociado no existe"
      });
    }

    const nuevaPublicacion = {
      _id,
      usuario_id,
      contenido,
      fecha_publicacion: new Date(),
      categoria,
      hashtags,
      tipo
    };

    await db.collection("publicaciones").insertOne(nuevaPublicacion);

    console.log("Publicación creada:", _id);

    res.status(201).json({
      mensaje: "Publicación registrada correctamente",
      publicacion: nuevaPublicacion
    });

  } catch (error) {
    console.error("Error al registrar publicación:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({
        error: "Ya existe una publicación con ese ID"
      });
    }

    res.status(500).json({
      error: "No se pudo registrar la publicación"
    });
  }
});




    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("Error al conectar con MongoDB Atlas:", error.message);
    await client.close();
    process.exit(1);
  }
}

iniciarServidor();
