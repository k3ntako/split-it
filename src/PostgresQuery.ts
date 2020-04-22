import { QueryResult } from 'pg';
import PG_Interface from './PG_Interface';
import { ITransactionsWithUsers } from './pages/ViewTransactionPage/TransactionFormatter';

export interface IWithId {
  id: number;
  [key: string]: any;
}

export interface IDatabase {
  insert<T extends Record<string, any>>(tableName: string, attributes: T): Promise<(T & IWithId)[]>;
  select(tableName: string, attributes: Record<string, any>): Promise<any[]>;
  transactionsWithUsers(userId: number): Promise<ITransactionsWithUsers[]>;
}

export default class PostgresQuery implements IDatabase {
  pgInterface: PG_Interface;

  constructor(pgInterface: PG_Interface) {
    this.pgInterface = pgInterface;
  }

  async insert<T extends Record<string, any>>(tableName: string, attributes: T): Promise<(T & IWithId)[]> {
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

    const created: QueryResult = await this.pgInterface.query(
      `INSERT INTO ${tableName} (${fieldsStr}) VALUES (${valuesStr}) RETURNING *;`,
    );

    return created.rows;
  }

  async select(tableName: string, attributes: Record<string, any>): Promise<any[]> {
    const whereArr = Object.keys(attributes).map((field) => {
      let value: any = attributes[field];
      if (typeof value === 'string') {
        value = `'${value}'`;
      }
      return `${field}=${value}`;
    });

    const whereStr = whereArr.length ? `WHERE ${whereArr.join(' AND ')}` : '';

    const results: QueryResult = await this.pgInterface.query(`SELECT * FROM ${tableName} ${whereStr};`);
    return results.rows;
  }

  async transactionsWithUsers(userId: number): Promise<ITransactionsWithUsers[]> {
    const results: QueryResult = await this.pgInterface.query(`
      SELECT name AS transaction_name, cost, date, lender_name, borrower_name, amount_owed FROM transactions
      JOIN (
        SELECT users.first_name AS lender_name, tu_borrowers.* FROM users
        JOIN (
          SELECT users.first_name AS borrower_name, transaction_users.*  FROM users
          JOIN transaction_users
          ON transaction_users.borrower_id = users.id
        ) as tu_borrowers
        ON tu_borrowers.lender_id = users.id
      ) AS tu_both
      ON transactions.id = tu_both.transaction_id
      AND (tu_both.lender_id=${userId} OR tu_both.borrower_id=${userId})
      ORDER BY date DESC;
    `);

    return results.rows;
  }
}
