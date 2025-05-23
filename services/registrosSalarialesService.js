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

class RegistrosSalarialesService {
  async getRegistrosSalariales() {
    const [rows] = await pool.query('SELECT * FROM registrossalariales');
    return rows;
  }

  async getRegistroSalarial(id_registro) {
    const [rows] = await pool.query(
      'SELECT * FROM registrossalariales WHERE id_registro = ?',
      [id_registro],
    );
    return rows[0];
  }

  async getRegistrosByIdArchivo(id_archivo) {
    const [rows] = await pool.query(
      'SELECT * FROM registrossalariales WHERE id_archivo = ?',
      [id_archivo],
    );
    return rows;
  }

  async createRegistroSalarial(registro) {
    const { id_archivo, fila_registro } = registro;
    const [result] = await pool.query(
      `INSERT INTO registrossalariales 
                (id_archivo, fila_registro, created_at, updated_at)
                VALUES (?, ?, ?, ?)`,
      [id_archivo, fila_registro, new Date(), new Date()],
    );
    return { id_registro: result.insertId, ...registro };
  }

  async updateRegistroSalarial(id_registro, registro) {
    const { id_archivo, fila_registro } = registro;

    // Verificar si el registro existe
    const [rows] = await pool.query(
      'SELECT * FROM registrossalariales WHERE id_registro = ?',
      [id_registro],
    );
    if (rows.length === 0) {
      throw new Error('Registro no encontrado');
    }

    // Actualizar el registro usando COALESCE
    await pool.query(
      `UPDATE registrossalariales SET 
                id_archivo = COALESCE(?, id_archivo),
                fila_registro = COALESCE(?, fila_registro),
                updated_at = ?
                WHERE id_registro = ?`,
      [id_archivo, fila_registro, new Date(), id_registro],
    );

    // Devolver el registro actualizado
    const [updatedRows] = await pool.query(
      'SELECT * FROM registrossalariales WHERE id_registro = ?',
      [id_registro],
    );
    return updatedRows[0];
  }

  async deleteRegistroSalarial(id_registro) {
    await pool.query('DELETE FROM registrossalariales WHERE id_registro = ?', [
      id_registro,
    ]);
    return { id_registro };
  }
}

export default RegistrosSalarialesService;
