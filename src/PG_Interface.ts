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

export interface IDatabaseInterface {
  query(sql: string): Promise<QueryResult>;
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

export interface IPG_Interface extends IDatabaseInterface {
  getConfig(env: string): {};
  ended: boolean | undefined;
}

export default class PG_Interface implements IPG_Interface {
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

  async end(): Promise<void> {
    !this.pool.ended && (await this.pool.end());
  }
}
