import { QueryResult } from 'pg';
import PG_Interface from './PG_Interface';

export interface IWithId {
  id: number;
  [key: string]: any;
}

export interface IDatabase {
  insert<T extends Record<string, any>>(tableName: string, attributes: T): Promise<(T & IWithId)[]>;
  select(tableName: string, attributes: Record<string, any>): Promise<any[]>;
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
}
