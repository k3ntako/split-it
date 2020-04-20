import { expect } from 'chai';
import Postgres, { IPostgres } from '../src/Postgres';
import { userTable } from '../src/tables';
import { IUser } from '../src/tables/UserTable';
import { ITransaction } from '../src/tables/TransactionTable';

let postgres: IPostgres;

describe('Postgres', () => {
  before(async () => {
    postgres = new Postgres();
    userTable.create('fun user');
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

  describe('query', () => {
    it('should get config for specified environment', () => {
      let calledWith = null;

      const query = (sql: any): any => {
        calledWith = sql;
      };

      const postgresInstance = new Postgres();
      postgresInstance.query = query;

      postgresInstance.query('SELECT * FROM users;');

      expect(calledWith).to.equal('SELECT * FROM users;');
    });
  });

  describe('findUserByName', () => {
    it('should find user from database', async () => {
      const firstName = 'Fun User';

      const user = await postgres.findUserByName(firstName);

      if (user) {
        expect(user).to.have.all.keys(['id', 'first_name']);
        expect(user.first_name).to.equal(firstName);
      } else {
        expect.fail('Expected user to exist');
      }
    });
  });

  describe('getAllUsers', () => {
    it('should find all users', async () => {
      const users = await postgres.getAllUsers();
      expect(users).to.have.lengthOf(1);

      const user = users.find((u) => u.first_name === 'Fun User');

      if (user) {
        expect(user).to.have.all.keys(['id', 'first_name']);
        expect(user.first_name).to.equal('Fun User');
      } else {
        expect.fail('Expected user to exist');
      }
    });
  });

  describe('insert', () => {
    before(async () => {
      await postgres.query('DELETE FROM transaction_users;');
      await postgres.query('DELETE FROM transactions;');
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
