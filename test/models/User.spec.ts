import { expect } from 'chai';
import User from '../../src/models/User';
import FileIO from '../../src/FileIO';

describe('User model', () => {
  describe('create', () => {
    it('should create a user', () => {
      const fileIO = new FileIO();
      const user = User.create('Kentaro', fileIO);

      expect(user).to.have.all.keys(['id', 'name']);
      expect(user.name).to.equal('Kentaro');

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
