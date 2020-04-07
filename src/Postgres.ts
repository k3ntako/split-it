import { Pool, QueryResult } from 'pg';
import { IUser } from './models/UserTable';

const pool = new Pool({
  host: 'localhost',
  database: 'split_it',
  port: 5432,
});

export interface IDatabase {
  createUser(name: string): Promise<IUser>;
  findUserByName(name: string): Promise<IUser | null>;
}

export default class Postgres implements IDatabase {
  async createUser(name: string): Promise<IUser>{
    const result: QueryResult = await pool.query(`INSERT INTO users (name) VALUES ('${name}') RETURNING *;`);
    return result.rows[0];
  }

  async findUserByName(name: string): Promise<IUser | null> {
    const result: QueryResult = await pool.query(`SELECT * FROM users WHERE name='${name}';`);
    return result.rows[0];
  }
}