import { expect } from 'chai';
import PostgresIO from '../src/PostgresIO';
import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  database: 'split_it',
  port: 5432,
});

describe('PostgresIO', () => {
  describe('createUser', () => {
    it('should save user to database', async () => {
      const postgresIO = new PostgresIO;
      const name = 'FunUser';

      const user = await postgresIO.createUser(name);

      expect(user).to.eql({
        id: 1,
        name,
      });

      const userFromDB: any = await pool.query(`SELECT * FROM users WHERE name='${name}'`);
      expect(userFromDB.rows[0].name).to.equal(name);
    });
  });

  describe('findUserByName', () => {
    it('should save user to database', async () => {
      const postgresIO = new PostgresIO;
      const name = 'FunUser';

      const user = await postgresIO.findUserByName(name);

      expect(user).to.eql({
        id: 1,
        name,
      });
    });
  });
});
