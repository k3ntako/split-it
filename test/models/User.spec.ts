import { expect } from 'chai';
import User from '../../src/models/User';
import MockFileIO from '../mockClasses/mockFileIO';
import del from 'del';
import { IRowWithoutId } from '../../src/FileIO';

after(async () => {
  await del([process.cwd() + '/test/data']);
});

describe('User model', () => {
  describe('create', () => {
    it('should create a user', () => {
      const mockFileIO = new MockFileIO();
      User.create('KentaroCreate', mockFileIO);

      const [tableName, data]: [string, IRowWithoutId] = mockFileIO.writeRowArguments[0];
      expect(tableName).to.equal('users');
      expect(data.name).to.equal('KentaroCreate');
    });
  });
});
