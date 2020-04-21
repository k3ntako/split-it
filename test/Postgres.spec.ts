import { expect } from 'chai';
import Postgres, { IPostgres, IWithId } from '../src/Postgres';
import { userTable, transactionTable } from '../src/tables';
import { IUser } from '../src/tables/UserTable';
import { ITransaction, ITransactionUser } from '../src/tables/TransactionTable';

let postgres: IPostgres;

describe('Postgres', () => {
  before(async () => {
    postgres = new Postgres();
    await userTable.create('fun user');
  });

  after(async () => {
    await postgres.end();
  });

  describe('getConfig', () => {
    it('should get config for specified environment', () => {
      const expected = {
        driver: 'pg',
        user: 'test_user',
        password: '',
        host: 'localhost',
        database: 'split_it_test',
        port: 5432,
      };

      const config = postgres.getConfig('test');
      expect(config).to.eql(expected);
    });
  });

  describe('insert', () => {
    before(async () => {
      await postgres.query('DELETE FROM transaction_users;');
      await postgres.query('DELETE FROM transactions;');
      await postgres.query('DELETE FROM users;');
    });

    after(async () => {
      await postgres.query('DELETE FROM transaction_users;');
      await postgres.query('DELETE FROM transactions;');
      await postgres.query('DELETE FROM users;');
    });

    it('should insert a new row in users', async () => {
      const attributes = {
        first_name: 'my name',
      };

      const results: IUser[] = await postgres.insert('users', attributes);
      expect(results).to.have.lengthOf(1);
      expect(results[0].id).to.be.a('number');
      expect(results[0].first_name).to.equal(attributes.first_name);

      const users = await postgres.query("SELECT * FROM users WHERE first_name='my name';");
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

      const results: ITransaction[] = await postgres.insert('transactions', attributes);
      expect(results).to.have.lengthOf(1);
      expect(results[0].id).to.be.a('number');
      expect(results[0].name).to.equal(attributes.name);
      expect(results[0].cost).to.equal(attributes.cost);
      expect(results[0].date).to.eql(date);

      const transactions = await postgres.query('SELECT * FROM transactions;');
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
      await postgres.query('DELETE FROM transaction_users;');
      await postgres.query('DELETE FROM transactions;');
      await postgres.query('DELETE FROM users;');

      energizer = await userTable.create('Energizer');
      duracell = await userTable.create('Duracell');
      const eneloop: IUser & IWithId = await userTable.create('Eneloop');
      await transactionTable.create(energizer.id, duracell.id, 'Electric Bill', new Date(), 900);
      await transactionTable.create(energizer.id, duracell.id, 'Tesla', new Date(), 10000);
      await transactionTable.create(energizer.id, eneloop.id, 'Charge', new Date(), 1200);
      await transactionTable.create(duracell.id, energizer.id, 'Light bulb', new Date(), 1500);
      await transactionTable.create(duracell.id, eneloop.id, 'Gas Generator', new Date(), 2000);
    });

    after(async () => {
      await postgres.query('DELETE FROM transaction_users;');
      await postgres.query('DELETE FROM transactions;');
      await postgres.query('DELETE FROM users;');
    });

    it('should select all rows from specified table', async () => {
      const results: IUser[] = await postgres.select('users', {});
      expect(results).to.have.lengthOf(3);
      expect(results[0].id).to.be.a('number');
      expect(results[0].first_name).to.equal('Energizer');
      expect(results[1].first_name).to.equal('Duracell');
      expect(results[2].first_name).to.equal('Eneloop');
    });

    it('should select all rows from table that fulfill a criterion', async () => {
      const results: IUser[] = await postgres.select('users', {
        first_name: 'Energizer',
      });
      expect(results).to.have.lengthOf(1);
      expect(results[0].id).to.be.a('number');
      expect(results[0].first_name).to.equal('Energizer');
    });

    it('should select all rows from table that fulfill multiple criteria', async () => {
      const results: ITransactionUser[] = await postgres.select('transaction_users', {
        lender_id: energizer.id,
        amount_owed: 45000,
      });
      expect(results).to.have.lengthOf(1);
      expect(results[0].lender_id).to.equal(energizer.id);
      expect(results[0].borrower_id).to.equal(duracell.id);
      expect(results[0].amount_owed).to.equal(45000);
    });
  });

  describe('ended', () => {
    it('should return if pool ended', () => {
      const ended = postgres.ended;

      expect(ended).to.be.false;
    });
  });

  describe('end', () => {
    it('should end pool', async () => {
      await postgres.end();

      expect(postgres.ended).to.be.true;
    });
  });
});
