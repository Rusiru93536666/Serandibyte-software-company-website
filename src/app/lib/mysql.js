import mysql from 'mysql2/promise';

let pool = null;

export const getConnection = async () => {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '12345678',
      database: process.env.DB_NAME || 'serandibyteweb',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0,
    });
  }
  return pool;
};

export const connectDB = async () => {
  try {
    const connection = await getConnection();
    await connection.getConnection();
    console.log('MySQL connected successfully');
    return connection;
  } catch (error) {
    console.error('MySQL connection error:', error);
    throw error;
  }
};

export const query = async (sql, params = []) => {
  const connection = await getConnection();
  const [rows] = await connection.execute(sql, params);
  return rows;
};

export default { getConnection, connectDB, query };