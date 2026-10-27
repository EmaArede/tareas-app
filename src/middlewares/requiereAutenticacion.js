import jwt from 'jsonwebtoken';

export function requiereAutenticacion(req, res, next) {
  const encabezado = req.headers.authorization;
  const [tipo, token] = encabezado ? encabezado.split(' ') : [];

  if (tipo !== 'Bearer' || !token) {
    return res.status(401).json({ mensaje: 'Se requiere un token Bearer' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = { id: payload.id };
    return next();
  } catch (error) {
    return res.status(401).json({ mensaje: 'Token inválido o expirado' });
  }
}
