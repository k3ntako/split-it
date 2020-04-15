import { Pool, QueryResult } from 'pg';
import { IUser } from './tables/UserTable';
import fs from 'fs';
import { ITransaction, ITransactionPerson } from './tables/TransactionTable';

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
  query(sql: string): Promise<QueryResult>;
  createUser(firstName: string): Promise<IUser>;
  findUserByName(firstName: string): Promise<IUser | null>;
  getAllUsers(): Promise<IUser[]>;
  createTransaction(name: string, date: Date, cost: number): Promise<ITransaction>;
  createTransactionPerson(transactionId: number, userId: number, amountOwed: number): Promise<ITransactionPerson>;
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

  async createUser(firstName: string): Promise<IUser> {
    const result: QueryResult = await this.query(`INSERT INTO users (first_name) VALUES ('${firstName}') RETURNING *;`);
    return result.rows[0];
  }

  async findUserByName(firstName: string): Promise<IUser | null> {
    const result: QueryResult = await this.query(`SELECT * FROM users WHERE first_name ILIKE '${firstName}';`);
    return result.rows[0];
  }

  async getAllUsers(): Promise<IUser[]> {
    const result: QueryResult = await this.query('SELECT * FROM users;');

    return result.rows;
  }

  async createTransaction(name: string, date: Date, cost: number): Promise<ITransaction> {
    const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    const result: QueryResult = await this.query(
      'INSERT INTO transactions ' +
      '(name, date, cost) ' +
      `VALUES('${name}', '${dateStr}', ${cost}) ` +
      'RETURNING *;'
    );

    const transaction: ITransaction = result.rows[0];
    transaction.cost = Number(transaction.cost); // pg does cannot safely convert decimal to JS number

    return transaction;
  }

  async createTransactionPerson(transactionId: number, userId: number, amountOwed: number): Promise<ITransactionPerson> {
    const result: QueryResult = await this.query(
      'INSERT INTO transaction_people ' +
      '(transaction_id, user_id, amount_owed) ' +
      `VALUES(${transactionId}, ${userId}, ${amountOwed}) ` +
      'RETURNING *;'
    );

    const transactionPerson: ITransactionPerson = result.rows[0];
    transactionPerson.amount_owed = Number(transactionPerson.amount_owed); // pg does cannot safely convert decimal to JS number

    return transactionPerson;
  }

  async end(): Promise<void> {
    !this.pool.ended && await this.pool.end();
  }
}