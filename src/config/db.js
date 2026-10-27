import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'tareas_app',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export async function probarConexion() {
  try {
    const [filas] = await pool.query('SELECT 1 + 1 AS resultado');
    console.log('Conexión a MySQL exitosa:', filas[0].resultado);
  } catch (error) {
    console.error('Error al conectar a MySQL:', error.message);
    throw error;
  }
}

export default pool;
