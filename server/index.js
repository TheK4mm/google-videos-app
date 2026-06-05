const config = require("./src/config");
const { createApp } = require("./src/app");

const app = createApp();

app.listen(config.port, () => {
  console.log(`✅ API de Google Videos lista en http://localhost:${config.port}`);
  console.log(`   Prueba: GET http://localhost:${config.port}/api/videos?q=react`);
});
