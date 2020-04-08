import { expect } from 'chai';
import { userTable } from '../../src/tables';

describe('UserTable model', () => {
  describe('create', () => {
    it('should create a user and save name as Title Case', async () => {
      await userTable.create('User table model 1');

      const user = await userTable.database.findUserByName('User table model 1');

      if (user) {
        expect(user.name).to.equal('User Table Model 1');
      } else {
        expect.fail('Expected user to exist');
      }
    });
  });

  describe('validate', () => {
    it('should throw error given a blank name', async () => {
      try {
        await userTable.validate('');
        expect.fail('Expected UserTable.validate to throw error');
      } catch (error) {
        expect(error.message).to.equal('Name cannot be blank');
      }
    });

    it('should throw error given a name already exists in db', async () => {
      await userTable.create('UserModelCreate2');

      try {
        await userTable.validate('Usermodelcreate2');
        expect.fail('Expected UserTable.validate to throw error');
      } catch (error) {
        expect(error.message).to.equal('The name, Usermodelcreate2, is already taken.');
      }
    });
  });

  describe('findByName', () => {
    it('should find user by name regardless of case', async () => {
      const user = await userTable.findByName('UserModelCreate2');
      expect(user).to.have.all.keys(['id', 'name']);

      if (user){
        expect(user.id).to.be.a('number');
        expect(user.name).to.equal('Usermodelcreate2');
      } else {
        expect.fail('Expected user to exist');
      }
    });
  });
});
