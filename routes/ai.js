import { Router } from 'express';
import AIService from '../services/aiService.js';

const router = Router();

const aiAPI = (app) => {
  app.use('/api/usuarios', router);
  const aiService = new AIService();

  // Obtener todos los usuarios
  router.get('/', async (req, res) => {
    try {
      const resultados = await aiService.runModel();
      res.json(resultados);
    } catch (error) {
      res.status(500).json({ error: 'RunModel error', errorMssg: error });
    }
  });
};

export default aiAPI;
