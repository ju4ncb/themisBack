import { Router } from 'express';
import ArchivosSalarialesService from '../services/archivosSalarialesService.js';

const router = Router();

const archivosSalarialesApi = (app) => {
  app.use('/api/archivossalariales', router);
  const archivosSalarialesService = new ArchivosSalarialesService();

  // Obtener todos los archivos salariales
  router.get('/', async (req, res) => {
    try {
      const archivos = await archivosSalarialesService.getArchivosSalariales();
      res.json(archivos);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: 'Error al obtener los archivos salariales' });
    }
  });

  // Obtener un archivo salarial por id_archivo
  router.get('/:id_archivo', async (req, res) => {
    try {
      const archivo = await archivosSalarialesService.getArchivoSalarial(
        req.params.id_archivo,
      );
      if (!archivo) {
        return res.status(404).json({ error: 'Archivo no encontrado' });
      }
      res.json(archivo);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al obtener el archivo salarial' });
    }
  });

  // Crear un nuevo archivo salarial
  router.post('/', async (req, res) => {
    try {
      const { registros, ...archivo } = req.body;
      const nuevoArchivo =
        await archivosSalarialesService.createArchivoSalarial(
          archivo,
          registros,
        );
      res.status(201).json(nuevoArchivo);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al crear el archivo salarial' });
    }
  });

  // Actualizar un archivo salarial existente
  router.put('/:id_archivo', async (req, res) => {
    try {
      const archivoActualizado =
        await archivosSalarialesService.updateArchivoSalarial(
          req.params.id_archivo,
          req.body,
        );
      if (!archivoActualizado) {
        return res.status(404).json({ error: 'Archivo no encontrado' });
      }
      res.json(archivoActualizado);
    } catch (error) {
      console.log(error);
      res
        .status(500)
        .json({ error: 'Error al actualizar el archivo salarial' });
    }
  });

  // Eliminar un archivo salarial
  router.delete('/:id_archivo', async (req, res) => {
    try {
      const archivoEliminado =
        await archivosSalarialesService.deleteArchivoSalarial(
          req.params.id_archivo,
        );
      if (!archivoEliminado) {
        return res.status(404).json({ error: 'Archivo no encontrado' });
      }
      res.json({ message: 'Archivo eliminado correctamente' });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al eliminar el archivo salarial' });
    }
  });
};

export default archivosSalarialesApi;
