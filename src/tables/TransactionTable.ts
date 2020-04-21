import { IDatabase } from '../PostgresQuery';

export interface ITransaction {
  id: number;
  name: string;
  cost: number;
  date: Date | string;
}

export interface ITransactionUser {
  transaction_id: number;
  lender_id: number;
  borrower_id: number;
  amount_owed: number;
}

export interface ITransactionTable {
  create(lenderId: number, borrowerId: number, name: string, date: Date, cost: number): Promise<ITransaction>;
}

export default class TransactionTable implements ITransactionTable {
  private databaseQuery: IDatabase;
  constructor(databaseQuery: IDatabase) {
    this.databaseQuery = databaseQuery;
  }

  async create(lenderId: number, borrowerId: number, name: string, date: Date, cost: number): Promise<ITransaction> {
    typeof cost === 'number' && (cost *= 100); // cost saved in cents

    this.validate(name, date, cost);

    const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

    const amountOwed: number = this.splitCost(cost);

    const transactions: ITransaction[] = await this.databaseQuery.insert('transactions', {
      name,
      date: dateStr,
      cost,
    });

    await this.databaseQuery.insert('transaction_users', {
      transaction_id: transactions[0].id,
      lender_id: lenderId,
      borrower_id: borrowerId,
      amount_owed: amountOwed,
    });

    return transactions[0];
  }

  private validate(name: string, date: Date, cost: number) {
    if (!name || !name.trim()) {
      throw new Error('Name cannot be blank');
    }

    if (!(date instanceof Date)) {
      throw new Error('Expected date to be instance of date');
    }

    if (isNaN(cost) || typeof cost !== 'number') {
      throw new Error('Expected cost to be a number');
    }

    if (cost <= 0) {
      throw new Error('Expected cost to be a positive number');
    }

    if (cost % 1) {
      throw new Error('Cost cannot go past the hundredths');
    }
  }

  private splitCost(cost: number): number {
    let half = cost / 2;

    if (cost % 2) {
      const rounder = Math.floor(Math.random() * 2) ? Math.floor : Math.ceil;
      half = rounder(half);
    }

    return half;
  }
}
