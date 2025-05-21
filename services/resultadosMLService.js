import mysql from 'mysql2/promise';
import config from '../server.js';

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

class ResultadosMLService {
  async getResultadosML() {
    const [rows] = await pool.query('SELECT * FROM resultadosml');
    return rows;
  }

  async getResultadoML(id_resultado) {
    const [rows] = await pool.query(
      'SELECT * FROM resultadosml WHERE id_resultado = ?',
      [id_resultado],
    );
    return rows[0];
  }

  async createResultadoML(resultado) {
    const { id_input, mse, r2 } = resultado;
    const [result] = await pool.query(
      `INSERT INTO resultadosml 
            (id_input, mse, r2, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?)`,
      [id_input, mse, r2, new Date(), new Date()],
    );
    return { id_resultado: result.insertId, ...resultado };
  }

  async updateResultadoML(id_resultado, resultado) {
    const { id_input, mse, r2 } = resultado;

    // Verificar si el resultado existe
    const [rows] = await pool.query(
      'SELECT * FROM resultadosml WHERE id_resultado = ?',
      [id_resultado],
    );
    if (rows.length === 0) {
      throw new Error('Resultado no encontrado');
    }

    // Actualizar el resultado usando COALESCE para mantener valores existentes si no se envían nuevos
    await pool.query(
      `UPDATE resultadosml SET 
            id_input = COALESCE(?, id_input),
            mse = COALESCE(?, mse),
            r2 = COALESCE(?, r2),
            updated_at = ?
        WHERE id_resultado = ?`,
      [id_input, mse, r2, new Date(), id_resultado],
    );

    // Devolver el resultado actualizado
    const [updatedRows] = await pool.query(
      'SELECT * FROM resultadosml WHERE id_resultado = ?',
      [id_resultado],
    );
    return updatedRows[0];
  }

  async deleteResultadoML(id_resultado) {
    await pool.query('DELETE FROM resultadosml WHERE id_resultado = ?', [
      id_resultado,
    ]);
    return { id_resultado };
  }
}

export default ResultadosMLService;
