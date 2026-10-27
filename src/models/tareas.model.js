import db from '../config/db.js';

export async function listarPorUsuario(usuarioId) {
  const [filas] = await db.execute(
    'SELECT id, usuario_id, titulo, descripcion, completada, creado_en, actualizado_en FROM tareas WHERE usuario_id = ? ORDER BY creado_en DESC',
    [usuarioId]
  );
  return filas;
}

export async function buscarPorId(id, usuarioId) {
  const [filas] = await db.execute(
    'SELECT id, usuario_id, titulo, descripcion, completada, creado_en, actualizado_en FROM tareas WHERE id = ? AND usuario_id = ? LIMIT 1',
    [id, usuarioId]
  );
  return filas[0] || null;
}

export async function crear({ usuarioId, titulo, descripcion }) {
  const [resultado] = await db.execute(
    'INSERT INTO tareas (usuario_id, titulo, descripcion) VALUES (?, ?, ?)',
    [usuarioId, titulo, descripcion]
  );
  return buscarPorId(resultado.insertId, usuarioId);
}

export async function actualizar(id, usuarioId, cambios) {
  const campos = [];
  const valores = [];

  for (const campo of ['titulo', 'descripcion', 'completada']) {
    if (cambios[campo] !== undefined) {
      campos.push(`${campo} = ?`);
      valores.push(cambios[campo]);
    }
  }

  if (campos.length === 0) {
    return buscarPorId(id, usuarioId);
  }

  valores.push(id, usuarioId);
  const [resultado] = await db.execute(
    `UPDATE tareas SET ${campos.join(', ')} WHERE id = ? AND usuario_id = ?`,
    valores
  );

  if (resultado.affectedRows === 0) {
    return null;
  }

  return buscarPorId(id, usuarioId);
}

export async function alternarCompletada(id, usuarioId) {
  const [resultado] = await db.execute(
    'UPDATE tareas SET completada = NOT completada WHERE id = ? AND usuario_id = ?',
    [id, usuarioId]
  );
  return resultado.affectedRows > 0;
}

export async function eliminar(id, usuarioId) {
  const [resultado] = await db.execute(
    'DELETE FROM tareas WHERE id = ? AND usuario_id = ?',
    [id, usuarioId]
  );
  return resultado.affectedRows > 0;
}
