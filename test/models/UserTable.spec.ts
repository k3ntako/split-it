import { expect } from 'chai';
import tables, { init } from '../../src/models';
import MockPostgres from '../mockClasses/mockPostgres';

const mockPostgres = new MockPostgres()

describe('UserTable model', () => {
  before(() => {
    init(mockPostgres);
  });

  describe('create', () => {
    it('should create a user', async () => {
      await tables.userTable.create('UserModelCreate1');

      expect(mockPostgres.createUserArguments[0]).to.equal('UserModelCreate1');
    });
  });

  describe('validate', () => {
    it('should throw error given a blank name', async () => {
      try {
        await tables.userTable.validate('');
        expect.fail('Expected UserTable.validate to throw error');
      } catch (error) {
        expect(error.message).to.equal('Name cannot be blank');
      }

      expect(mockPostgres.createUserArguments).to.have.lengthOf(1);
    });

    it('should throw error given a name already exists in db', async () => {
      await tables.userTable.create('UserModelCreate2');

      try {
        await tables.userTable.validate('UserModelCreate2');
        expect.fail('Expected UserTable.validate to throw error');
      } catch (error) {
        expect(error.message).to.equal('The name, UserModelCreate2, is already taken.');
      }
    });
  });
});
