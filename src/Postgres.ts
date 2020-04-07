import { Pool, QueryResult } from 'pg';
import { IUser } from './models/UserTable';
import fs from 'fs';

interface IPoolConfig {
  host: string;
  database: string;
  port: number;
}

interface IPoolFileConfig {
  driver: string,
  user: string | null,
  password: string | null,
  host: string;
  database: string;
  port: number;
}

export interface IDatabase {
  createUser(name: string): Promise<IUser>;
  findUserByName(name: string): Promise<IUser | null>;
}

export interface IPool extends Pool {
  options?: {
    host: string,
    database: string,
    port: number,
    max: number,
    idleTimeoutMillis: number
  };
  ended?: boolean;
}

export interface IPostgres extends IDatabase {
  pool: IPool
  getConfig(env: string): {};
}

export default class Postgres implements IPostgres {
  pool: IPool;

  constructor(){
    const env: string = process.env.NODE_ENV || 'production';
    const config: IPoolFileConfig = this.getConfig(env);

    this.pool = this.newPool({
      host: config.host,
      database: config.database,
      port: config.port,
    });
  }

  getConfig(env: string): IPoolFileConfig {
    const file: string = fs.readFileSync(process.cwd() + '/database.json', 'utf-8');
    const json = JSON.parse(file);
    return json[env];
  }

  private newPool(config: IPoolConfig): Pool {
    return new Pool(config);
  }

  async createUser(name: string): Promise<IUser>{
    const result: QueryResult = await this.pool.query(`INSERT INTO users (name) VALUES ('${name}') RETURNING *;`);
    return result.rows[0];
  }

  async findUserByName(name: string): Promise<IUser | null> {
    const result: QueryResult = await this.pool.query(`SELECT * FROM users WHERE name='${name}';`);
    return result.rows[0];
  }
}