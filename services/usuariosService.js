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

class UsuariosService {
  async getUsuarios() {
    const [rows] = await pool.query('SELECT * FROM usuarios');
    return rows;
  }

  async getUsuario(nombreusuario) {
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE nombreusuario = ?',
      [nombreusuario],
    );
    return rows[0];
  }

  async getUsuarioByCorreoOrUsuario(correoOrUsuario) {
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE nombreusuario = ? OR correo = ?',
      [correoOrUsuario, correoOrUsuario],
    );
    return rows[0];
  }

  async createUsuario(usuario) {
    const {
      nombreusuario,
      nombres,
      apellidos,
      direccion,
      telefono,
      correo,
      contrasena_hash,
      id_rol,
    } = usuario;
    const [result] = await pool.query(
      `INSERT INTO usuarios 
            (nombreusuario, nombres, apellidos, direccion, telefono, correo, contrasena_hash, id_rol, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        nombreusuario,
        nombres,
        apellidos,
        direccion,
        telefono,
        correo,
        contrasena_hash,
        id_rol,
        new Date(),
        new Date(),
      ],
    );
    return { id_usuario: result.insertId, ...usuario };
  }

  async updateUsuario(nombreusuario, usuario) {
    const {
      nombreusuario: nuevoNombreusuario,
      nombres,
      apellidos,
      direccion,
      telefono,
      correo,
      contrasena_hash,
      id_rol,
    } = usuario;

    // Verificar si el usuario existe
    const [rows] = await pool.query(
      'SELECT * FROM usuarios WHERE nombreusuario = ?',
      [nombreusuario],
    );
    if (rows.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    // Si se quiere cambiar el nombreusuario, verificar que el nuevo no exista
    if (nuevoNombreusuario && nuevoNombreusuario !== nombreusuario) {
      const [existing] = await pool.query(
        'SELECT * FROM usuarios WHERE nombreusuario = ?',
        [nuevoNombreusuario],
      );
      if (existing.length > 0) {
        throw new Error('El nuevo nombreusuario ya está en uso');
      }
    }

    // Actualizar el usuario usando COALESCE para mantener valores existentes si no se envían nuevos
    await pool.query(
      `UPDATE usuarios SET 
            nombreusuario = COALESCE(?, nombreusuario),
            nombres = COALESCE(?, nombres),
            apellidos = COALESCE(?, apellidos),
            direccion = COALESCE(?, direccion),
            telefono = COALESCE(?, telefono),
            correo = COALESCE(?, correo),
            contrasena_hash = COALESCE(?, contrasena_hash),
            id_rol = COALESCE(?, id_rol),
            updated_at = ?
        WHERE nombreusuario = ?`,
      [
        nuevoNombreusuario,
        nombres,
        apellidos,
        direccion,
        telefono,
        correo,
        contrasena_hash,
        id_rol,
        new Date(),
        nombreusuario,
      ],
    );

    // Devolver el usuario actualizado (usando el nuevo nombreusuario si fue cambiado)
    const nombreParaBuscar = nuevoNombreusuario || nombreusuario;
    const [updatedRows] = await pool.query(
      'SELECT * FROM usuarios WHERE nombreusuario = ?',
      [nombreParaBuscar],
    );
    return updatedRows[0];
  }

  async deleteUsuario(nombreusuario) {
    await pool.query('DELETE FROM usuarios WHERE nombreusuario = ?', [
      nombreusuario,
    ]);
    return { nombreusuario };
  }
}

export default UsuariosService;
