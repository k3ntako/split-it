import { expect } from 'chai';
import Postgres from '../src/Postgres';
import { Pool, QueryResult } from 'pg';

const pool = new Pool({
  host: 'localhost',
  database: 'split_it',
  port: 5432,
});

describe('Postgres', () => {
  describe('createUser', () => {
    it('should save user to database', async () => {
      const postgresIO = new Postgres;
      const name = 'FunUser';

      const user = await postgresIO.createUser(name);

      expect(user).to.eql({
        id: 1,
        name,
      });

      const userFromDB: QueryResult = await pool.query(`SELECT * FROM users WHERE name='${name}'`);
      expect(userFromDB.rows[0].name).to.equal(name);
    });
  });

  describe('findUserByName', () => {
    it('should save user to database', async () => {
      const postgresIO = new Postgres;
      const name = 'FunUser';

      const user = await postgresIO.findUserByName(name);

      expect(user).to.eql({
        id: 1,
        name,
      });
    });
  });
});
