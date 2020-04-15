import { expect } from 'chai';
import { userTable, transactionTable } from '../../src/tables';
import Postgres from '../../src/Postgres';
import { QueryResult } from 'pg';
import { ITransactionUser } from '../../src/tables/TransactionTable';

describe('UserTable model', () => {
  const postgres = new Postgres;

  before(async () => {
    await postgres.query('DELETE FROM transaction_users;');
    await postgres.query('DELETE FROM transactions;');
    await postgres.query('DELETE FROM users;');
  });

  after(async () => {
    await postgres.query('DELETE FROM transaction_users;');
    await postgres.query('DELETE FROM transactions;');
    await postgres.query('DELETE FROM users;');
    await postgres.end();
  });

  describe('create', () => {
    it('should create a Transaction and a TransactionUser', async () => {
      const user1 = await userTable.create('Transaction Table 1');
      const user2 = await userTable.create('Transaction Table 2');

      const name = 'Electric bill';
      const date = new Date();
      const cost = 1020;

      const transaction = await transactionTable.create(user1.id, user2.id, name, date, cost);

      expect(transaction).to.have.all.keys(['id', 'name', 'date', 'cost']);

      const queryResult: QueryResult = await postgres.query('SELECT * FROM transaction_users;');
      const transactionUser: ITransactionUser = queryResult.rows[0];

      if (transactionUser) {
        expect(transactionUser.transaction_id).to.equal(transaction.id);
        expect(transactionUser.lender_id).to.equal(user1.id);
        expect(transactionUser.borrower_id).to.equal(user2.id);
        expect(Number(transactionUser.amount_owed)).to.equal(transaction.cost / 2);
      } else {
        expect.fail('Expected transaction user to exist');
      }
    });
  });
});
