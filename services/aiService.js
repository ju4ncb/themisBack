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
  async runModel(body) {
    const { fileId, modelType, target, features, sensitiveFeature } = body;
    const [rawData] = await pool.query(
      'SELECT * FROM registrossalariales WHERE id_archivo = ?',
      [fileId],
    );

    if (rawData.length === 0) {
      throw new Error('No data found for the given file ID');
    }

    const response = await axios.post(`${FLASK_API_BASE}/run-model`, {
      modelType,
      target,
      features,
      data: rawData.map(({ fila_registro }) => JSON.parse(fila_registro)),
      sensitiveFeature,
    });

    return response.data;
  }
  async exploreData(body) {
    const { y, x, graphType, hue, id_archivo } = body;
    const [rawData] = await pool.query(
      'SELECT * FROM registrossalariales WHERE id_archivo = ?',
      [id_archivo],
    );

    if (rawData.length === 0) {
      throw new Error('No data found for the given file ID');
    }

    const response = await axios.post(`${FLASK_API_BASE}/explore-data`, {
      x,
      y,
      graphType,
      hue,
      data: rawData.map(({ fila_registro }) => JSON.parse(fila_registro)),
    });

    return response.data;
  }
}

export default AIService;
