// .env infos
require("dotenv").config();

// Express
const app = require("./app");

// PORT
const PORT = process.env.PORT ?? 3000;

// Listen
app.listen(PORT, () => {
  console.log(`Serveur accessible sur http://localhost:${PORT}`);
});
