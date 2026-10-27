import db from '../config/db.js';

export async function buscarPorEmail(email) {
  const [filas] = await db.execute(
    'SELECT id, nombre, email, password_hash FROM usuarios WHERE email = ? LIMIT 1',
    [email]
  );
  return filas[0] || null;
}

export async function crear({ nombre, email, passwordHash }) {
  const [resultado] = await db.execute(
    'INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, ?)',
    [nombre, email, passwordHash]
  );

  return {
    id: resultado.insertId,
    nombre,
    email
  };
}
