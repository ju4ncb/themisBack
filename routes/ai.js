import { Router } from 'express';
import AIService from '../services/aiService.js';

const router = Router();

const aiAPI = (app) => {
  app.use('/api/ai', router);
  const aiService = new AIService();

  router.get('/', async (req, res) => {
    res.send(`<h1>Ruta accesible</h1>`);
  });

  router.get('/modelos/', async (req, res) => {
    try {
      const resultados = await aiService.getModels();
      res.json(resultados);
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Error al rescatar modelos', errorMssg: error.message });
    }
  });

  router.get('/graphs/', async (req, res) => {
    try {
      const resultados = await aiService.getGraphs();
      res.json(resultados);
    } catch (error) {
      res.status(500).json({
        error: 'Error al rescatar tipos de graficas',
        errorMssg: error,
      });
    }
  });

  router.post('/', async (req, res) => {
    try {
      const resultados = await aiService.runModel(req.body);
      res.status(201).json(resultados);
    } catch (error) {
      res
        .status(500)
        .json({ error: 'Error inesperado', errorMssg: error.message });
    }
  });

  router.post('/univariable/', async (req, res) => {
    try {
      const resultados = await aiService.univariableDataExploration(req.body);
      res.status(201).json(resultados);
    } catch (error) {
      res.status(500).json({
        error: 'UnivariableDataExploration error',
        errorMssg: error.message,
      });
    }
  });

  router.post('/bivariable/', async (req, res) => {
    try {
      const resultados = await aiService.bivariableDataExploration(req.body);
      res.status(201).json(resultados);
    } catch (error) {
      res.status(500).json({
        error: 'BivariableDataExploration error',
        errorMssg: error.message,
      });
    }
  });

  router.post('/multivariable/', async (req, res) => {
    try {
      const resultados = await aiService.multivariableDataExploration(req.body);
      res.status(201).json(resultados);
    } catch (error) {
      res.status(500).json({
        error: 'MultivariableDataExploration error',
        errorMssg: error.message,
      });
    }
  });
};

export default aiAPI;
