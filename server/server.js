const express = require("express");
const { getJson } = require("serpapi");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "API de Google Videos funcionando correctamente"
  });
});

app.get("/videos", async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.status(400).json({
        error: "Debes enviar el parámetro 'q' en la URL"
      });
    }

    const response = await getJson({
      engine: "google_videos",
      q: query,
      api_key: process.env.SERP_API_KEY
    });

    const results = response.video_results || response.inline_videos || [];

    console.log("RESULTADOS:", results); 

    res.status(200).json(results);

  } catch (error) {
    console.error("Error en el servidor:", error);

    res.status(500).json({
      error: "Error consultando SerpApi"
    });
  }
});

app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});