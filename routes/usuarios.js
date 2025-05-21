import { Router } from 'express';
import UsuariosService from '../services/usuariosService.js';
import config from '../server.js';
import bcrypt from 'bcrypt';

const router = Router();

const usuariosAPI = (app) => {
  app.use('/api/usuarios', router);
  const usuariosService = new UsuariosService();

  // Obtener todos los usuarios
  router.get('/', async (req, res) => {
    try {
      const usuarios = await usuariosService.getUsuarios();
      res.json(usuarios);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  });

  // Obtener la cantidad de usuarios
  router.get('/count', async (req, res) => {
    try {
      const usuarios = await usuariosService.getUsuarios();
      const count = Array.isArray(usuarios) ? usuarios.length : 0;
      res.json({ count });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: 'Error al obtener la cantidad de usuarios' });
    }
  });

  // Obtener la cantidad de usuarios en la última semana
  router.get('/count-last-week', async (req, res) => {
    try {
      // Get current date and date 7 days ago
      const now = new Date();
      const lastWeek = new Date(now);
      lastWeek.setDate(now.getDate() - 7);

      // Get all usuarios
      const usuarios = await usuariosService.getUsuarios();

      // Filter by last week
      const count = Array.isArray(usuarios)
        ? usuarios.filter((r) => {
            const created_at = new Date(r.created_at);
            return created_at >= lastWeek && created_at <= now;
          }).length
        : 0;

      res.json({ count });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: 'Error al obtener la cantidad de usuarios de la última semana',
      });
    }
  });

  // Obtener un usuario por ID usando SQL
  router.get('/:nombreusuario', async (req, res) => {
    try {
      const usuario = await usuariosService.getUsuario(
        req.params.nombreusuario,
      );
      if (!usuario) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
      res.json(usuario);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al obtener el usuario' });
    }
  });

  // Iniciar sesión
  router.post('/login', async (req, res) => {
    const { nombreusuario, contrasena } = req.body;

    try {
      const usuario = await usuariosService.getUsuario(nombreusuario);
      if (!usuario) {
        return res
          .status(401)
          .json({ error: 'Usuario o contraseña incorrectos' });
      }

      const contrasenaValida = await bcrypt.compare(
        contrasena,
        usuario.contrasena_hash,
      );
      if (!contrasenaValida) {
        return res
          .status(401)
          .json({ error: 'Usuario o contraseña incorrectos' });
      }

      res.status(201).json(usuario);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al iniciar sesión' });
    }
  });

  // Crear un nuevo usuario
  router.post('/', async (req, res) => {
    const { contrasena, nombreusuario } = req.body;

    try {
      if (nombreusuario === 'count' || nombreusuario === 'count-last-week') {
        return res
          .status(400)
          .json({ error: 'El nombre de usuario "count" no está permitido' });
      }

      // Hash de la contraseña antes de guardar
      const saltRounds = config.SALT_ROUNDS;
      const contrasena_hash = await bcrypt.hash(contrasena, saltRounds);

      const usuario = await usuariosService.createUsuario({
        contrasena_hash,
        ...req.body,
      });
      res.status(201).json(usuario);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al crear el usuario' });
    }
  });

  // Actualizar un usuario
  router.put('/:nombreusuario', async (req, res) => {
    const { contrasena } = req.body;

    try {
      const saltRounds = config.SALT_ROUNDS;
      const contrasena_hash = await bcrypt.hash(contrasena, saltRounds);
      const nombreusuario = req.params.nombreusuario;
      const usuario = {
        contrasena_hash,
        ...req.body,
      };
      const usuarioNuevo = await usuariosService.updateUsuario(
        nombreusuario,
        usuario,
      );
      res.status(201).json(usuarioNuevo);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al actualizar el usuario' });
    }
  });

  // Eliminar un usuario
  router.delete('/:nombreusuario', async (req, res) => {
    try {
      const nombreusuario = req.params.nombreusuario;
      await usuariosService.deleteUsuario(nombreusuario);
      res.status(204).send();
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al eliminar el usuario' });
    }
  });
};

export default usuariosAPI;
