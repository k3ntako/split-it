import { Pool, QueryResult } from 'pg';
import { IUser } from './tables/UserTable';
import fs from 'fs';

interface IPoolConfig {
  host: string;
  database: string;
  port: number;
}

interface IPoolFileConfig {
  driver: string;
  user: string | null;
  password: string | null;
  host: string;
  database: string;
  port: number;
}

export interface IDatabase {
  query(sql: string): Promise<QueryResult>;
  findUserByName(firstName: string): Promise<IUser | null>;
  getAllUsers(): Promise<IUser[]>;
  insert(tableName: string, attributes: {}): Promise<any[]>;
  end(): Promise<void>;
}

export interface IPool extends Pool {
  options?: {
    host: string;
    database: string;
    port: number;
    max: number;
    idleTimeoutMillis: number;
  };
  ended?: boolean;
}

export interface IPostgres extends IDatabase {
  getConfig(env: string): {};
  ended: boolean | undefined;
}

export default class Postgres implements IPostgres {
  private pool: IPool;

  constructor() {
    const env: string = process.env.NODE_ENV || 'production';
    const config: IPoolFileConfig = this.getConfig(env);

    this.pool = this.newPool({
      host: config.host,
      database: config.database,
      port: config.port,
    });

    this.end = this.end.bind(this);
  }

  get ended(): boolean | undefined {
    return this.pool.ended;
  }

  async query(sql: string): Promise<QueryResult> {
    try {
      return await this.pool.query(sql);
    } catch (error) {
      error.message += `. Failed command: ${sql}`;
      throw error;
    }
  }

  getConfig(env: string): IPoolFileConfig {
    const file: string = fs.readFileSync(process.cwd() + '/database.json', 'utf-8');
    const json = JSON.parse(file);
    return json[env];
  }

  private newPool(config: IPoolConfig): Pool {
    return new Pool(config);
  }

  async insert(tableName: string, attributes: any): Promise<any[]> {
    const fields = Object.keys(attributes);
    const fieldsStr: string = fields.join(', ');

    const values = fields.map((field) => {
      let attribute = attributes[field];

      if (typeof attribute === 'string') {
        attribute = `'${attribute}'`;
      }

      return attribute;
    });

    const valuesStr: string = values.join(', ');

    const created: QueryResult = await this.query(
      `INSERT INTO ${tableName} (${fieldsStr}) VALUES (${valuesStr}) RETURNING *;`,
    );

    return created.rows;
  }

  async findUserByName(firstName: string): Promise<IUser | null> {
    const result: QueryResult = await this.query(`SELECT * FROM users WHERE first_name='${firstName}';`);
    return result.rows[0];
  }

  async getAllUsers(): Promise<IUser[]> {
    const result: QueryResult = await this.query('SELECT * FROM users;');

    return result.rows;
  }

  async end(): Promise<void> {
    !this.pool.ended && (await this.pool.end());
  }
}
