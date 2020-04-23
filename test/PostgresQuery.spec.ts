import { expect } from 'chai';
import PG_Interface from '../src/PG_Interface';
import PostgresQuery, { IWithId } from '../src/PostgresQuery';
import { userTable, transactionTable } from '../src/tables';
import { IUser } from '../src/tables/UserTable';
import { ITransaction, ITransactionUser } from '../src/tables/TransactionTable';
import { ITransactionsWithUsers } from '../src/pages/ViewTransactionPage/TransactionFormatter';

let pgInterface: PG_Interface, postgresQuery: PostgresQuery;

describe('PostgresQuery', () => {
  before(async () => {
    pgInterface = new PG_Interface();
    postgresQuery = new PostgresQuery(pgInterface);

    await userTable.create('fun user');
  });

  after(async () => {
    await pgInterface.end();
  });

  describe('insert', () => {
    before(async () => {
      await pgInterface.query('DELETE FROM transaction_users;');
      await pgInterface.query('DELETE FROM transactions;');
      await pgInterface.query('DELETE FROM users;');
    });

    after(async () => {
      await pgInterface.query('DELETE FROM transaction_users;');
      await pgInterface.query('DELETE FROM transactions;');
      await pgInterface.query('DELETE FROM users;');
    });

    it('should insert a new row in users', async () => {
      const attributes = {
        first_name: 'my name',
      };

      const results: IUser[] = await postgresQuery.insert('users', attributes);
      expect(results).to.have.lengthOf(1);
      expect(results[0].id).to.be.a('number');
      expect(results[0].first_name).to.equal(attributes.first_name);

      const users = await pgInterface.query("SELECT * FROM users WHERE first_name='my name';");
      expect(users.rows).to.have.lengthOf(1);
      expect(users.rows[0].id).to.be.a('number');
      expect(users.rows[0].first_name).to.equal(attributes.first_name);
    });

    it('should insert a new row in transactions', async () => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      const dateStr = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

      const attributes = {
        name: 'Pineapple',
        cost: 1000,
        date: dateStr,
      };

      const results: ITransaction[] = await postgresQuery.insert('transactions', attributes);
      expect(results).to.have.lengthOf(1);
      expect(results[0].id).to.be.a('number');
      expect(results[0].name).to.equal(attributes.name);
      expect(results[0].cost).to.equal(attributes.cost);
      expect(results[0].date).to.eql(date);

      const transactions = await pgInterface.query('SELECT * FROM transactions;');
      expect(transactions.rows).to.have.lengthOf(1);
      expect(transactions.rows[0].id).to.be.a('number');
      expect(transactions.rows[0].name).to.equal(attributes.name);
      expect(transactions.rows[0].cost).to.equal(attributes.cost);
      expect(transactions.rows[0].date).to.eql(date);
    });
  });

  describe('select', () => {
    let energizer: IUser & IWithId, duracell: IUser & IWithId;
    before(async () => {
      await pgInterface.query('DELETE FROM transaction_users;');
      await pgInterface.query('DELETE FROM transactions;');
      await pgInterface.query('DELETE FROM users;');

      energizer = await userTable.create('Energizer');
      duracell = await userTable.create('Duracell');
      const eneloop: IUser & IWithId = await userTable.create('Eneloop');
      await transactionTable.create(energizer.id, duracell.id, 'Electric Bill', new Date('1/11/2012'), 900);
      await transactionTable.create(energizer.id, duracell.id, 'Tesla', new Date('3/25/3020'), 10000);
      await transactionTable.create(energizer.id, eneloop.id, 'Charge', new Date('9/29/2009'), 1200);
      await transactionTable.create(duracell.id, energizer.id, 'Light bulb', new Date('12/09/1932'), 1500);
      await transactionTable.create(duracell.id, eneloop.id, 'Gas Generator', new Date('10/10/1990'), 2000);
    });

    after(async () => {
      await pgInterface.query('DELETE FROM transaction_users;');
      await pgInterface.query('DELETE FROM transactions;');
      await pgInterface.query('DELETE FROM users;');
    });

    it('should select all rows from specified table', async () => {
      const results: IUser[] = await postgresQuery.select('users', {});
      expect(results).to.have.lengthOf(3);
      expect(results[0].id).to.be.a('number');
      expect(results[0].first_name).to.equal('Energizer');
      expect(results[1].first_name).to.equal('Duracell');
      expect(results[2].first_name).to.equal('Eneloop');
    });

    it('should select all rows from table that fulfill a criterion', async () => {
      const results: IUser[] = await postgresQuery.select('users', {
        first_name: 'Energizer',
      });
      expect(results).to.have.lengthOf(1);
      expect(results[0].id).to.be.a('number');
      expect(results[0].first_name).to.equal('Energizer');
    });

    it('should select all rows from table that fulfill multiple criteria', async () => {
      const results: ITransactionUser[] = await postgresQuery.select('transaction_users', {
        lender_id: energizer.id,
        amount_owed: 45000,
      });
      expect(results).to.have.lengthOf(1);
      expect(results[0].lender_id).to.equal(energizer.id);
      expect(results[0].borrower_id).to.equal(duracell.id);
      expect(results[0].amount_owed).to.equal(45000);
    });
  });

  describe('transactionsWithUsers', () => {
    let energizer: IUser & IWithId, duracell: IUser & IWithId, eneloop: IUser & IWithId;
    before(async () => {
      await pgInterface.query('DELETE FROM transaction_users;');
      await pgInterface.query('DELETE FROM transactions;');
      await pgInterface.query('DELETE FROM users;');

      energizer = await userTable.create('Energizer');
      duracell = await userTable.create('Duracell');
      eneloop = await userTable.create('Eneloop');
      await transactionTable.create(energizer.id, duracell.id, 'Electric Bill', new Date('1/11/2012'), 900);
      await transactionTable.create(energizer.id, duracell.id, 'Tesla', new Date('3/25/3020'), 10000);
      await transactionTable.create(energizer.id, eneloop.id, 'Charge', new Date('9/29/2009'), 1200);
      await transactionTable.create(duracell.id, energizer.id, 'Light bulb', new Date('12/09/1932'), 1500);
      await transactionTable.create(duracell.id, eneloop.id, 'Gas Generator', new Date('10/10/1990'), 2000);
    });

    after(async () => {
      await pgInterface.query('DELETE FROM transaction_users;');
      await pgInterface.query('DELETE FROM transactions;');
      await pgInterface.query('DELETE FROM users;');
    });

    it('should return relevant columns from users, transactions_users, and transactions tables', async () => {
      const results: ITransactionsWithUsers[] = await postgresQuery.transactionsWithUsers(energizer.id, null, 0);
      expect(results).to.be.an('array');
      expect(results).to.have.lengthOf(4);
      expect(results[0]).to.have.keys([
        'transaction_name',
        'cost',
        'date',
        'lender_name',
        'borrower_name',
        'amount_owed',
      ]);

      expect(results[0]).eql({
        transaction_name: 'Tesla',
        cost: 1000000,
        date: new Date('3/25/3020'),
        lender_name: 'Energizer',
        borrower_name: 'Duracell',
        amount_owed: 500000,
      });

      expect(results[1]).eql({
        transaction_name: 'Electric Bill',
        cost: 90000,
        date: new Date('1/11/2012'),
        lender_name: 'Energizer',
        borrower_name: 'Duracell',
        amount_owed: 45000,
      });

      expect(results[2]).eql({
        transaction_name: 'Charge',
        cost: 120000,
        date: new Date('9/29/2009'),
        lender_name: 'Energizer',
        borrower_name: 'Eneloop',
        amount_owed: 60000,
      });

      expect(results[3]).eql({
        transaction_name: 'Light bulb',
        cost: 150000,
        date: new Date('12/09/1932'),
        lender_name: 'Duracell',
        borrower_name: 'Energizer',
        amount_owed: 75000,
      });
    });

    it('should only return up to the limit specified', async () => {
      const results: ITransactionsWithUsers[] = await postgresQuery.transactionsWithUsers(energizer.id, 1, 0);
      expect(results).to.have.lengthOf(1);
    });

    it('should start counting towards its limit after its offset', async () => {
      // Total of 12 transactions for active user (energizer)
      await transactionTable.create(energizer.id, duracell.id, 'Electric Bill', new Date('1/11/2012'), 900);
      await transactionTable.create(energizer.id, duracell.id, 'Tesla', new Date('3/25/3020'), 10000);
      await transactionTable.create(energizer.id, eneloop.id, 'Charge', new Date('9/29/2009'), 1200);
      await transactionTable.create(duracell.id, energizer.id, 'Light bulb', new Date('12/09/1932'), 1500);
      await transactionTable.create(energizer.id, duracell.id, 'Electric Bill', new Date('1/11/2012'), 900);
      await transactionTable.create(energizer.id, duracell.id, 'Tesla', new Date('3/25/3020'), 10000);
      await transactionTable.create(energizer.id, eneloop.id, 'Charge', new Date('9/29/2009'), 1200);
      await transactionTable.create(duracell.id, energizer.id, 'Light bulb', new Date('12/09/1932'), 1500);

      const results: ITransactionsWithUsers[] = await postgresQuery.transactionsWithUsers(energizer.id, null, 10);
      expect(results).to.have.lengthOf(2);
    });

    it('should be able to LIMIT and OFFSET', async () => {
      const results: ITransactionsWithUsers[] = await postgresQuery.transactionsWithUsers(energizer.id, 1, 10);
      expect(results).to.have.lengthOf(1);
    });
  });
});
