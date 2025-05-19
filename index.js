import express from "express";
import colors from "colors";

const server = express();

server.listen(3000, () => {
  console.log(
    "Servidor backend de themis encendido puesto en el puerto 3000,".green,
    "http://localhost:3000".cyan
  );
});

server.get("/", (req, res) => {
  res.send("<h1>Prueba</h1>");
  res.end();
});
