import { Pool, QueryResult } from 'pg';

const pool = new Pool({
  host: 'localhost',
  database: 'split_it',
  port: 5432,
});

export default class PostgresIO {
  async createUser(name: string): Promise<any>{
    const result: QueryResult = await pool.query(`INSERT INTO users (name) VALUES ('${name}') RETURNING *`);
    return result.rows[0]
  }
}