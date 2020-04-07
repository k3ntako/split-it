import { expect } from 'chai';
import tables, { init } from '../../src/models';
import UserTable from '../../src/models/UserTable';
import MockPostgres from '../mockClasses/mockPostgres';

describe('tables', () => {
  describe('init', () => {
    it('should initialize tables with specified database', () => {
      init(new MockPostgres);

      expect(tables.userTable).to.be.instanceOf(UserTable);
      expect(tables.userTable.database).to.be.instanceOf(MockPostgres);
    });
  });
});
