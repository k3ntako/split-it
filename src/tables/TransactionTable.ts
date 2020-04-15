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
    this.validate(name, date, cost);

    const transaction = await this.database.createTransaction(name, date, cost);

    await this.database.createTransactionUser(transaction.id, lenderId, borrowerId, cost / 2);

    return transaction;
  }

  private validate(name: string, date: Date, cost: number) {
    if (!name || !name.trim()) {
      throw new Error('Name cannot be blank');
    }

    if (!(date instanceof Date)) {
      throw new Error('Expected date to be instance of date')
    }

    if (isNaN(cost) || typeof cost !== 'number') {
      throw new Error('Expected cost to be a number')
    }

    if (cost <= 0) {
      throw new Error('Expected cost to be a positive number')
    }

    if (cost * 100 % 1) {
      throw new Error('Cost cannot go past the hundredths')
    }
  }
}
