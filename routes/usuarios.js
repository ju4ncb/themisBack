import { Router } from 'express';
import UsuariosService from '../services/usuariosService.js';

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
      res
        .status(500)
        .json({ error: 'Error al obtener los usuarios', errorMssg: error });
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
      const usuario = await usuariosService.createUsuario(
        nombreusuario,
        nombres,
        apellidos,
        direccion,
        telefono,
        correo,
        contrasena_hash,
        id_rol,
      );
      res.status(201).json(usuario);
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
      const nombreusuario = req.params.nombreusuario;
      const usuario = {
        nombres,
        apellidos,
        direccion,
        telefono,
        correo,
        contrasena_hash,
        id_rol,
      };
      const usuarioNuevo = await usuariosService.updateUsuarioPorNombreUsuario(
        nombreusuario,
        usuario,
      );
      res.json(usuarioNuevo);
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Error al actualizar el usuario', errorMssg: error });
    }
  });

  // Eliminar un usuario
  router.delete('/:nombreusuario', async (req, res) => {
    try {
      const nombreusuario = req.params.nombreusuario;
      await usuariosService.deleteUsuario(nombreusuario);
      res.status(204).send();
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Error al eliminar el usuario', errorMssg: error });
    }
  });
};

export default usuariosAPI;
