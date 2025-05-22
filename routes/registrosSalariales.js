import { Router } from 'express';
import RegistrosSalarialesService from '../services/registrosSalarialesService.js';

const router = Router();

const registrosSalarialesApi = (app) => {
  app.use('/api/registrossalariales', router);
  const registrosSalarialesService = new RegistrosSalarialesService();

  // Obtener todos los registros
  router.get('/', async (req, res) => {
    try {
      const registrosSalariales =
        await registrosSalarialesService.getRegistrosSalariales();
      res.json(registrosSalariales);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: 'Error al obtener los registros salariales' });
    }
  });

  // Obtener la cantidad de registrosSalariales
  router.get('/count', async (req, res) => {
    try {
      const registrosSalariales =
        await registrosSalarialesService.getRegistrosSalariales();
      const count = Array.isArray(registrosSalariales)
        ? registrosSalariales.length
        : 0;
      res.json({ count });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        error: 'Error al obtener la cantidad de registros salariales',
      });
    }
  });

  // Obtener un registro por ID
  router.get('/:id_registro', async (req, res) => {
    try {
      const registro = await registrosSalarialesService.getRegistroSalarial(
        req.params.id_registro,
      );
      if (!registro) {
        return res.status(404).json({ error: 'Registro no encontrado' });
      }
      res.json(registro);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al obtener el registro' });
    }
  });

  // Crear un nuevo registro
  router.post('/', async (req, res) => {
    try {
      const nuevoRegistro =
        await registrosSalarialesService.createRegistroSalarial(req.body);
      res.status(201).json(nuevoRegistro);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al crear el registro' });
    }
  });

  // Actualizar un registro existente
  router.put('/:id_registro', async (req, res) => {
    try {
      const registroActualizado =
        await registrosSalarialesService.updateRegistroSalarial(
          req.params.id_registro,
          req.body,
        );
      if (!registroActualizado) {
        return res.status(404).json({ error: 'Registro no encontrado' });
      }
      res.json(registroActualizado);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al actualizar el registro' });
    }
  });

  // Eliminar un resultado
  router.delete('/:id_registro', async (req, res) => {
    try {
      const registroEliminado =
        await registrosSalarialesService.deleteRegistroSalarial(
          req.params.id_registro,
        );
      if (!registroEliminado) {
        return res.status(404).json({ error: 'Registro no encontrado' });
      }
      res.json({ message: 'Registro eliminado correctamente' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al eliminar el registro' });
    }
  });
};

export default registrosSalarialesApi;
