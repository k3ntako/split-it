import { expect } from 'chai';
import PG_Interface, { IPG_Interface } from '../src/PG_Interface';
import { userTable } from '../src/tables';

let pgInterface: IPG_Interface;

describe('PG_Interface', () => {
  before(async () => {
    pgInterface = new PG_Interface();
    await userTable.create('fun user');
  });

  after(async () => {
    await pgInterface.end();
  });

  describe('getConfig', () => {
    after(async () => {
      await pgInterface.query('DELETE FROM users;');
    });

    it('should get config for specified environment', () => {
      const expected = {
        driver: 'pg',
        user: 'test_user',
        password: '',
        host: 'localhost',
        database: 'split_it_test',
        port: 5432,
      };

      const config = pgInterface.getConfig('test');
      expect(config).to.eql(expected);
    });
  });

  describe('ended', () => {
    it('should return if pool ended', () => {
      const ended = pgInterface.ended;

      expect(ended).to.be.false;
    });
  });

  describe('end', () => {
    it('should end pool', async () => {
      await pgInterface.end();

      expect(pgInterface.ended).to.be.true;
    });
  });
});
