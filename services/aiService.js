import mysql from 'mysql2/promise';
import config from '../server.js';
import axios from 'axios';

const FLASK_API_BASE =
  process.env.NODE_ENV === 'production'
    ? 'https://nothingfornow.com'
    : 'http://localhost:8000';

const pool = mysql.createPool({
  host: config.DB_HOST,
  port: config.DB_PORT,
  user: config.DB_USER,
  database: config.DB_NAME,
  timezone: config.TZ,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

class AIService {
  async getModels() {
    const response = await axios.get(`${FLASK_API_BASE}/model-types`);
    return response.data;
  }

  async getGraphs() {
    const response = await axios.get(`${FLASK_API_BASE}/graph-types`);
    return response.data;
  }

  async getRawData(id_archivo) {
    const [rawData] = await pool.query(
      'SELECT * FROM registrossalariales WHERE id_archivo = ?',
      [id_archivo],
    );
    if (rawData.length === 0) {
      throw new Error('No hay datos en este archivo.');
    }
    return rawData.map(({ fila_registro }) => JSON.parse(fila_registro));
  }

  async runModel(body) {
    const { id_archivo, modelType, target, features, sensitiveFeature } = body;
    const rawData = this.getRawData(id_archivo);

    try {
      const response = await axios.post(`${FLASK_API_BASE}/run-model`, {
        modelType,
        target,
        features,
        data: rawData,
        sensitiveFeature,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Re-throw custom error info to be caught in the router
        const errorMessage = error.response.data?.error || 'Bad Request';
        const err = new Error(errorMessage);
        err.status = 400;
        throw err;
      }
      throw error;
    }
  }

  async univariableDataExploration(body) {
    const { x, graphType, id_archivo } = body;
    const rawData = this.getRawData(id_archivo);

    try {
      const response = await axios.post(`${FLASK_API_BASE}/univariable`, {
        x,
        graphType,
        data: rawData,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Re-throw custom error info to be caught in the router
        const errorMessage = error.response.data?.error || 'Bad Request';
        const err = new Error(errorMessage);
        err.status = 400;
        throw err;
      }
      throw error;
    }
  }

  async bivariableDataExploration(body) {
    const { y, x, graphType, hue, id_archivo } = body;
    const rawData = this.getRawData(id_archivo);

    try {
      const response = await axios.post(`${FLASK_API_BASE}/bivariable`, {
        x,
        y,
        graphType,
        hue,
        data: rawData,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Re-throw custom error info to be caught in the router
        const errorMessage = error.response.data?.error || 'Bad Request';
        const err = new Error(errorMessage);
        err.status = 400;
        throw err;
      }
      throw error;
    }
  }

  async multivariableDataExploration(body) {
    const { cols, id_archivo } = body;
    const rawData = this.getRawData(id_archivo);

    try {
      const response = await axios.post(`${FLASK_API_BASE}/bivariable`, {
        cols,
        data: rawData,
      });
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 400) {
        // Re-throw custom error info to be caught in the router
        const errorMessage = error.response.data?.error || 'Bad Request';
        const err = new Error(errorMessage);
        err.status = 400;
        throw err;
      }
      throw error;
    }
  }
}

export default AIService;
