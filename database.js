import mysql from 'mysql';

export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_USER,
  port: process.env.DB_PORT,
  connectionLimit: 10,
  // Other pool configurations
});

export function query(sql, params) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Error getting database connection:', err);
        reject(err);
        return;
      }

      const startTime = Date.now();

      connection.query(sql, params, (error, results) => {
        const endTime = Date.now();
        const executionTime = endTime - startTime;

        console.log(`Query executed in ${executionTime} ms`);

        connection.release();

        if (error) {
          console.error('Error executing query:', error);
          reject(error);
          return;
        }

        resolve(results);
      });
    });
  });
}
