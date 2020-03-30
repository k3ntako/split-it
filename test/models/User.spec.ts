import { expect } from 'chai';
import User from '../../src/models/User';
import FileIO from '../../src/FileIO';
import del from 'del';

after(async () => {
  await del([process.cwd() + '/test/data']);
});

describe('User model', () => {
  describe('create', () => {
    it('should create a user', () => {
      const fileIO = new FileIO();
      const user = User.create('KentaroCreate', fileIO);

      expect(user).to.have.all.keys(['id', 'name']);
      expect(user.name).to.equal('KentaroCreate');

      const userInFile = fileIO.readRow('users', user.id);

      if (userInFile){
        expect(userInFile.id).to.equal(user.id);
        expect(userInFile.name).to.equal(user.name);
      } else {
        expect(userInFile).to.exist;
      } 
    });
  });
});
