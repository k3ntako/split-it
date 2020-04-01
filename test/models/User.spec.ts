import { expect } from 'chai';
import User from '../../src/models/User';
import MockFileIO from '../mockClasses/mockFileIO';
import del from 'del';
import FileIO, { IRow } from '../../src/FileIO';

after(async () => {
  await del([process.cwd() + '/test/data']);
});

describe('User model', () => {
  describe('create', () => {
    it('should create a user', () => {
      const mockFileIO = new MockFileIO();
      User.create('UserModelCreate1', mockFileIO);

      const [tableName, data]: [string, IRow] = mockFileIO.writeRowArguments[0];
      expect(tableName).to.equal('users');
      expect(data.name).to.equal('UserModelCreate1');
    });
  });

  describe('validate', () => {
    it('should throw error given a blank name', () => {
      const mockFileIO = new MockFileIO();
      expect(() => User.validate('', mockFileIO)).to.throw(Error);

      expect(mockFileIO.writeRowArguments).to.have.lengthOf(0);
    });

    it('should throw error given a name already exists in db', () => {
      const fileIO = new FileIO('/test/data');
      User.create('UserModelCreate2', fileIO);

      const userCreateMethod = () => User.validate('UserModelCreate2', fileIO);
      expect(userCreateMethod).to.throw(Error);
    });

    it('should throw error given a name already exists in db regardless of case', () => {
      const fileIO = new FileIO('/test/data');
      User.create('UserModelCreate3', fileIO);

      // Lowercase name - still should throw error
      const userCreateMethod = () => User.validate('UserModelCreate3'.toLowerCase(), fileIO);
      expect(userCreateMethod).to.throw(Error);
    });
  });
});
