import { expect } from 'chai';
import Postgres, { IPostgres, IPool } from '../src/Postgres';
import { Pool, QueryResult } from 'pg';

let postgres: IPostgres;

describe('Postgres', () => {
  before(() => {
    postgres = new Postgres();
  });

  after(() => {
    const pool: IPool = postgres.pool;
    !pool.ended && pool.end();
  });

  describe('constructor', () => {
    it('should be initialized with a pool based on config and env', () => {
      const pool: IPool = postgres.pool;
      expect(pool).to.be.instanceOf(Pool);
      expect(pool.options && pool.options.database).to.equal('split_it_test');
    });
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

  describe('createUser', () => {
    it('should save user to database', async () => {
      const name = 'FunUser';

      const user = await postgres.createUser(name);

      expect(user).to.eql({
        id: 1,
        name,
      });

      const userFromDB: QueryResult = await postgres.pool.query(`SELECT * FROM users WHERE name='${name}'`);
      expect(userFromDB.rows[0].name).to.equal(name);
    });
  });

  describe('findUserByName', () => {
    it('should find user from database', async () => {
      const name = 'FunUser';

      const user = await postgres.findUserByName(name);

      expect(user).to.eql({
        id: 1,
        name,
      });
    });
  });

  describe('end', () => {
    it('should end pool', async () => {
      await postgres.end();

      expect(postgres.pool.ended).to.be.true;
    });
  });
});
