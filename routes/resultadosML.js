import { Router } from 'express';
import ResultadosMLService from '../services/resultadosMLService.js';

const router = Router();

const resultadosMLApi = (app) => {
  app.use('/api/resultadosml', router);
  const resultadosMLService = new ResultadosMLService();

  // Obtener todos los resultados
  router.get('/', async (req, res) => {
    try {
      const resultadosML = await resultadosMLService.getResultadosML();
      res.json(resultadosML);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al obtener los resultadosML' });
    }
  });

  // Obtener la cantidad de resultadosml
  router.get('/count', async (req, res) => {
    try {
      const resultadosml = await resultadosMLService.getResultadosML();
      const count = Array.isArray(resultadosml) ? resultadosml.length : 0;
      res.json({ count });
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: 'Error al obtener la cantidad de usuarios' });
    }
  });

  // Obtener un resultado por ID
  router.get('/:id_resultado', async (req, res) => {
    try {
      const resultado = await resultadosMLService.getResultadoML(
        req.params.id_resultado,
      );
      if (!resultado) {
        return res.status(404).json({ error: 'Resultado no encontrado' });
      }
      res.json(resultado);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al obtener el resultadoML' });
    }
  });

  // Crear un nuevo resultado
  router.post('/', async (req, res) => {
    try {
      const nuevoResultado = await resultadosMLService.createResultadoML(
        req.body,
      );
      res.status(201).json(nuevoResultado);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al crear el resultadoML' });
    }
  });

  // Actualizar un resultado existente
  router.put('/:id', async (req, res) => {
    try {
      const resultadoActualizado = await resultadosMLService.updateResultadoML(
        req.params.id,
        req.body,
      );
      if (!resultadoActualizado) {
        return res.status(404).json({ error: 'Resultado no encontrado' });
      }
      res.json(resultadoActualizado);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al actualizar el resultadoML' });
    }
  });

  // Eliminar un resultado
  router.delete('/:id', async (req, res) => {
    try {
      const resultadoEliminado = await resultadosMLService.deleteResultadoML(
        req.params.id,
      );
      if (!resultadoEliminado) {
        return res.status(404).json({ error: 'Resultado no encontrado' });
      }
      res.json({ message: 'Resultado eliminado correctamente' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al eliminar el resultadoML' });
    }
  });
};

export default resultadosMLApi;
