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

class ArchivosSalarialesService {
  async getArchivosSalariales() {
    const [rows] = await pool.query('SELECT * FROM archivossalariales');
    return rows;
  }

  async getArchivoSalarial(id_archivo) {
    const [rows] = await pool.query(
      'SELECT * FROM archivossalariales WHERE id_archivo = ?',
      [id_archivo],
    );
    return rows[0];
  }

  async createArchivoSalarial(archivo, registros) {
    const { nombre_archivo, formato, tamano, id_usuario } = archivo;
    const [result] = await pool.query(
      `INSERT INTO archivossalariales 
                    (nombre_archivo, formato, tamano, id_usuario, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?)`,
      [nombre_archivo, formato, tamano, id_usuario, new Date(), new Date()],
    );
    if (Array.isArray(registros) && registros.length > 0) {
      const values = registros.map((registro) => [
        result.insertId,
        JSON.stringify(registro),
        new Date(),
        new Date(),
      ]);
      await pool.query(
        `INSERT INTO registrossalariales (id_archivo, fila_registro, created_at, updated_at) VALUES ?`,
        [values],
      );
    }
    return { id_archivo: result.insertId, ...archivo };
  }

  async updateArchivoSalarial(id_archivo, archivo) {
    const { nombre_archivo, formato, tamano, id_usuario } = archivo;

    // Verificar si el archivo existe
    const [rows] = await pool.query(
      'SELECT * FROM archivossalariales WHERE id_archivo = ?',
      [id_archivo],
    );
    if (rows.length === 0) {
      throw new Error('Archivo no encontrado');
    }

    // Actualizar el archivo usando COALESCE para mantener valores existentes si no se envían nuevos
    await pool.query(
      `UPDATE archivossalariales SET 
                    nombre_archivo = COALESCE(?, nombre_archivo),
                    formato = COALESCE(?, formato),
                    tamano = COALESCE(?, tamano),
                    id_usuario = COALESCE(?, id_usuario),
                    updated_at = ?
            WHERE id_archivo = ?`,
      [nombre_archivo, formato, tamano, id_usuario, new Date(), id_archivo],
    );

    // Devolver el archivo actualizado
    const [updatedRows] = await pool.query(
      'SELECT * FROM archivossalariales WHERE id_archivo = ?',
      [id_archivo],
    );
    return updatedRows[0];
  }

  async deleteArchivoSalarial(id_archivo) {
    await pool.query('DELETE FROM archivossalariales WHERE id_archivo = ?', [
      id_archivo,
    ]);
    return { id_archivo };
  }
}

export default ArchivosSalarialesService;
