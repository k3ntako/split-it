import { expect } from 'chai';
import Postgres, { IPostgres } from '../src/Postgres';
import { QueryResult } from 'pg';
import { userTable } from '../src/tables';
import { IUser } from '../src/tables/UserTable';

let postgres: IPostgres;

let user1: IUser, user2: IUser;

describe('Postgres', () => {
  before(async () => {
    postgres = new Postgres();

    user1 = await userTable.create('Postgres 1');
    user2 = await userTable.create('Postgres 2');
  });

  after(async () => {
    await postgres.end();
  });

  describe('getConfig', () => {
    it('should get config for specified environment', () => {
      const expected = {
        driver: "pg",
        user: "test_user",
        password: "",
        host: "localhost",
        database: "split_it_test",
        port: 5432
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
      }

      const postgresInstance = new Postgres();
      postgresInstance.query = query;

      postgresInstance.query('SELECT * FROM users;');

      expect(calledWith).to.equal('SELECT * FROM users;');
    });
  });

  describe('createUser', () => {
    it('should save user to database', async () => {
      const firstName = 'Fun User';

      const user = await postgres.createUser(firstName);

      if (user) {
        expect(user).to.have.all.keys(['id', 'first_name']);
        expect(user.first_name).to.equal(firstName);

        const userFromDB: QueryResult = await postgres.query(`SELECT * FROM users WHERE first_name='${firstName}'`);
        expect(userFromDB.rows[0].first_name).to.equal(firstName);
      } else {
        expect.fail('Expected user to exist');
      }
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

    it('should find user from database regardless of case', async () => {
      const user = await postgres.findUserByName('fun user');

      if (user) {
        expect(user).to.have.all.keys(['id', 'first_name']);
        expect(user.first_name).to.equal('Fun User');
      } else {
        expect.fail('Expected user to exist');
      }
    });
  });

  describe('getAllUsers', () => {
    it('should find all users', async () => {
      const users = await postgres.getAllUsers();
      expect(users).to.have.lengthOf(3);

      const user = users.find(u => u.first_name === 'Fun User');

      if (user) {
        expect(user).to.have.all.keys(['id', 'first_name']);
        expect(user.first_name).to.equal('Fun User');
      } else {
        expect.fail('Expected user to exist');
      }
    });
  });

  describe('createTransaction', () => {
    it('should save transaction to database', async () => {
      const name = 'Market';
      const date = new Date();
      const cost = 10.20;

      const transaction = await postgres.createTransaction(name, date, cost);

      const dateMidnight = date;
      dateMidnight.setHours(0, 0, 0, 0);

      expect(transaction).to.eql({
        id: 1,
        name,
        date: dateMidnight,
        cost,
      });

      const queryResult: QueryResult = await postgres.query('SELECT * FROM transactions;');
      const transactionFromDB = queryResult.rows[0];
      const costAsNum = Number(transactionFromDB.cost);

      expect(transactionFromDB.name).to.equal(name);
      expect(transactionFromDB.date).to.eql(dateMidnight);
      expect(costAsNum).to.equal(cost);
    });
  });

  describe('createTransactionUser', () => {
    it('should save TransactionUser', async () => {
      const transactionId = 1;

      const transactionUser = await postgres.createTransactionUser(transactionId, user1.id, user2.id, 10.20 / 2);

      expect(transactionUser.transaction_id).to.equal(1);
      expect(transactionUser.lender_id).to.equal(user1.id);
      expect(transactionUser.borrower_id).to.equal(user2.id);
      expect(Number(transactionUser.amount_owed)).to.equal(10.20 / 2);

      const queryResult: QueryResult = await postgres.query(`SELECT * FROM transaction_users;`);

      const transactionUserDB = queryResult.rows[0];

      expect(transactionUserDB.transaction_id).to.equal(1);
      expect(transactionUserDB.lender_id).to.equal(user1.id);
      expect(transactionUserDB.borrower_id).to.equal(user2.id);
      expect(Number(transactionUserDB.amount_owed)).to.equal(10.20 / 2);
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
