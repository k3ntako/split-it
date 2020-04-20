import { expect } from 'chai';
import { userTable } from '../../src/tables';
import Postgres from '../../src/Postgres';

describe('UserTable model', () => {
  const postgres = new Postgres();

  before(async () => {
    await postgres.query('DELETE FROM transaction_users;');
    await postgres.query('DELETE FROM transactions;');
    await postgres.query('DELETE FROM users;');
  });

  after(async () => {
    await postgres.query('DELETE FROM transaction_users;');
    await postgres.query('DELETE FROM transactions;');
    await postgres.query('DELETE FROM users;');

    await postgres.end();
  });

  describe('create', () => {
    it('should create a user and save name as Title Case', async () => {
      await userTable.create('User table model 1');

      const user = await userTable.findByName('User Table Model 1');

      if (user) {
        expect(user.first_name).to.equal('User Table Model 1');
      } else {
        expect.fail('Expected user to exist');
      }
    });

    it('should throw error given a blank name', async () => {
      try {
        await userTable.create('');
        expect.fail('Expected UserTable.create to throw error');
      } catch (error) {
        expect(error.message).to.equal('Name cannot be blank');
      }
    });

    it('should throw error given a name already exists in db', async () => {
      await userTable.create('UserModelCreate2');

      try {
        await userTable.create('Usermodelcreate2');
        expect.fail('Expected UserTable.create to throw error');
      } catch (error) {
        expect(error.message).to.equal('The name, Usermodelcreate2, is already taken.');
      }
    });
  });

  describe('findByName', () => {
    it('should find user by name', async () => {
      const user = await userTable.findByName('Usermodelcreate2');
      expect(user).to.have.all.keys(['id', 'first_name']);

      if (user) {
        expect(user.id).to.be.a('number');
        expect(user.first_name).to.equal('Usermodelcreate2');
      } else {
        expect.fail('Expected user to exist');
      }
    });
  });

  describe('getAll', () => {
    it('should find all users', async () => {
      const users = await userTable.getAll();
      expect(users).to.have.lengthOf(2);
      expect(users[0]).to.have.all.keys(['id', 'first_name']);
    });
  });
});
