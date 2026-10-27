import * as tareasModel from '../models/tareas.model.js';

export async function listar(req, res, next) {
  try {
    const tareas = await tareasModel.listarPorUsuario(req.usuario.id);
    return res.json({ tareas });
  } catch (error) {
    return next(error);
  }
}

export async function obtenerPorId(req, res, next) {
  try {
    const tarea = await tareasModel.buscarPorId(req.params.id, req.usuario.id);

    if (!tarea) {
      return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    }

    return res.json({ tarea });
  } catch (error) {
    return next(error);
  }
}

export async function crear(req, res, next) {
  try {
    const { titulo, descripcion = null } = req.body || {};

    if (typeof titulo !== 'string' || !titulo.trim()) {
      return res.status(400).json({ mensaje: 'El título es obligatorio' });
    }
    if (descripcion !== null && typeof descripcion !== 'string') {
      return res.status(400).json({ mensaje: 'descripcion debe ser texto o null' });
    }

    const tarea = await tareasModel.crear({
      usuarioId: req.usuario.id,
      titulo: titulo.trim(),
      descripcion
    });

    return res.status(201).json({ tarea });
  } catch (error) {
    return next(error);
  }
}

export async function alternar(req, res, next) {
  try {
    const alternada = await tareasModel.alternarCompletada(req.params.id, req.usuario.id);
    if (!alternada) {
      return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    }

    const tarea = await tareasModel.buscarPorId(req.params.id, req.usuario.id);
    return res.json({ tarea });
  } catch (error) {
    return next(error);
  }
}

export async function eliminar(req, res, next) {
  try {
    const eliminada = await tareasModel.eliminar(req.params.id, req.usuario.id);

    if (!eliminada) {
      return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}
