import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as usuariosModel from '../models/usuarios.model.js';

export async function registrar(req, res, next) {
  try {
    const { nombre, email, password } = req.body || {};

    if (
      typeof nombre !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !nombre.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({ mensaje: 'nombre, email y password son obligatorios' });
    }

    const emailNormalizado = email.trim().toLowerCase();
    const existente = await usuariosModel.buscarPorEmail(emailNormalizado);

    if (existente) {
      return res.status(409).json({ mensaje: 'El email ya está registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const usuario = await usuariosModel.crear({
      nombre: nombre.trim(),
      email: emailNormalizado,
      passwordHash
    });

    return res.status(201).json({ usuario });
  } catch (error) {
    return next(error);
  }
}

export async function iniciarSesion(req, res, next) {
  try {
    const { email, password } = req.body || {};

    if (typeof email !== 'string' || typeof password !== 'string' || !email.trim() || !password) {
      return res.status(400).json({ mensaje: 'email y password son obligatorios' });
    }

    const usuario = await usuariosModel.buscarPorEmail(email.trim().toLowerCase());
    const passwordValida = usuario && await bcrypt.compare(password, usuario.password_hash);

    if (!passwordValida) {
      return res.status(401).json({ mensaje: 'Email o contraseña incorrectos' });
    }

    const token = jwt.sign(
      { id: usuario.id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    return res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
  } catch (error) {
    return next(error);
  }
}
