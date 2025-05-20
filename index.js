import express from 'express';
// import colors from 'colors';
import bodyParser from 'body-parser';
import config from './server.js';
import usuariosAPI from './routes/usuarios.js';
import cors from 'cors';

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const server = express();
server.use(cors(corsOptions));
server.use(bodyParser.json());
process.env.TZ = 'America/Bogota';

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
