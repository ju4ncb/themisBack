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
        .json({ error: 'Error al rescatar modelos', errorMssg: error });
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
      res.status(500).json({ error: 'RunModel error', errorMssg: error });
    }
  });
  router.post('/explore', async (req, res) => {
    try {
      const resultados = await aiService.exploreData(req.body);
      res.status(201).json(resultados);
    } catch (error) {
      res.status(500).json({ error: 'ExploreData error', errorMssg: error });
    }
  });
};

export default aiAPI;
