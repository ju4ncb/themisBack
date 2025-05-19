import { Router } from 'express';
import mysql from 'mysql2/promise';
import config from '../server.js';

const router = Router();

// Simulación de base de datos en memoria
const pool = mysql.createPool({
  host: config.DB_HOST,
  port: config.DB_PORT,
  user: config.DB_USER,
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

const usuariosAPI = (app) => {
  app.use('/api/usuarios', router);

  // Obtener todos los usuarios
  router.get('/', async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM usuarios');
      res.json(rows);
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Error al obtener los usuarios', errorMssg: error });
    }
  });

  // Obtener un usuario por ID usando SQL
  router.get('/:nombreusuario', async (req, res) => {
    try {
      const [rows] = await pool.query(
        'SELECT * FROM usuarios WHERE nombreusuario = ?',
        [req.params.nombreusuario],
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(rows[0]);
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Error al obtener el usuario', errorMssg: error });
    }
  });

  // Crear un nuevo usuario
  router.post('/', async (req, res) => {
    const {
      nombreusuario,
      nombres,
      apellidos,
      direccion,
      telefono,
      correo,
      contrasena_hash,
      id_rol,
    } = req.body;

    try {
      const now = new Date();
      const [result] = await pool.query(
        `INSERT INTO usuarios 
                (nombreusuario, nombres, apellidos, direccion, telefono, correo, contrasena_hash, id_rol, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          nombreusuario,
          nombres,
          apellidos,
          direccion,
          telefono,
          correo,
          contrasena_hash,
          id_rol,
          now,
          now,
        ],
      );
      const [usuario] = await pool.query(
        'SELECT * FROM usuarios WHERE id_usuario = ?',
        [result.insertId],
      );
      res.status(201).json(usuario[0]);
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Error al crear el usuario', errorMssg: error });
    }
  });

  // Actualizar un usuario
  router.put('/:nombreusuario', async (req, res) => {
    const {
      nombres,
      apellidos,
      direccion,
      telefono,
      correo,
      contrasena_hash,
      id_rol,
    } = req.body;

    try {
      // Verificar si el usuario existe
      const [rows] = await pool.query(
        'SELECT * FROM usuarios WHERE nombreusuario = ?',
        [req.params.nombreusuario],
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Actualizar el usuario
      await pool.query(
        `UPDATE usuarios SET 
                nombres = COALESCE(?, nombres),
                apellidos = COALESCE(?, apellidos),
                direccion = COALESCE(?, direccion),
                telefono = COALESCE(?, telefono),
                correo = COALESCE(?, correo),
                contrasena_hash = COALESCE(?, contrasena_hash),
                id_rol = COALESCE(?, id_rol),
                updated_at = ?
            WHERE nombreusuario = ?`,
        [
          nombres,
          apellidos,
          direccion,
          telefono,
          correo,
          contrasena_hash,
          id_rol,
          new Date(),
          req.params.nombreusuario,
        ],
      );

      // Devolver el usuario actualizado
      const [updatedRows] = await pool.query(
        'SELECT * FROM usuarios WHERE nombreusuario = ?',
        [req.params.nombreusuario],
      );
      res.json(updatedRows[0]);
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Error al actualizar el usuario', errorMssg: error });
    }
  });

  // Eliminar un usuario
  router.delete('/:nombreusuario', async (req, res) => {
    try {
      // Verificar si el usuario existe
      const [rows] = await pool.query(
        'SELECT * FROM usuarios WHERE nombreusuario = ?',
        [req.params.nombreusuario],
      );
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Eliminar el usuario
      await pool.query('DELETE FROM usuarios WHERE nombreusuario = ?', [
        req.params.nombreusuario,
      ]);
      res.status(204).send();
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Error al eliminar el usuario', errorMssg: error });
    }
  });
};

export default usuariosAPI;
