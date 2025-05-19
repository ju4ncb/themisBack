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
  password: config.DB_PASSWORD,
  database: config.DB_NAME,
  timezone: config.TZ,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

class AIService {
  async runModel(fileId, modelType, target, features, sensitiveFeature) {
    const [rawData] = await pool.query(
      'SELECT * FROM registrossalariales WHERE id_archivo = ?',
      [fileId],
    );

    if (rawData.length === 0) {
      throw new Error('No data found for the given file ID');
    }

    // Build data array with only selected columns
    const selectedColumns = [...features, target, sensitiveFeature];
    const filteredData = rawData.map((row) =>
      selectedColumns.map((col) => row[col]),
    );

    const dataframeLike = {
      columns: selectedColumns,
      data: filteredData,
    };

    const response = await axios.post(`${FLASK_API_BASE}/run_model`, {
      modelType,
      target,
      features,
      data: dataframeLike,
      sensitiveFeature,
    });

    return response.data;
  }
}

export default AIService;
