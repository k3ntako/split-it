const { Pool } = require("pg");
const fs = require('fs');

const createDatabase = async () => {
  try {
    const env = process.env.NODE_ENV || 'production';
    const file = fs.readFileSync(process.cwd() + '/database.json', 'utf-8');
    const json = JSON.parse(file);
    const config = json[env];

    const pool = new Pool({
      host: config.host,
      port: config.port,
    });

    await pool.query(`CREATE DATABASE ${config.database}`);
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = createDatabase;