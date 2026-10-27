export function manejarErrores(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  console.error(error);

  if (error.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ mensaje: 'El registro ya existe' });
  }

  return res.status(500).json({ mensaje: 'Error interno del servidor' });
}
