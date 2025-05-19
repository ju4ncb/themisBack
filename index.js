import express from 'express';
// import colors from 'colors';
import config from './server.js';
import usuariosAPI from './routes/usuarios.js';

const server = express();

server.listen(3000, () => {
  console.log(
    'Servidor backend de themis encendido puesto en el puerto 3000,',
    `http://localhost:${config.port}`,
  );
});

usuariosAPI(server);

server.get('/', (req, res) => {
  res.send('<h1>Prueba</h1>');
  res.end();
});
