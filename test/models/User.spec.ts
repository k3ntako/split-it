import { expect } from 'chai';
import User from '../../src/models/User';
import MockPostgresIO from '../mockClasses/mockPostgresIO';

describe('User model', () => {
  describe('create', () => {
    it('should create a user', async () => {
      const mockPostgresIO = new MockPostgresIO();
      await User.create('UserModelCreate1', mockPostgresIO);

      expect(mockPostgresIO.createUserArguments[0]).to.equal('UserModelCreate1');
    });
  });

  describe('validate', () => {
    it('should throw error given a blank name', async () => {
      const mockPostgresIO = new MockPostgresIO();

      try {
        await User.validate('', new MockPostgresIO());
        expect.fail('Expected User.validate to throw error');
      } catch (error) {
        expect(error.message).to.equal('Name cannot be blank');
      }

      expect(mockPostgresIO.createUserArguments).to.have.lengthOf(0);
    });

    it('should throw error given a name already exists in db', async () => {
      const mockPostgresIO = new MockPostgresIO();
      User.create('UserModelCreate2', mockPostgresIO);

      try {
        await User.validate('', new MockPostgresIO());
        expect.fail('Expected User.validate to throw error');
      } catch (error) {
        expect(error.message).to.equal('Name cannot be blank');
      }
    });
  });
});
