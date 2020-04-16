import { expect } from 'chai';
import { userTable, transactionTable } from '../../src/tables';
import Postgres from '../../src/Postgres';
import { QueryResult } from 'pg';
import { ITransactionUser } from '../../src/tables/TransactionTable';
import { IUser } from '../../src/tables/UserTable';

describe('UserTable model', () => {
  const postgres = new Postgres;
  let user1: IUser, user2: IUser;

  const name = 'Electric Bill';
  const date = new Date();
  const cost = 1020;

  before(async () => {
    await postgres.query('DELETE FROM transaction_users;');
    await postgres.query('DELETE FROM transactions;');
    await postgres.query('DELETE FROM users;');

    user1 = await userTable.create('Transaction Table 1');
    user2 = await userTable.create('Transaction Table 2');
  });

  after(async () => {
    await postgres.query('DELETE FROM transaction_users;');
    await postgres.query('DELETE FROM transactions;');
    await postgres.query('DELETE FROM users;');
    await postgres.end();
  });

  describe('create', () => {
    it('should create a Transaction and a TransactionUser', async () => {
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

    it('should not allow blank names', async () => {
      try {
        const blankName = '';
        await transactionTable.create(user1.id, user2.id, blankName, date, cost);

        expect.fail('Expected TransactionTable.create to throw error');
      } catch (error) {
        expect(error.message).to.equal('Name cannot be blank');
      }
    });

    it('should throw error if date is not an instance of Date', async () => {
      try {
        const dateAsNull: any = null;
        await transactionTable.create(user1.id, user2.id, name, dateAsNull, cost);

        expect.fail('Expected TransactionTable.create to throw error');
      } catch (error) {
        expect(error.message).to.equal('Expected date to be instance of date');
      }
    });

    it('should throw error if cost is not a number', async () => {
      try {
        const costStr: any = '10';
        await transactionTable.create(user1.id, user2.id, name, date, costStr);

        expect.fail('Expected TransactionTable.create to throw error');
      } catch (error) {
        expect(error.message).to.equal('Expected cost to be a number');
      }
    });

    it('should throw error if cost is NaN', async () => {
      try {
        await transactionTable.create(user1.id, user2.id, name, date, NaN);

        expect.fail('Expected TransactionTable.create to throw error');
      } catch (error) {
        expect(error.message).to.equal('Expected cost to be a number');
      }
    });

    it('should throw error if cost is a negative number', async () => {
      try {
        await transactionTable.create(user1.id, user2.id, name, date, -10);

        expect.fail('Expected TransactionTable.create to throw error');
      } catch (error) {
        expect(error.message).to.equal('Expected cost to be a positive number');
      }
    });

    it('should throw error if cost is 0', async () => {
      try {
        await transactionTable.create(user1.id, user2.id, name, date, 0);

        expect.fail('Expected TransactionTable.create to throw error');
      } catch (error) {
        expect(error.message).to.equal('Expected cost to be a positive number');
      }
    });

    it('should throw error if cost goes past hundredths', async () => {
      try {
        await transactionTable.create(user1.id, user2.id, name, date, 1.111);

        expect.fail('Expected TransactionTable.create to throw error');
      } catch (error) {
        expect(error.message).to.equal('Cost cannot go past the hundredths');
      }
    });

    it('should randomly round up or down if an odd number is passed in', async () => {
      const originalMethod = transactionTable.database.createTransactionUser;

      try {
        const mockMethod = async (transactionId: number, lenderId: number, borrowerId: number, amountOwed: number): Promise<ITransactionUser> => {
          const isValid = amountOwed === 166 || amountOwed === 167; // in cents

          expect(isValid).to.be.true;

          return {
            transaction_id: transactionId,
            lender_id: lenderId,
            borrower_id: borrowerId,
            amount_owed: amountOwed,
          };
        }

        transactionTable.database.createTransactionUser = mockMethod;

        await transactionTable.create(user1.id, user2.id, name, date, 3.33);
      } catch (error) {
        throw error;
      } finally {
        transactionTable.database.createTransactionUser = originalMethod;
      }
    });
  });
});
