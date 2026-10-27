import 'dotenv/config';
import app from './app.js';
import { probarConexion } from './config/db.js';

const port = Number(process.env.PORT) || 3000;

async function iniciarServidor() {
  if (!process.env.JWT_SECRET) {
    throw new Error('Falta configurar JWT_SECRET en el archivo .env');
  }

  await probarConexion();

  app.listen(port, () => console.log(`Servidor en http://localhost:${port}`));
}

iniciarServidor().catch((error) => {
  console.error('No se pudo iniciar el servidor:', error.message);
  process.exitCode = 1;
});