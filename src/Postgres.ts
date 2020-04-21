import { Pool, QueryResult } from 'pg';
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
  insert<T extends Record<string, any>>(tableName: string, attributes: T): Promise<(T & IWithId)[]>;
  select(tableName: string, attributes: Record<string, any>): Promise<any[]>;
  end(): Promise<void>;
}

export interface IWithId {
  id: number;
  [key: string]: any;
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

  async insert(tableName: string, attributes: Record<string, any>): Promise<any[]> {
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

  async select(tableName: string, attributes: Record<string, any>): Promise<(Record<string, any> & IWithId)[]> {
    const whereArr = Object.keys(attributes).map((field) => {
      let value: any = attributes[field];
      if (typeof value === 'string') {
        value = `'${value}'`;
      }
      return `${field}=${value}`;
    });

    const whereStr = whereArr.length ? `WHERE ${whereArr.join(' AND ')}` : '';

    const results: QueryResult = await this.query(`SELECT * FROM ${tableName} ${whereStr};`);
    return results.rows;
  }

  async end(): Promise<void> {
    !this.pool.ended && (await this.pool.end());
  }
}
