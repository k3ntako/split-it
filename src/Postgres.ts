import { Pool, QueryResult } from 'pg';
import { IUser } from './tables/UserTable';
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
  createUser(firstName: string): Promise<IUser>;
  findUserByName(firstName: string): Promise<IUser | null>;
  getAllUsers(): Promise<IUser[]>;
  end(): Promise<void>;
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

    this.end = this.end.bind(this);
  }

  getConfig(env: string): IPoolFileConfig {
    const file: string = fs.readFileSync(process.cwd() + '/database.json', 'utf-8');
    const json = JSON.parse(file);
    return json[env];
  }

  private newPool(config: IPoolConfig): Pool {
    return new Pool(config);
  }

  async createUser(firstName: string): Promise<IUser>{
    const result: QueryResult = await this.pool.query(`INSERT INTO users (first_name) VALUES ('${firstName}') RETURNING *;`);
    return result.rows[0];
  }

  async findUserByName(firstName: string): Promise<IUser | null> {
    const result: QueryResult = await this.pool.query(`SELECT * FROM users WHERE first_name ILIKE '${firstName}';`);
    return result.rows[0];
  }

  async getAllUsers(): Promise<IUser[]> {
    const result: QueryResult = await this.pool.query('SELECT * FROM users;');

    return result.rows;
  }

  async end(): Promise<void> {
    !this.pool.ended && await this.pool.end();
  }
}