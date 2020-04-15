import { IDatabase } from '../Postgres';

export interface ITransaction {
  id: number;
  name: string;
  cost: number;
  date: Date;
}

export interface ITransactionUser {
  id: number;
  transaction_id: number;
  lender_id: number;
  borrower_id: number;
  amount_owed: number;
}

export interface ITransactionTable {
  database: IDatabase;
  create(lenderId: number, borrowerId: number, name: string, date: Date, cost: number): Promise<ITransaction>;
}

export default class TransactionTable implements ITransactionTable {
  database: IDatabase;
  constructor(database: IDatabase) {
    this.database = database;
  }

  async create(lenderId: number, borrowerId: number, name: string, date: Date, cost: number): Promise<ITransaction> {
    const transaction = await this.database.createTransaction(name, date, cost);

    await this.database.createTransactionUser(transaction.id, lenderId, borrowerId, cost / 2);

    return transaction;
  }
}